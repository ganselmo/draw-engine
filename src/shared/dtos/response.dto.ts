export class ResponseDto<T> {
  header: {
    success: boolean;
    message: string;
    timestamp: string;
  };

  data?: T;

  constructor(message: string, data?: T, success = true) {
    this.header = {
      success,
      message,
      timestamp: new Date().toISOString(),
    };

    this.data = data;
  }
}
