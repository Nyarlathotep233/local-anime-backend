/* eslint-disable max-len */
/* eslint-disable no-console */
// const api = require("qbittorrent-api-v2");
const { default: axios } = require('axios');
const convert = require('xml-js');
const api = require('./local-anime-backend/src/cats/utils/qbt');

// local-anime-backend

const AUTO_START = false;

export const addRssUrl = async (rssUrl) => {
  const qbt = await api.connect('http://127.0.0.1:8080', 'admin', 'adminadmin');

  // 新增RSS订阅
  try {
    const addFeed = await qbt.addFeed(
      rssUrl,
      '',
    );
    console.log('新增RSS订阅: ', addFeed);
  } catch (error) {
    console.log('error: ', error);
  }

  // 获得RSS标题
  let title = '';
  try {
    const { data } = await axios.get(
      rssUrl.replace('https', 'http'),
    );
    const rssJson = JSON.parse(convert.xml2json(data, { compact: true }));
    // eslint-disable-next-line no-underscore-dangle
    title = rssJson?.rss?.channel?.title?._text;
  } catch (error) {
    console.log('error: ', error);
  }
  console.log('获得RSS标题: ', title);

  // 新增自动下载规则
  try {
    const res = await qbt.setRule(
      title,
      {
        addPaused: null,
        affectedFeeds: [
          rssUrl,
        ],
        assignedCategory: '',
        enabled: AUTO_START,
        episodeFilter: '',
        ignoreDays: 0,
        lastMatch: '',
        mustContain: '',
        mustNotContain: '',
        previouslyMatchedEpisodes: [],
        savePath: '',
        smartFilter: false,
        torrentContentLayout: null,
        useRegex: false,
      },
    );
    console.log(`新增自动下载规则: ${res.statusText} ${res.data}`);
  } catch (error) {
    console.log('error: ', error);
  }

  return true
};
