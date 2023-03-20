import { Test, TestingModule } from '@nestjs/testing';
import { QbtController } from './qbt.controller';

describe('QbtController', () => {
  let controller: QbtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QbtController],
    }).compile();

    controller = module.get<QbtController>(QbtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
