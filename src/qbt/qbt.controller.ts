import axios from 'axios';
import { Request } from 'express';

import {
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';

import defaultConfig from './defaultConfig';
import qbt from './qbt.service';

const convert = require('xml-js');

@Controller('qbt')
export class QbtController {
  @Post('addRssUrl')
  async handleAddRssUrl(
    @Req() request: Request,
  ): Promise<{ success: boolean; errorInfo?: any }> {
    const { rssUrl, notContainRule, downLoadPath } = request?.body;
    // https://mikanani.me/RSS/Bangumi?bangumiId=2902&subgroupid=583
    return await qbt.addRssUrl(rssUrl, {
      notContainRule: notContainRule || defaultConfig.defaultNotContainRule,
      downLoadPath: downLoadPath
    });
  }

  @Post('setServerConfig')
  async handlesetServerConfig(@Req() request: Request): Promise<any> {
    try {
      const { setting } = request?.body;

      return {
        success: await qbt.setServerConfig(setting),
        detail: qbt.getQbtServerConfig(),
      };
    } catch (error) {
      return {
        error: true,
        msg: '编辑设置时出错',
        detail: error,
      };
    }
  }

  @Post('getRssDetail')
  async handleGetRssDetail(@Req() request: Request): Promise<any> {
    try {
      const { rssUrl } = request?.body;
      const { data } = await axios.get(rssUrl);

      // 解析xml
      const rssJson = JSON.parse(convert.xml2json(data, { compact: true }));

      return rssJson;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        return {
          error: true,
          msg: 'url 请求时出错',
          detail: error,
        };
      } else {
        return {
          error: true,
          msg: 'rss url 解析错误',
          detail: error,
        };
      }
    }
  }

  @Get('getQbtStatus')
  async handlegetQbtStatus(@Req() request: Request): Promise<any> {
    return qbt.getInfo();
  }

  @Get('getQbtServerConfig')
  async handleGetQbtConfig(@Req() request: Request): Promise<any> {
    return qbt.getQbtServerConfig();
  }

  @Get('getDefaultConfig')
  async handleGetDefaultConfig(@Req() request: Request): Promise<any> {
    return { ...defaultConfig, defaultDownLoadPath: qbt.getQbtServerConfig().serverInfo.defaultDownLoadPath || defaultConfig.defaultDownLoadPath };
  }
}
