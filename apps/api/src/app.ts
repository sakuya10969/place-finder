import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia, ValidationError } from "elysia";
import { placesRoute } from "./places/route";
import { AppError } from "./shared/errors";
import { ErrorResponseSchema, HealthResponseSchema } from "./shared/schema";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Internal server error";

export const createApp = () =>
  new Elysia()
    .use(cors())
    .use(
      swagger({
        path: "/swagger",
        documentation: {
          info: {
            title: "Place Finder API",
            version: "0.1.0",
          },
          tags: [{ name: "Places" }],
        },
      }),
    )
    .onError(({ code, error, set }) => {
      if (code === "VALIDATION" || error instanceof ValidationError) {
        set.status = 400;

        return {
          error: {
            code: "VALIDATION_ERROR" as const,
            message: getErrorMessage(error),
          },
        };
      }

      if (error instanceof AppError) {
        set.status = error.status;

        return {
          error: {
            code: error.code,
            message: error.message,
          },
        };
      }

      set.status = 500;

      return {
        error: {
          code: "INTERNAL_ERROR" as const,
          message: getErrorMessage(error),
        },
      };
    })
    .get("/health", () => ({ status: "ok" as const, timestamp: new Date().toISOString() }), {
      detail: {
        tags: ["System"],
        summary: "Health check",
      },
      response: {
        200: HealthResponseSchema,
        500: ErrorResponseSchema,
      },
    })
    .use(placesRoute);

export type App = ReturnType<typeof createApp>;
