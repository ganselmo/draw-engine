import { Expose } from 'class-transformer';

export class DrawPercentsDto {
  @Expose()
  percents: {
    available: number;
    cancelled: number;
    reserved: number;
    paid: number;
  };
}
