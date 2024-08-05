import { Meter } from "@/api/interface/index";
import http from "@/api";

// 通过组织或区域找变电站
export const getSubstationListBySubGroupId = (params: Meter.ReqGetSubstationListBySubGroupId) => {
  return http.postForm<Meter.ResGetSubstationListBySubGroupId>(`/meter/getSubstationListBySubGroupId`, params);
};

// 系统设置-变配电站 接口2 得到变电站列表
// http://111.231.24.91/meter/getSubstationPageInfo
export const getSubstationPageInfo = (params: Meter.ReqGetSubstationPageInfo) => {
  return http.postForm<Meter.ResGetSubstationPageInfo>(`/meter/getSubstationPageInfo`, params);
};

// 系统设置-变配电站 接口3  新增一个变电站信息
// http://111.231.24.91/meter/insertSubstationInfo
export const insertSubstationInfo = (params: Meter.ReqInsertSubstationInfo) => {
  return http.postForm<Meter.ResInsertSubstationInfo[]>(`/meter/insertSubstationInfo`, params);
};

// 系统设置-变配电站 接口4   改电价
// http://111.231.24.91/meter/pdateByPrimaryKeySelectiveBatchByfSubid
// export const pdateByPrimaryKeySelectiveBatchByfSubid = (params: Meter.ReqPdateByPrimaryKeySelectiveBatchByfSubid) => {
//   return http.postForm<Meter.ResPdateByPrimaryKeySelectiveBatchByfSubid>(
//     `/meter/pdateByPrimaryKeySelectiveBatchByfSubid`,
//     params
//   );
// };

// 系统设置-变配电站 接口5   删除一个变电站
// http://111.231.24.91/meter/deleteSubstationInfoById
export const deleteSubstationInfoById = (params: Meter.ReqDeleteSubstationInfoById) => {
  return http.postForm<Meter.ResDeleteSubstationInfoById[]>(`/meter/deleteSubstationInfoById`, params);
};

// 系统设置-变配电站 接口6   修改一个变电站信息
// http://111.231.24.91/meter/updateSubstationInfoById
// export const updateSubstationInfoById = (params: Meter.ReqUpdateSubstationInfoById) => {
//   return http.postForm<Meter.ResUpdateSubstationInfoById>(`/meter/updateSubstationInfoById`, params);
// };

// // 系统设置-变配电站 接口7  上传SVG文件
// // http://111.231.24.91/meter/uploadSvgMultiFile
// export const uploadSvgMultiFile = (params: Meter.ReqUploadSvgMultiFile) => {
//   return http.postForm<Meter.ResUploadSvgMultiFile>(`/meter/uploadSvgMultiFile`, params);
// };
