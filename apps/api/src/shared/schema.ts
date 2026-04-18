import { t } from "elysia";

export const ErrorCodeSchema = t.Union([
  t.Literal("VALIDATION_ERROR"),
  t.Literal("INTERNAL_ERROR"),
  t.Literal("EXTERNAL_API_ERROR"),
]);

export const ErrorResponseSchema = t.Object({
  error: t.Object({
    code: ErrorCodeSchema,
    message: t.String(),
  }),
});

export const HealthResponseSchema = t.Object({
  status: t.Literal("ok"),
  timestamp: t.String({ format: "date-time" }),
});

export type ErrorResponse = typeof ErrorResponseSchema.static;
