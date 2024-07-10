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

// 事件记录-遥信事件
export const GetAlarmEventYxList = (params: Main.ReqGetAlarmEventYxList) => {
  return http.postForm<Main.ResGetAlarmEventYxList>("/main/getAlarmEventYxList", params);
};

// 事件记录-越限事件
export const GetAlarmEventYcList = (params: Main.ReqGetAlarmEventYcList) => {
  return http.postForm<Main.ResGetAlarmEventYcList>("/main/getAlarmEventYcList", params);
};

// 事件记录-平台运行日志
export const PlatformRunLogPageInfo = (params: Main.ReqPlatformRunLogPageInfo) => {
  return http.postForm<Main.ResPlatformRunLogPageInfo>("/main/PlatformRunLogPageInfo", params);
};
