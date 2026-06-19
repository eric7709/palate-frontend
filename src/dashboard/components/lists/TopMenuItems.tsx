"use client"

import { ProgressBarList } from "./ProgressBarList";
import Loader from "@/src/shared/components/loaders/Loader";
import { useState } from "react";
import { DashboardPeriod } from "../../types";
import { useTopMenuItems } from "../../hooks";
import { loaderStyle } from "../../style";
import { getLabel } from "../../utils";

export function TopMenuItems() {
  const [period, setPeriod] = useState<DashboardPeriod>("TODAY")
  const { data, isLoading } = useTopMenuItems(period);

  if (isLoading || !data) {
    return <Loader height="h-40" style={loaderStyle}/>;
  }

  const items = data.items.map((item) => ({
    rank: item.rank,
    label: item.name,
    value: item.value,
    pct: item.pct,
    color: item.color,
  }));

  return (
    <ProgressBarList
      title="Top Menu Items"
      setPeriod={setPeriod}
      subtitle={getLabel(period)}
      period={period}
      items={items}
    />
  );
}