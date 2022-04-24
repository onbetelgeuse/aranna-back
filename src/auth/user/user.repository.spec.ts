import { ILike } from 'typeorm';
import { UserRepository } from './user.repository';
import { anything, deepEqual, spy, verify, when } from 'ts-mockito';

describe('UserRepository', () => {
  let entityRepository: UserRepository;
  let repository: UserRepository;
  beforeEach(() => {
    repository = new UserRepository();
    entityRepository = spy(repository);
  });
  it('1) should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('2) should findByEmail', async () => {
    // prepare
    const email: string = 'email@domain';
    when(entityRepository.findOne(anything())).thenResolve();
    // execute
    await repository.findByEmail(email);
    // verify
    verify(
      entityRepository.findOne(deepEqual({ where: { email: ILike(email) } })),
    ).once();
  });

  it('3) should findByEmail with undefined email', async () => {
    // prepare
    const email: string = undefined;
    when(entityRepository.findOne(anything())).thenResolve();

    try {
      // execute
      await repository.findByEmail(email);
    } catch (error: any) {
      // verify
      verify(
        entityRepository.findOne(deepEqual({ where: { email: ILike(email) } })),
      ).never();

      expect(error?.name).toBe('BadRequestException');
      expect(error?.status).toBe(400);
      expect(error?.message).toBe('Email cannot be null or undefined.');
    }
  });
});
