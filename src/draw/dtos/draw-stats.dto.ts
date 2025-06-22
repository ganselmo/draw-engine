import { Expose } from 'class-transformer';

export class DrawStatsDto {
  @Expose()
  count: {
    available: number;
    cancelled: number;
    reserved: number;
    paid: number;
  };
  @Expose()
  available: number[];
  @Expose()
  reserved: number[];
  @Expose()
  paid: number[];
}
