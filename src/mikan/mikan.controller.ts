import { Request, Response } from 'express';
import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { getHomePageInfo } from './spider/index';

@Controller('mikan')
export class MikanController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get('test')
  async handleTest(@Req() request: Request): Promise<any> {
    getHomePageInfo();
    return 'This action returns all anime';
  }

  @Get('test2')
  async handleTest2(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    response.json('This action returns all anime2');
  }
}
