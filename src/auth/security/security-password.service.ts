import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecurityPasswordResult } from './interfaces/security-password-result';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SecurityPasswordService {
  constructor(private readonly config: ConfigService) {}

  public generate(password: string): SecurityPasswordResult {
    const salt: string = CryptoJS.lib.WordArray.random(
      this.config.get('securitypassword.keysize') / 8,
    ).toString(CryptoJS.enc.Hex);

    return {
      passwordSalt: CryptoJS.AES.encrypt(
        salt,
        this.config.get('securitypassword.secretkey'),
      ).toString(),
      passwordHash: CryptoJS.PBKDF2(password, salt, {
        iterations: this.config.get('securitypassword.iterations'),
        keySize: this.config.get('securitypassword.keysize') / 32,
        hasher: CryptoJS.algo.SHA512,
      }).toString(CryptoJS.enc.Base64),
    };
  }

  public readonly validate: (
    password: string,
    passwordHash: string,
    passwordSalt: string,
  ) => boolean = (
    password: string,
    passwordHash: string,
    passwordSalt: string,
  ): boolean =>
    password && passwordHash && passwordSalt
      ? CryptoJS.PBKDF2(
          password,
          CryptoJS.AES.decrypt(
            passwordSalt,
            this.config.get('securitypassword.secretkey'),
          ).toString(CryptoJS.enc.Utf8),
          {
            iterations: this.config.get('securitypassword.iterations'),
            keySize: this.config.get('securitypassword.keysize') / 32,
            hasher: CryptoJS.algo.SHA512,
          },
        ).toString(CryptoJS.enc.Base64) === passwordHash
      : false;
}
