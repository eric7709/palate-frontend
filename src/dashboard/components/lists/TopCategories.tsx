"use client"
import { ProgressBarList } from "./ProgressBarList";
import Loader from "@/src/shared/components/loaders/Loader";
import { useState } from "react";
import { DashboardPeriod } from "../../types";
import { useTopCategories } from "../../hooks";
import { loaderStyle } from "../../style";
import { getLabel } from "../../utils";

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