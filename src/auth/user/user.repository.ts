import { User } from './../../entities/user.entity';
import { EntityRepository, ILike, Repository } from 'typeorm';
import { BadRequestException, Logger } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly logger: Logger = new Logger(UserRepository.name);

  public async findByEmail(email: string): Promise<User | undefined> {
    if (email) {
      return this.findOne({ where: { email: ILike(email) } });
    }

    this.logger.error('Email cannot be null or undefined.');
    throw new BadRequestException('Email cannot be null or undefined.');
  }
}
