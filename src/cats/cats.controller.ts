import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  // findAll这个命名完全是任意的，Nest 不会对所选的函数名称附加任何意义
  findAll(@Req() request: Request, @Res() response: Response): void {
    // return 'This action returns all cats';
    response.json({
      message: 'This action returns all cats',
    });
  }
}
