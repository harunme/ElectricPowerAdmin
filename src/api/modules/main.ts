import http from "@/api";
import { Main } from "@/api/interface/index";

// 概况-变压器状态
export const summary = (params: Main.ReqSummary) => {
  return http.postForm<Main.ResSummary>(`/main/summary`, params);
};
