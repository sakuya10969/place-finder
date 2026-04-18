import { useQuery } from "@tanstack/react-query";
import { api } from "./lib/api";

function App() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: () => api.get("/health").then((res) => res.data),
  });

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Place Finder</h1>
      <p>
        API status:{" "}
        {health.isLoading ? "checking..." : health.isError ? "unreachable" : health.data?.status}
      </p>
    </div>
  );
}

export default App;
