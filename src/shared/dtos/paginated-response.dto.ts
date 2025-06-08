import { ResponseDto } from './response.dto';

export class PaginatedResponseDto<T> extends ResponseDto<T[]> {
  total: number;
  page: number;
  pageSize: number;

  constructor(
    message: string,
    data: T[],
    total: number,
    page: number,
    pageSize: number,
  ) {
    super(message, data);
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
  }
}