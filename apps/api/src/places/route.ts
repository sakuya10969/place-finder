import { Elysia } from "elysia";
import { getConfig } from "../shared/config";
import { ErrorResponseSchema } from "../shared/schema";
import { PlaceSearchQuerySchema, PlaceSearchResponseSchema } from "./schema";
import { PlacesService } from "./service";

export const placesRoute = new Elysia({ prefix: "/api/places" }).get(
  "/search",
  async ({ query }) => {
    const service = new PlacesService(getConfig());

    return service.searchPlaces(query);
  },
  {
    detail: {
      tags: ["Places"],
      summary: "Search nearby places",
    },
    query: PlaceSearchQuerySchema,
    response: {
      200: PlaceSearchResponseSchema,
      400: ErrorResponseSchema,
      500: ErrorResponseSchema,
      502: ErrorResponseSchema,
    },
  },
);
