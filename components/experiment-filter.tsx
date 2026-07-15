"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ContentCard } from "@/components/content-card";
import type { ContentMeta } from "@/lib/content";

export function ExperimentFilter({ experiments }: { experiments: ContentMeta[] }) {
  const statuses = ["All", ...Array.from(new Set(experiments.map((item) => item.status)))];
  const [active, setActive] = useState("All");
  const filtered = useMemo(
    () => experiments.filter((item) => active === "All" || item.status === active),
    [active, experiments],
  );

  return (
    <div>
      <div className="filter-bar" aria-label="按实验状态筛选">
        <div className="filter-label"><SlidersHorizontal size={17} /> 状态</div>
        <div className="segmented-control">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              className={active === status ? "active" : undefined}
              aria-pressed={active === status}
              onClick={() => setActive(status)}
            >
              {status === "All" ? "全部" : status}
            </button>
          ))}
        </div>
        <span className="result-count" aria-live="polite">{filtered.length} 条记录</span>
      </div>
      <div className="cards-grid experiments-grid">
        {filtered.map((experiment) => <ContentCard key={experiment.slug} entry={experiment} />)}
      </div>
    </div>
  );
}
