"use client"

import { useTopMenuItems } from "@/models/dashboard/hooks";
import { ProgressBarList } from "./ProgressBarList";
import Loader from "@/ui/Loader";
import { loaderStyle } from "@/models/dashboard/style";
import { useState } from "react";
import { DashboardPeriod } from "@/models/dashboard/types";
import { getLabel } from "@/models/dashboard/utils";

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