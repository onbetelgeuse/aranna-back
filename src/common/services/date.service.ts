import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  public getCurrent(): Date {
    return new Date();
  }
}
