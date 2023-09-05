/* eslint-disable max-len */
/* eslint-disable no-console */
import axios from 'axios';
import api from './utils/qbt';
let path = require('path');
const convert = require('xml-js');

// local-anime-backend

const AUTO_START = false;
// TODO 从请求中传
const qbtServer = {
  host: 'http://192.168.123.2:8080',
  // host: 'http://localhost:8080/',
  username: 'admin',
  password: 'adminadmin',
};

enum STATUS {
  Ready,
}

class QbtInstance {
  #status: STATUS;
  #version: string;
  qbt;

  constructor() {
    console.log('qbt init');
    this.init();
  }

  async init() {
    this.qbt = await api.connect(
      qbtServer.host,
      qbtServer.username,
      qbtServer.password,
    );

    this.#version = await this.qbt.apiVersion();
    this.#status = STATUS.Ready;

    const initInfo = {
      version: this.#version,
    };
    console.log('qbt initInfo: ', initInfo);
  }

  async addRssUrl(rssUrl: string, config: { notContainRule: string }) {
    if (this.#status !== STATUS.Ready || !this.qbt) {
      return;
    }

    // 请求默认地址
    let defaultSavePath = '';
    try {
      defaultSavePath = await this.qbt.defaultSavePath();
      console.log('defaultSavePath: ', defaultSavePath);
    } catch (error) {
      console.log('请求默认地址 error: ', error);
      return {
        success: false,
        errorInfo: error,
      };
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
      .join(defaultSavePath, `./${title}`)
      .replace(/\\/g, '/');
    console.log('newPath: ', newPath);

    // return;

    // 新增RSS订阅
    try {
      const addFeed = await this.qbt.addFeed(rssUrl, '');
      console.log('新增RSS订阅: ', addFeed);
    } catch (error) {
      console.log('新增RSS订阅 error: ', error);
      return {
        success: false,
        errorInfo: error,
      };
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
          mustNotContain: config.notContainRule,
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
