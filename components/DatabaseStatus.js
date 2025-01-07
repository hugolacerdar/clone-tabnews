import React from "react";
import useSWR from "swr";
import styles from "./DatabaseStatus.module.css";
import { fetchAPI } from "/infra/api/apiClient";

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 5000,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const {
    updated_at,
    dependencies: {
      database: { version, max_connections, active_connections },
    },
  } = data;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📊 Database Status</h2>
      <p className={styles.paragraph}>
        <strong className={styles.strong}>🕒 Last Updated:</strong> {updated_at}
      </p>
      <p className={styles.paragraph}>
        <strong className={styles.strong}>🔢 Version:</strong> {version}
      </p>
      <p className={styles.paragraph}>
        <strong className={styles.strong}>📈 Active Connections:</strong>{" "}
        {active_connections} / {max_connections}
      </p>
      <p>
        {active_connections < max_connections * 0.8 ? (
          <span>✅ All good!</span>
        ) : (
          <span>⚠️ High usage, consider scaling!</span>
        )}
      </p>
    </div>
  );
}

export default DatabaseStatus;
