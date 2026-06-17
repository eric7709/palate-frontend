import { useGet } from "@/src/shared/utils/hook";
import { AnalyticsRequestDTO, AnalyticsSummaryByDTO } from "../types";

const QUERY_KEY = "analytics";
const BASE_URL = "/analytics";
export const useGetAnalyticsSummary = (params?: AnalyticsRequestDTO) => {
    return useGet<AnalyticsSummaryByDTO>(
        [QUERY_KEY, "summary", params],
        `${BASE_URL}/summary`,
        !!params?.from && !!params?.to,
        { params }
    );
};