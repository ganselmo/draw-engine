export class ResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;

  constructor(message: string, data?: T, success = true) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}