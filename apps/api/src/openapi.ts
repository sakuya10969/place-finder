import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createApp } from "./app";

const outputPath = join(import.meta.dir, "..", "openapi.json");

const normalizeOpenApiSchema = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeOpenApiSchema);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const normalizedEntries = Object.entries(record).map(([key, nestedValue]) => [
      key,
      normalizeOpenApiSchema(nestedValue),
    ]);
    const normalized = Object.fromEntries(normalizedEntries);

    if (Array.isArray(record.anyOf)) {
      const normalizedRecord = normalized as Record<string, unknown>;
      const nonNullSchemas = record.anyOf.filter(
        (schema) =>
          !(
            schema &&
            typeof schema === "object" &&
            "type" in schema &&
            (schema as { type?: unknown }).type === "null"
          ),
      );
      const hasNullVariant = nonNullSchemas.length !== record.anyOf.length;

      if (hasNullVariant && nonNullSchemas.length === 1) {
        const [nonNullSchema] = nonNullSchemas;
        const {
          anyOf: _anyOf,
          nullable: _nullable,
          ...rest
        } = normalizedRecord;

        return {
          ...rest,
          ...(normalizeOpenApiSchema(nonNullSchema) as Record<string, unknown>),
          nullable: true,
        };
      }
    }

    if ("const" in record) {
      const { const: constantValue, ...rest } = normalized as Record<string, unknown>;

      return {
        ...rest,
        enum: [constantValue],
      };
    }

    return normalized;
  }

  return value;
};

const addResponseDescriptions = (schema: Record<string, unknown>) => {
  const paths = schema.paths;

  if (!paths || typeof paths !== "object") {
    return schema;
  }

  for (const pathItem of Object.values(paths as Record<string, unknown>)) {
    if (!pathItem || typeof pathItem !== "object") {
      continue;
    }

    for (const operation of Object.values(pathItem as Record<string, unknown>)) {
      if (!operation || typeof operation !== "object") {
        continue;
      }

      const responses = (operation as Record<string, unknown>).responses;

      if (!responses || typeof responses !== "object") {
        continue;
      }

      for (const [status, response] of Object.entries(
        responses as Record<string, unknown>,
      )) {
        if (!response || typeof response !== "object") {
          continue;
        }

        const responseRecord = response as Record<string, unknown>;

        if (!("description" in responseRecord)) {
          responseRecord.description = `HTTP ${status} response`;
        }
      }
    }
  }

  return schema;
};

const keepJsonResponsesOnly = (schema: Record<string, unknown>) => {
  const paths = schema.paths;

  if (!paths || typeof paths !== "object") {
    return schema;
  }

  for (const pathItem of Object.values(paths as Record<string, unknown>)) {
    if (!pathItem || typeof pathItem !== "object") {
      continue;
    }

    for (const operation of Object.values(pathItem as Record<string, unknown>)) {
      if (!operation || typeof operation !== "object") {
        continue;
      }

      const responses = (operation as Record<string, unknown>).responses;

      if (!responses || typeof responses !== "object") {
        continue;
      }

      for (const response of Object.values(responses as Record<string, unknown>)) {
        if (!response || typeof response !== "object") {
          continue;
        }

        const content = (response as Record<string, unknown>).content;

        if (
          content &&
          typeof content === "object" &&
          "application/json" in (content as Record<string, unknown>)
        ) {
          (response as Record<string, unknown>).content = {
            "application/json": (content as Record<string, unknown>)["application/json"],
          };
        }
      }
    }
  }

  return schema;
};

const app = createApp();
const response = await app.handle(new Request("http://localhost/swagger/json"));

if (!response.ok) {
  throw new Error(`Failed to generate OpenAPI schema: ${response.status}`);
}

const schema = addResponseDescriptions(
  keepJsonResponsesOnly(
    normalizeOpenApiSchema(await response.json()) as Record<string, unknown>,
  ),
);

await writeFile(outputPath, `${JSON.stringify(schema, null, 2)}\n`);

console.log(`OpenAPI schema written to ${outputPath}`);
