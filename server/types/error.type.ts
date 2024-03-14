export class ImageError extends Error {
  detail: string;
  status: number;
  constructor(status: number, message: string, detail: string) {
    super(message);
    this.status = status;
    this.detail = detail;
    Object.setPrototypeOf(this, ImageError.prototype);
  }
}

export class UncommonError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;

    Object.setPrototypeOf(this, UncommonError.prototype);
  }
}
