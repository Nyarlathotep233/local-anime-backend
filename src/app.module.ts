import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { MikanController } from './mikan/mikan.controller';
import { QbtController } from './qbt/qbt.controller';

@Module({
  imports: [],
  controllers: [AppController, CatsController, QbtController, MikanController],
  providers: [AppService],
})
export class AppModule {}
