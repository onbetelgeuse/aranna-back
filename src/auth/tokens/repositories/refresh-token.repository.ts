import { EntityRepository, Repository } from 'typeorm';
import { RefreshToken } from '../../../entities/refresh-token.entity';
import { UserDto } from '../../user/dto/user.dto';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  createAccessToken(
    user: UserDto,
    startDate: Date,
    expiresIn: number,
  ): Promise<RefreshToken> {
    const entity: RefreshToken = new RefreshToken();
    entity.userId = user.id;
    entity.revoked = false;

    const expires: Date = new Date(startDate);
    expires.setSeconds(expires.getSeconds() + expiresIn);
    entity.expires = expires;

    return this.save(entity);
  }
}
