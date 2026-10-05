"use client";

import Link from "next/link";
import { useState } from "react";
import { TrendMockup } from "@/components/trend-mockups";
import { trends } from "@/lib/trends";

export function PortfolioPicker() {
  const [active, setActive] = useState(trends[0].id);
  const trend = trends.find((item) => item.id === active) ?? trends[0];

  return (
    <div className="trend-picker">
      <div className="trend-tabs" role="tablist" aria-label="2026 portfolio directions">
        {trends.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`trend-tab-${item.id}`}
            aria-selected={item.id === active}
            aria-controls="trend-panel"
            className={`trend-tab swatch-${item.id}`}
            onClick={() => setActive(item.id)}
          >
            <i aria-hidden="true" />
            <span>
              {item.index} {item.name}
            </span>
          </button>
        ))}
      </div>
      <div
        className="trend-panel"
        id="trend-panel"
        role="tabpanel"
        aria-labelledby={`trend-tab-${trend.id}`}
        key={trend.id}
      >
        <div className="trend-copy">
          <p className="kicker">2026 · {trend.index}</p>
          <h2>{trend.name}</h2>
          <p>{trend.blurb}</p>
          <p className="trend-fits">{trend.fits}</p>
          <Link className="btn" href={`/start?direction=${trend.id}`}>
            use this direction
          </Link>
        </div>
        <TrendMockup id={trend.id} />
      </div>
    </div>
  );
}
