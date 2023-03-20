import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { addRssUrl } from './utils/index.js'

@Controller('qbt')
export class QbtController {
  @Post('addRssUrl')
  handleAddRssUrl(@Req() request: Request): boolean | string | void {
    console.log('request: ', request.query);
    // return addRssUrl('https://mikanani.me/RSS/Bangumi?bangumiId=2902&subgroupid=583')
  }
}
