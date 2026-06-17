import { DashboardPeriod } from "./types"

export const getNextPeriod = (period: DashboardPeriod): DashboardPeriod => {
    if (period == "TODAY")
        return "THIS_WEEK"
    else if (period == "THIS_WEEK")
        return "THIS_MONTH"
    else if (period == "THIS_MONTH")
        return "THIS_YEAR"
    else
        return "TODAY"
}


export const getLabel = (period: DashboardPeriod) => {
    if (period == "THIS_MONTH")
        return "This month"
    if (period == "THIS_WEEK")
        return "This week"
    if (period == "THIS_YEAR")
        return "This year"
    if (period == "TODAY")
        return "Today"
}

export const getVSLabel = (period: DashboardPeriod) => {
    if (period == "THIS_MONTH")
        return "vs last month"
    if (period == "THIS_WEEK")
        return "vs last week"
    if (period == "THIS_YEAR")
        return "vs last year"
    if (period == "TODAY")
        return "vs yesterday"
}