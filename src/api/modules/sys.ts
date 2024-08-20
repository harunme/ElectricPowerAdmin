import http from "@/api";
import { Sys } from "@/api/interface/index";

// 测量回路 接口1 得到所有回路树
export const getCircuitInfoTree = (params: Sys.ReqGetCircuitInfoTree) => {
  return http.postForm<Sys.ResGetCircuitInfoTree[]>(`/sys/getCircuitInfoTree`, params);
};
// 测量回路 接口2 新增一个回路
export const insertCircuitInfo = (params: Sys.ReqInsertCircuitInfo) => {
  return http.postForm<Sys.ResInsertCircuitInfo>(`/sys/insertCircuitInfo`, params);
};
// 测量回路 接口3 删除一个回路
export const deleteCircuitById = (params: Sys.ReqDeleteCircuitById) => {
  return http.postForm<Sys.ResDeleteCircuitById>(`/sys/deleteCircuitById`, params);
};
// 测量回路 接口4 修改一个回路
export const updateCircuitById = (params: Sys.ReqUpdateCircuitById) => {
  return http.postForm<Sys.ResUpdateCircuitById>(`/sys/updateCircuitById`, params);
};
// 监测回路 接口5  自动生成回路编号
export const randomCircuitId = (params: Sys.ReqRandomCircuitId) => {
  return http.postForm<Sys.ResRandomCircuitId>(`/sys/randomCircuitId`, params);
};
