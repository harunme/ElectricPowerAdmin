import http from "@/api";
import { Main } from "@/api/interface/index";

// 概况-变压器状态
export const summary = (params: Main.ReqSummary) => {
  return http.postForm<Main.ResSummary>(`/main/summary`, params);
};

// 概览用能月报
export const EnergyReportNoHjPageInfo = (params: Main.ReqEnergyReportNoHjPageInfo) => {
  return http.postForm<Main.ResEnergyReportNoHjPageInfo>("/main/EnergyReportNoHjPageInfo", params);
};
