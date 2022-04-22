import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'dev',
  Production = 'prod',
  Test = 'test',
  Provision = 'prov',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Test;

  @IsNumber()
  PORT: number = 3000;

  @IsString()
  DB_HOST: string;
  @IsNumber()
  DB_PORT: number = 5432;
  @IsString()
  DB_USER: string;
  @IsString()
  DB_PASSWORD: string;
  @IsString()
  DB_NAME: string;
  @IsBoolean()
  DB_SYNC: boolean = false;

  @IsNumber()
  SECURITY_PASSWORD_SALT_SIZE: number = 128;
  @IsNumber()
  SECURITY_PASSWORD_KEY_SIZE: number = 512;
  @IsNumber()
  SECURITY_PASSWORD_ITERATIONS: number = 2000;
  @IsString()
  SECURYTY_PASSWORD_SECRET_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
