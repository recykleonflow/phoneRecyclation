import { Test, TestingModule } from '@nestjs/testing';
import { PhoneHandlerService } from './phone-handler.service';

describe('PhoneHandlerService', () => {
  let service: PhoneHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneHandlerService],
    }).compile();

    service = module.get<PhoneHandlerService>(PhoneHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
