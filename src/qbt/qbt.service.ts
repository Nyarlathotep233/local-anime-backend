/* eslint-disable max-len */
/* eslint-disable no-console */
import axios from 'axios';
import api from './utils/qbt';
const convert = require('xml-js');

// local-anime-backend

const AUTO_START = false;

export const addRssUrl = async (rssUrl: string) => {
  const qbt = await api.connect('http://127.0.0.1:8080', 'admin', 'adminadmin');

  // 请求默认地址
  let defaultSavePath = '';
  try {
    defaultSavePath = await qbt.defaultSavePath();
    console.log('defaultSavePath: ', defaultSavePath);
  } catch (error) {
    console.log('请求默认地址 error: ', error);
    return {
      success: false,
      errorInfo: error,
    };
  }

  // 新增RSS订阅
  try {
    const addFeed = await qbt.addFeed(rssUrl, '');
    console.log('新增RSS订阅: ', addFeed);
  } catch (error) {
    console.log('新增RSS订阅 error: ', error);
    return {
      success: false,
      errorInfo: error,
    };
  }

  // 获得RSS标题
  let title = '';
  try {
    const { data } = await axios.get(rssUrl.replace('https', 'http'));
    const rssJson = JSON.parse(convert.xml2json(data, { compact: true }));
    // eslint-disable-next-line no-underscore-dangle
    title = rssJson?.rss?.channel?.title?._text;
  } catch (error) {
    console.log('获得RSS标题 error: ', error);
    return {
      success: false,
      errorInfo: error,
    };
  }
  console.log('获得RSS标题: ', title);

  // 新增自动下载规则
  try {
    const res = await qbt.setRule(
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
        mustNotContain: '',
        previouslyMatchedEpisodes: [],
        savePath: `${defaultSavePath}/${title}`,
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
};
