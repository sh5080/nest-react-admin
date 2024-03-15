export class RequestTimeoutException extends Error {
  constructor(message?: string) {
    super(message || '요청이 타임아웃되었습니다.');
    this.name = 'RequestTimeoutException';
  }
}
