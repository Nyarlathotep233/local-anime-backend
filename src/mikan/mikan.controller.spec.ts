import { Test, TestingModule } from '@nestjs/testing';
import { MikanController } from './mikan.controller';

describe('MikanController', () => {
  let controller: MikanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MikanController],
    }).compile();

    controller = module.get<MikanController>(MikanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
