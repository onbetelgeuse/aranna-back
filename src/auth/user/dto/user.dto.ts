import { User } from 'src/entities/user.entity';

export class UserDto {
  public static fromEntity(entity: User): UserDto {
    if (entity) {
      return new UserDto();
    }
  }
}
