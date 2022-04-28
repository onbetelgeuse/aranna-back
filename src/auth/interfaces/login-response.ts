import { UserDto } from '../user/dto/user.dto';

export interface LoginResponse {
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
