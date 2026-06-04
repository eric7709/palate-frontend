import { useGet } from "@/utils/hook";
import { AnalyticsRequestDTO, AnalyticsSummaryDTO } from "./types";

const QUERY_KEY = "analytics";
const BASE_URL = "/analytics";
export const useGetAnalyticsSummary = (params?: AnalyticsRequestDTO) => {
    return useGet<AnalyticsSummaryDTO>(
        [QUERY_KEY, "summary", params],
        `${BASE_URL}/summary`,
        !!params?.from && !!params?.to,
        { params }
    );
};