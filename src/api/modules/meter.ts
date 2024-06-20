import { Meter } from "@/api/interface/index";
import http from "@/api";

// 通过组织或区域找变电站
export const getSubstationListBySubGroupId = (params: Meter.ReqGetSubstationListBySubGroupId) => {
  return http.postForm<Meter.ResGetSubstationListBySubGroupId>(`/meter/getSubstationListBySubGroupId`, params);
};
