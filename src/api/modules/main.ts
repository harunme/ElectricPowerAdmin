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

// 用能分析-环比分析
export const energyReportMOM = (params: Main.ReqEnergyReportMOM) => {
  return http.postForm<Main.ResEnergyReportMOM>("/main/energyReportMOM", params);
};

// 用能分析-电能集抄
export const ConsumeEnergyReport = (params: Main.ReqConsumeEnergyReport) => {
  return http.postForm<Main.ResConsumeEnergyReport>("/main/ConsumeEnergyReport", params);
};

// 用能分析-计量及电路损耗
export const EnergyLineLoss2Tree = (params: Main.ReqEnergyLineLoss2Tree) => {
  return http.postForm<Main.ResEnergyLineLoss2Tree>("/main/EnergyLineLoss2Tree", params);
};

// 电力监测-变压器监测曲线查询接口
export const getCurveDataOfPowerAndTempABCNew = (params: Main.ReqGetCurveDataOfPowerAndTempABCNew) => {
  return http.postForm<Main.ResGetCurveDataOfPowerAndTempABCNew>("/main/getCurveDataOfPowerAndTempABCNew", params);
};

// 电力监测-变压器监测初始接口
export const TransformerMonitor = (params: Main.ReqTransformerMonitor) => {
  return http.postForm<Main.ResTransformerMonitor>("/main/TransformerMonitor", params);
};

// 电能质量-不平衡度接口
export const ElectricData = (params: Main.ReqElectricData) => {
  return http.postForm<Main.ResElectricData>("/main/ElectricData", params);
};

// 电能质量-谐波次数统计
export const ThreePhaseHarmonic = (params: Main.ReqThreePhaseHarmonic) => {
  return http.postForm<Main.ResThreePhaseHarmonic>("/main/ThreePhaseHarmonic", params);
};

// 报警信息数量定时查询
export const getUnConfirmedEventsByCache = () => {
  return http.postForm<Main.ResGetUnConfirmedEventsByCache>("/main/getUnConfirmedEventsByCache");
};

// 事件记录-报警信息 接口
export const getAlarmEventLogList = (params: Main.ReqGetAlarmEventLogList) => {
  return http.postForm<Main.ResGetAlarmEventLogList>("/main/getAlarmEventLogList", params);
};

// 电力监测-电力数据 接口1
export const ElectricDataMonth = (params: Main.ReqElectricDataMonth) => {
  return http.postForm<Main.ResElectricDataMonth>("/main/ElectricDataMonth", params);
};

// 电力监测-电力数据 接口2
export const ElectricDataPaging = (params: Main.ReqElectricDataPaging) => {
  return http.postForm<Main.ResElectricDataPaging>("/main/ElectricDataPaging", params);
};

// 事件记录-报警分析 接口1 环比计算
export const getDMYAlarmCompare = () => {
  return http.postForm<Main.ResGetDMYAlarmCompare>("/main/getDMYAlarmCompare");
};

// 事件记录-报警分析 接口2 报警种类统计
export const getMessInfoTypeAlarmLogNum = () => {
  return http.postForm<Main.ResGetMessInfoTypeAlarmLogNum[]>("/main/getMessInfoTypeAlarmLogNum");
};

// 事件记录-报警分析 接口3 平台月报警统计
export const getMonthAlarmLogNum = (params: Main.ReqGetMonthAlarmLogNum) => {
  return http.postForm<Main.ResGetMonthAlarmLogNum[]>("/main/getMonthAlarmLogNum", params);
};

// 事件记录-报警分析 接口4 站点报警排名
export const getSubstationAlarmLogNum = (params: Main.ReqGetSubstationAlarmLogNum) => {
  return http.postForm<Main.ResGetSubstationAlarmLogNum>("/main/getSubstationAlarmLogNum", params);
};

// 概况-变配电站状态 接口1
export const getSubstationStatus = (params: Main.ReqGetSubstationStatus) => {
  return http.postForm<Main.ResGetSubstationStatus>("/main/getSubstationStatus", params);
};

// 概况-变配电站状态 接口2   当日逐时曲线 分时段
export const getMothJFPG = (params: Main.ReqGetMothJFPG) => {
  return http.postForm<Main.ResGetMothJFPG>("/main/getMothJFPG", params);
};

// 概况-变配电站状态 接口3  用电概况里的日 月年总电量
export const getNowAndLastEnergyTotalValue = (params: Main.ReqGetNowAndLastEnergyTotalValue) => {
  return http.postForm<Main.ResGetNowAndLastEnergyTotalValue>("/main/getNowAndLastEnergyTotalValue", params);
};

// 概况-变配电站状态 接口4 点击变压器接口
export const getTransformerListByfSubid = (params: Main.ReqGetTransformerListByfSubid) => {
  return http.postForm<Main.ResGetTransformerListByfSubid>("/main/getTransformerListByfSubid", params);
};

// 概况-变配电站状态 接口5  点击失联装置接口
export const CommunicationStatusNew = (params: Main.ReqCommunicationStatusNew) => {
  return http.postForm<Main.ResCommunicationStatusNew>("/main/CommunicationStatusNew", params);
};

// 概况-变配电站状态 接口6 点击遥测越限 接口
export const OverLimitEventNew = (params: Main.ReqOverLimitEventNew) => {
  return http.postForm<Main.ResOverLimitEventNew>("/main/OverLimitEventNew", params);
};

// 概况-变配电站状态 接口7 点击遥信变位 接口
export const EnergyLineLoss = (params: Main.ReqEnergyLineLoss) => {
  return http.postForm<Main.ResEnergyLineLoss>("/main/EnergyLineLoss", params);
};

// 用能分析-用能报表
export const ElectricityFeesNoHj = (params: Main.ReqElectricityFeesNoHj) => {
  return http.postForm<Main.ResElectricityFeesNoHj>("/main/ElectricityFeesNoHj", params);
};
