/* eslint-disable max-len */
/* eslint-disable no-console */
import axios from 'axios';
import defaultConfig from './defaultConfig';
import api from './utils/qbt';

const path = require('path');
const convert = require('xml-js');

// local-anime-backend

interface ServerConfig {
  host: string;
  username: string;
  password: string;
  defaultDownLoadPath: String
}

const AUTO_START = false;
// TODO 从请求中传
const defaultServerConfig: ServerConfig = {
  host: 'http://192.168.123.2:8080',
  username: 'admin',
  password: 'adminadmin',
  defaultDownLoadPath: '/mnt/usb2_3-1/video/tv/'
};

enum STATUS {
  Ready = 'READY',
  Failed = 'FAILED',
  UNREADY = 'UNREADY',
}

class QbtInstance {
  #status: STATUS = STATUS.UNREADY;
  #version: string;
  #serverConfig: ServerConfig = defaultServerConfig;
  qbt: any;

  constructor() {
    console.log('qbt init');
    this.init();
  }

  async init() {
    await this.initConnect();

    return true;
  }

  async setServerConfig({ serverInfo }: { serverInfo: ServerConfig }) {
    this.#serverConfig = { ...this.#serverConfig, ...serverInfo };
    console.log('setServerConfig: ');

    return await this.init();
  }

  async setReadyStatus() {
    console.log('setReadyStatus: ');
    this.#version = await this.qbt.apiVersion();
    this.#status = STATUS.Ready;
  }

  async setFailedStatus() {
    console.log('setFailedStatus: ');
    this.#version = null;
    this.#status = STATUS.Failed;
  }

  async initConnect() {
    console.log('this.#serverConfig: ', this.#serverConfig);
    // const res = await this.qbt?.shutdown?.()
    // this.qbt = null
    // console.log('shutdown: ', res);

    try {
      this.qbt = await api.connect(
        this.#serverConfig.host,
        this.#serverConfig.username,
        this.#serverConfig.password,
      );
    } catch (error) {
      console.log('error: ', error);
    }

    if (!this.qbt) {
      await this.setFailedStatus()
    } else {
      await this.setReadyStatus()
    }

    console.log('qbt initInfo: ', this.getInfo());
  }

  getStatus() {
    return this.#status;
  }

  getVersion() {
    return this.#version;
  }

  getInfo() {
    return { status: this.getStatus(), version: this.getVersion() };
  }

  getQbtServerConfig() {
    return {
      serverInfo: this.#serverConfig,
    };
  }

  async getDefaultPath() {
    // 请求默认地址
    let defaultSavePath = '';
    try {
      defaultSavePath = await this.qbt.defaultSavePath();
      console.log('defaultSavePath: ', defaultSavePath);
    } catch (error) {
      console.log('请求默认地址 error: ', error);
      return defaultConfig.defaultDownLoadPath
    }

    return defaultSavePath
  }

  async addRssUrl(rssUrl: string, config: { notContainRule: string, downLoadPath: String }) {
    console.log('addRssUrl: ');
    const { downLoadPath, notContainRule } = config
    if (this.#status !== STATUS.Ready || !this.qbt) {
      return;
    }

    // 获得RSS标题
    let title = '';
    try {
      const { data } = await axios.get(rssUrl);
      // 解析xml
      const rssJson = JSON.parse(convert.xml2json(data, { compact: true }));
      // eslint-disable-next-line no-underscore-dangle
      title = rssJson?.rss?.channel?.title?._text?.replace(
        'Mikan Project - ',
        '',
      );
    } catch (error) {
      console.log('获得RSS标题 error: ', error);
      return {
        success: false,
        errorInfo: error,
      };
    }
    console.log('获得RSS标题: ', title);

    const newPath = path
      .join(downLoadPath || this.#serverConfig.defaultDownLoadPath || await this.getDefaultPath(), `./${title}`)
      .replace(/\\/g, '/');
    console.log('下载地址: ', newPath);

    // 新增RSS订阅
    try {
      const addFeed = await this.qbt.addFeed(rssUrl, '');
      console.log('新增RSS订阅: ', addFeed);
    } catch (error) {
      console.log('新增RSS订阅 error: ', error);
      // return {
      //   success: false,
      //   errorInfo: error,
      // };
    }

    // 新增自动下载规则
    try {
      const res = await this.qbt.setRule(
        title,

        JSON.stringify({
          addPaused: null,
          affectedFeeds: [rssUrl],
          assignedCategory: '',
          enabled: AUTO_START,
          episodeFilter: '',
          ignoreDays: 0,
          lastMatch: '',
          mustContain: '',
          mustNotContain: notContainRule,
          previouslyMatchedEpisodes: [],
          // savePath: `${defaultSavePath}/${title}`,
          savePath: newPath,
          smartFilter: false,
          torrentContentLayout: null,
          useRegex: false,
        }),
      );
      console.log(`新增自动下载规则: ${res.statusText} ${res.data}`);
    } catch (error) {
      console.log('新增自动下载规则 error: ', error);
      return {
        success: false,
        errorInfo: error,
      };
    }

    return { success: true };
  }
}

export default new QbtInstance();
