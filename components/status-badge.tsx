import type { TrailStatus } from "@/data/research-trail";

export function StatusBadge({ status }: { status: TrailStatus | string }) {
  const tone = status === "Completed" ? "complete" : status === "Current" || status === "In progress" ? "current" : "next";
  return <span className={`status-badge ${tone}`}>{status}</span>;
}
