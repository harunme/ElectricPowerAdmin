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

// 事件记录-操作日志
export const GetLogPageInfo = (params: Main.ReqGetLogPageInfo) => {
  return http.postForm<Main.ResGetLogPageInfo>("/api/getLogPageInfo", params);
};

// 事件记录-报警信息历史
export const GetAlarmEventLogListHis = (params: Main.ReqGetAlarmEventLogListHis) => {
  return http.postForm<Main.ResGetAlarmEventLogListHis>("/main/getAlarmEventLogListHis", params);
};

// 电力监测-负荷率
export const GetCirLoadRate = (params: Main.ReqGetCirLoadRate) => {
  return http.postForm<Main.ResGetCirLoadRate>("/main/getCirLoadRate", params);
};

// 电力监测-平均功率因数
export const AveragePowerReport = (params: Main.ReqAveragePowerReport) => {
  return http.postForm<Main.ResAveragePowerReport>("/main/AveragePowerReport", params);
};

// 电力监测-电力运行报表
export const ElectricReport = (params: Main.ReqElectricReport) => {
  return http.postForm<Main.ResElectricReport>("/main/ElectricReport", params);
};

// 电力监测-电力极值报表
export const ElecMaxMinAvgValue = (params: Main.ReqElecMaxMinAvgValue) => {
  return http.postForm<Main.ResElecMaxMinAvgValue>("/main/ElecMaxMinAvgValue", params);
};

// 电力监测-电力运行日报
export const ElectricReportNew = (params: Main.ReqElectricReportNew) => {
  return http.postForm<Main.ResElectricReportNew>("/main/ElectricReportNew", params);
};

// 电力监测-电力运行月报
export const ElectricMonthReport = (params: Main.ReqElectricMonthReport) => {
  return http.postForm<Main.ResElectricMonthReport>("/main/ElectricMonthReport", params);
};

// 电力监测-变压器温度月报
export const transformerTempMonthReport = (params: Main.ReqTransformerTempMonthReport[]) => {
  return http.post<Main.ResTransformerTempMonthReport>("/main/transformerTempMonthReport", params);
};

// 用能分析-同比分析
export const getMonthMom = (params: Main.ReqGetMonthMom) => {
  return http.postForm<Main.ResGetMonthMom>("/main/getMonthMom", params);
};

// 用能分析-同比分析
// export const energyReportMOM = (params: Main.ReqEnergyReportMOM[]) => {
//   return http.post<Main.ResEnergyReportMOM>("/main/energyReportMOM", params);
// };
