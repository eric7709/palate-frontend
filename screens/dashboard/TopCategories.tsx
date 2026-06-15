"use client"
import { useTopCategories } from "@/models/dashboard/hooks";
import { ProgressBarList } from "./ProgressBarList";
import Loader from "@/ui/Loader";
import { loaderStyle } from "@/models/dashboard/style";
import { DashboardPeriod } from "@/models/dashboard/types";
import { useState } from "react";
import { getLabel } from "@/models/dashboard/utils";

export function TopCategories() {
  const [period, setPeriod] = useState<DashboardPeriod>("TODAY")
  const { data, isLoading } = useTopCategories(period);

  if (isLoading || !data) {
    return <Loader height="h-40" style={loaderStyle}/>
  }

  const items = data.items.map((item) => ({
    label: item.name,
    value: item.value,
    pct: item.pct,
    color: item.color,
  }));

  return (
    <ProgressBarList
      title="Sales by Category"
      setPeriod={setPeriod}
      subtitle={getLabel(period)}
      period={period}
      items={items}
    />
  );
}