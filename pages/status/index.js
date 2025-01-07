import useSWR from "swr";
import DatabaseStatus from "components/DatabaseStatus";
import { fetchAPI } from "infra/api/apiClient";

export default function StatusPage() {
  const response = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });
  return (
    <>
      <h1 style={{ fontFamily: "Arial, sans-serif" }}>Status</h1>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        Updated at:{" "}
        {response.isLoading ? "loading..." : response.data.updated_at}
      </div>
      <DatabaseStatus data={response.data} />
    </>
  );
}
