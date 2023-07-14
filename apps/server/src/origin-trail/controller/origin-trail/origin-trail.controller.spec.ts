import { Test, TestingModule } from '@nestjs/testing';
import { OriginTrailController } from './origin-trail.controller';

describe('OriginTrailController', () => {
  let controller: OriginTrailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OriginTrailController],
    }).compile();

    controller = module.get<OriginTrailController>(OriginTrailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
