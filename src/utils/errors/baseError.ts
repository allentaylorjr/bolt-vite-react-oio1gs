export class AppError extends Error {
  code: string;
  status?: number;
  details?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    status: number = 500,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details
    };
  }
}