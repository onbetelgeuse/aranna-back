import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { SecurityPasswordResult } from '../security/interfaces/security-password-result';
import { SecurityPasswordService } from '../security/security-password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly securityPasswordService: SecurityPasswordService,
  ) {}

  public async findByEmail(email: string): Promise<UserDto> {
    if (email) {
      const entity: User = await this.userRepository.findByEmail(email);
      return UserDto.fromEntity(entity);
    }
    this.logger.error('Email cannot be null or undefined.');
    throw new BadRequestException('Email cannot be null or undefined.');
  }

  public async findById(id: number): Promise<UserDto> {
    if (id) {
      const entity: User = await this.userRepository.findOne(id);
      return UserDto.fromEntity(entity);
    }
    this.logger.error('Id cannot be null or undefined.');
    throw new BadRequestException('Id cannot be null or undefined.');
  }

  public async createUser(user: CreateUserDto): Promise<UserDto> {
    if (user) {
      const entity: User = CreateUserDto.toEntity(user);
      if (user.password) {
        const securityPassword: SecurityPasswordResult =
          this.securityPasswordService.generate(user.password);
        entity.setCredentials(securityPassword);
      }
      const createdEntity: User = await this.userRepository.save(entity);
      return UserDto.fromEntity(createdEntity);
    }
    this.logger.error('User cannot be null or undefined.');
    throw new BadRequestException('User cannot be null or undefined.');
  }

  public async authenticate(
    email: string,
    password: string,
  ): Promise<UserDto | undefined> {
    if (!email) {
      this.logger.error('Email cannot be null or undefined.');
      throw new BadRequestException('Email cannot be null or undefined.');
    }
    if (!password) {
      this.logger.error('Password cannot be null or undefined.');
      throw new BadRequestException('Password cannot be null or undefined.');
    }
    const entity: User = await this.userRepository.findByEmail(email);

    return entity?.validateCredentials(
      password,
      this.securityPasswordService.validate,
    )
      ? UserDto.fromEntity(entity)
      : undefined;
  }
}
