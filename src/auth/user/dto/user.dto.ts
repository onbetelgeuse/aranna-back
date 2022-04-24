import { User } from 'src/entities/user.entity';
import { Role } from '../../../entities/role.entity';

export interface IUserDto {
  id: number;
  email: string;
  name: string;
  roles: string[];
  firstName: string;
  lastName: string;
  enabled?: boolean;
  external?: boolean;
}

export class UserDto implements IUserDto {
  public readonly id: number;
  public readonly email: string;
  public readonly name: string;
  public readonly roles: string[] = [];
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly enabled: boolean = true;
  public readonly external: boolean = false;

  public constructor(values: IUserDto) {
    if (values) {
      this.id = values.id;
      this.email = values.email;
      this.name = values.name;
      this.roles = values.roles || [];
      this.firstName = values.firstName;
      this.lastName = values.lastName;
      this.enabled = values.enabled ?? true;
      this.external = values.external ?? false;
    }
  }

  public static fromEntity(entity: User): UserDto {
    if (entity) {
      return new UserDto({
        id: entity.id,
        email: entity.email,
        name: entity.name,
        roles: (entity.roles || []).map((role: Role) => role.name),
        firstName: entity.firstName,
        lastName: entity.lastName,
        enabled: entity.enabled,
        external: entity.external,
      });
    }
  }
}
