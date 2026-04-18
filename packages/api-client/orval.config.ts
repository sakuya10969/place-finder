export default {
  placeFinder: {
    input: "../../apps/api/openapi.json",
    output: {
      target: "./generated/index.ts",
      schemas: "./generated/model",
      client: "react-query",
      mode: "split",
      clean: true,
      override: {
        mutator: {
          path: "./src/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
};
