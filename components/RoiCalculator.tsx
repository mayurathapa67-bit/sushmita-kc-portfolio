"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

export default function RoiCalculator() {
  const [spend, setSpend] = useState(5000);
  const [currentRoas, setCurrentRoas] = useState(2);
  const [targetRoas, setTargetRoas] = useState(5);

  const currentRev = spend * currentRoas;
  const targetRev = spend * targetRoas;
  const uplift = targetRev - currentRev;
  const upliftPct = currentRev > 0 ? Math.round((uplift / currentRev) * 100) : 0;

  return (
    <div className="card grid gap-8 p-8 md:grid-cols-2 md:p-10">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="font-display text-2xl font-semibold">ROI Calculator</h3>
          <p className="mt-2 text-sm text-charcoal/60">
            See the revenue gap between where you are and where you could be.
          </p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Monthly ad spend
          <input
            type="range"
            min={500}
            max={50000}
            step={500}
            value={spend}
            onChange={(e) => setSpend(Number(e.target.value))}
            className="accent-purple"
          />
          <span className="font-display text-xl font-semibold text-teal">
            ${spend.toLocaleString()}
          </span>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Current ROAS
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.1}
            value={currentRoas}
            onChange={(e) => setCurrentRoas(Number(e.target.value))}
            className="accent-teal"
          />
          <span className="font-display text-xl font-semibold text-charcoal">
            {currentRoas.toFixed(1)}x
          </span>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Target ROAS (with me)
          <input
            type="range"
            min={0.5}
            max={12}
            step={0.1}
            value={targetRoas}
            onChange={(e) => setTargetRoas(Number(e.target.value))}
            className="accent-purple"
          />
          <span className="font-display text-xl font-semibold text-purple">
            {targetRoas.toFixed(1)}x
          </span>
        </label>
      </div>

      <div className="flex flex-col justify-center gap-5 rounded-2xl gradient-bg-animated p-8 text-white">
        <div>
          <div className="text-sm uppercase tracking-wider text-white/70">Current revenue</div>
          <div className="font-display text-3xl font-semibold">${currentRev.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm uppercase tracking-wider text-white/70">Projected revenue</div>
          <div className="font-display text-3xl font-semibold">${targetRev.toLocaleString()}</div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/15 px-5 py-4">
          <Icon name="trending" size={28} />
          <div>
            <div className="font-display text-2xl font-bold">
              +${uplift.toLocaleString()}
            </div>
            <div className="text-xs text-white/80">potential monthly uplift ({upliftPct}%)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
