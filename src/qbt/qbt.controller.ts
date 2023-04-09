import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import qbt from './qbt.service';
import defaultConfig from './defaultConfig'
import axios from 'axios';
const convert = require('xml-js');

@Controller('qbt')
export class QbtController {
  @Post('addRssUrl')
  async handleAddRssUrl(
    @Req() request: Request,
  ): Promise<{ success: boolean; errorInfo?: any }> {
    console.log('request: ', request.body);
    const { rssUrl, notContainRule } = request?.body;
    // https://mikanani.me/RSS/Bangumi?bangumiId=2902&subgroupid=583
    return await qbt.addRssUrl(rssUrl, {
      notContainRule: notContainRule || defaultConfig.defaultNotContainRule
    });
  }

  @Post('getRssDetail')
  async handleGetRssDetail(
    @Req() request: Request,
  ): Promise<any> {
    const { rssUrl } = request?.body;
    const { data } = await axios.get(rssUrl)
    console.log('data: ', data);
    // 解析xml
    const rssJson = JSON.parse(convert.xml2json(data, { compact: true }));
    console.log('rssJson: ', rssJson);
    return rssJson
  }
}
