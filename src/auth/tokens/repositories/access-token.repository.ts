import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { AccessToken } from '../../../entities/access-token.entity';
import { UserDto } from '../../user/dto/user.dto';

@EntityRepository(AccessToken)
export class AccessTokenRepository extends Repository<AccessToken> {
  public async createAccessToken(
    user: UserDto,
    startDate: Date,
    expiresIn: number,
    entityManager: EntityManager,
  ): Promise<AccessToken> {
    const entity: AccessToken = new AccessToken();
    entity.userId = user.id;
    entity.revoked = false;

    const expires: Date = new Date(startDate);
    expires.setSeconds(expires.getSeconds() + expiresIn);
    entity.expires = expires;

    return entityManager.save(entity);
  }
}
