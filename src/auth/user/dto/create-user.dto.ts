import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Role } from '../../../entities/role.entity';
import { User } from '../../../entities/user.entity';

export class CreateUserDto {
  @IsEmail({ require_tld: false })
  public readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((dto: CreateUserDto) => !dto.external)
  public readonly password: string;

  @IsString()
  @IsNotEmpty()
  public readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  public readonly firstName: string;

  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsArray()
  public readonly roles: string[];

  @IsBoolean()
  public readonly enabled: boolean;

  @IsBoolean()
  public readonly external: boolean;

  public static toEntity(dto: CreateUserDto): User {
    if (dto) {
      const entity: User = new User();
      entity.email = dto.email;
      entity.firstName = dto.firstName;
      entity.lastName = dto.lastName;
      entity.roles = (dto.roles || []).map(
        (name: string) => ({ name } as Role),
      );
      entity.enabled = dto.enabled;
      entity.external = dto.external;

      return entity;
    }
  }
}
