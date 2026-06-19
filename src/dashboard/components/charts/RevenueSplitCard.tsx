"use client"
import Loader from "@/src/shared/components/loaders/Loader";
import { useState } from "react";
import { useRevenueSplit } from "../../hooks";
import { DashboardPeriod } from "../../types";
import { loaderStyle } from "../../style";
import { getLabel, getNextPeriod } from "../../utils";

function RevenueDonut({ restaurantShare }: { restaurantShare: number }) {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  const restaurantLength = (restaurantShare / 100) * circumference;
  const roomServiceLength = circumference - restaurantLength;

  return (
    <svg viewBox="0 0 150 150" className="w-60 h-60 -rotate-90">
      <circle
        cx="75"
        cy="75"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        className="text-emerald-500"
        strokeDasharray={`${roomServiceLength} ${circumference}`}
        strokeDashoffset={-restaurantLength}
        strokeLinecap="round"
      />

      <circle
        cx="75"
        cy="75"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
        className="text-indigo-500"
        strokeDasharray={`${restaurantLength} ${circumference}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RevenueSplitCard() {
  const { data, isLoading } = useRevenueSplit();
  const [period, setPeriod] = useState<DashboardPeriod>("THIS_MONTH")

  if (isLoading || !data) {
    return <Loader height="h-80" style={loaderStyle} />
  }

  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-violet-500",
  ];

  return (
    <div className="rounded-2xl bg-white border border-neutral-200 p-4 shadow-sm flex flex-col h-full">
      <div>
        <h3 className="text-neutral-900 font-semibold text-sm">
          Revenue split
        </h3>

        <p className="text-neutral-500 select-none text-xs mb-3">
          Restaurant vs Room service · <span
            onClick={() => {
              const next = getNextPeriod(period)
              setPeriod(next)
            }}
            className="font-semibold text-blue-600">{getLabel(period)}</span>
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center my-1">
        <div className="relative flex items-center justify-center">
          <RevenueDonut restaurantShare={data.restaurantShare} />

          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-bold text-neutral-900">
              {data.restaurantShare}%
            </span>

            <span className="text-neutral-400 text-[10px]">
              Restaurant share
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-3">
        <div className="space-y-2">
          {data.data.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${colors[index % colors.length]
                    }`}
                />
                <span className="text-neutral-600">
                  {item.label}
                </span>
              </div>

              <span className="text-neutral-900 font-medium">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}