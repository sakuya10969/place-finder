export type AppErrorCode = "VALIDATION_ERROR" | "INTERNAL_ERROR" | "EXTERNAL_API_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ExternalApiError extends AppError {
  constructor(message = "External API request failed") {
    super("EXTERNAL_API_ERROR", message, 502);
    this.name = "ExternalApiError";
  }
}
