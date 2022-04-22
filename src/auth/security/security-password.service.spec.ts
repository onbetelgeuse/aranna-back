import { Test, TestingModule } from '@nestjs/testing';
import { SecurityPasswordService } from './security-password.service';

describe('SecurityService', () => {
  let service: SecurityPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityPasswordService],
    }).compile();

    service = module.get<SecurityPasswordService>(SecurityPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
