import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { addRssUrl } from './utils/index';

@Controller('qbt')
export class QbtController {
  @Post('addRssUrl')
  async handleAddRssUrl(
    @Req() request: Request,
  ): Promise<boolean | string | void> {
    console.log('request: ', request.body);
    const { rssUrl } = request?.body;
    // https://mikanani.me/RSS/Bangumi?bangumiId=2902&subgroupid=583
    return await addRssUrl(rssUrl);
  }
}
