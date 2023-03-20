import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { QbtController } from './qbt/qbt.controller';

@Module({
  imports: [],
  controllers: [AppController, CatsController, QbtController],
  providers: [AppService],
})
export class AppModule {}
