import { ConfigService } from '@nestjs/config';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';
import { SecurityPasswordService } from './security-password.service';
import * as CryptoJS from 'crypto-js';

describe('SecurityService', () => {
  let service: SecurityPasswordService;
  let config: ConfigService;

  beforeEach(async () => {
    config = mock(ConfigService);
    service = new SecurityPasswordService(instance(config));
    when(config.get<number>('securitypassword.iterations')).thenReturn(30);
    when(config.get<number>('securitypassword.keysize')).thenReturn(64);
    when(config.get<string>('securitypassword.secretkey')).thenReturn(
      'secretkey',
    );
  });

  it('1) should be defined', () => {
    expect(service).toBeDefined();
  });
  it('2) should generate', () => {
    // prepare
    const password: string = 'secret';
    // execute
    service.generate(password);
    // verify
    verify(config.get<number>('securitypassword.iterations')).once();
    verify(config.get<number>('securitypassword.secretkey')).once();
    verify(config.get<number>('securitypassword.keysize')).twice();
  });
});
