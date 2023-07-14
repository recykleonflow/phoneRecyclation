import { Test, TestingModule } from '@nestjs/testing';
import { OriginTrailService } from './origin-trail.service';

describe('OriginTrailService', () => {
  let service: OriginTrailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OriginTrailService],
    }).compile();

    service = module.get<OriginTrailService>(OriginTrailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
