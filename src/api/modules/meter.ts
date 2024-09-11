import { Meter } from "@/api/interface/index";
import http from "@/api";

/** 变配电站接口 */
// 通过组织或区域找变电站
export const getSubstationListBySubGroupId = (params: Meter.ReqGetSubstationListBySubGroupId) => {
  return http.postForm<Meter.ResGetSubstationListBySubGroupId>(`/meter/getSubstationListBySubGroupId`, params);
};

// 系统设置-变配电站 接口2 得到变电站列表
export const getSubstationPageInfo = (params: Meter.ReqGetSubstationPageInfo) => {
  return http.postForm<Meter.ResGetSubstationPageInfo>(`/meter/getSubstationPageInfo`, params);
};

// 系统设置-变配电站 接口3  新增一个变电站信息
export const insertSubstationInfo = (params: Meter.ReqInsertSubstationInfo) => {
  return http.postForm<Meter.ResInsertSubstationInfo[]>(`/meter/insertSubstationInfo`, params);
};

// 系统设置-变配电站 接口4   改电价
export const updateByPrimaryKeySelectiveBatchByfSubid = (params: Meter.ReqUpdateByPrimaryKeySelectiveBatchByfSubid) => {
  return http.postForm<Meter.ResUpdateByPrimaryKeySelectiveBatchByfSubid>(
    `/meter/updateByPrimaryKeySelectiveBatchByfSubid`,
    params
  );
};

// 系统设置-变配电站 接口5   删除一个变电站
export const deleteSubstationInfoById = (params: Meter.ReqDeleteSubstationInfoById) => {
  return http.postForm<Meter.ResDeleteSubstationInfoById[]>(`/meter/deleteSubstationInfoById`, params);
};

// 系统设置-变配电站 接口6   修改一个变电站信息
export const updateSubstationInfoById = (params: Meter.ReqUpdateSubstationInfoById) => {
  return http.postForm<Meter.ResUpdateSubstationInfoById>(`/meter/updateSubstationInfoById`, params);
};

// // 系统设置-变配电站 接口7  上传SVG文件
export const uploadSvgMultiFile = (params: Meter.ReqUploadSvgMultiFile) => {
  return http.postForm<Meter.ResUploadSvgMultiFile>(`/meter/uploadSvgMultiFile`, params);
};

/** 变压器接口 */
// 系统设置-变压器接口1 查询变压器列表
export const getTransformerInfo = (params: Meter.ReqGetTransformerInfo) => {
  return http.postForm<Meter.ResGetTransformerInfo[]>(`/meter/getTransformerInfo`, params);
};

// 系统设置-变压器接口2  新增一个变压器
export const insertTransformerInfo = (params: Meter.ReqInsertTransformerInfo) => {
  return http.postForm<Meter.ResInsertTransformerInfo>(`/meter/insertTransformerInfo`, params);
};

// 系统设置-变压器接口3 修改变压器
export const updateTransformerInfoById = (params: Meter.ReqUpdateTransformerInfoById) => {
  return http.postForm<Meter.ResUpdateTransformerInfoById>(`/meter/updateTransformerInfoById`, params);
};

// 系统设置-变压器接口4  删除变压器
export const deleteTransformerInfoById = (params: Meter.ReqDeleteTransformerInfoById) => {
  return http.postForm<Meter.ResDeleteTransformerInfoById>(`/meter/deleteTransformerInfoById`, params);
};

// 系统设置-变压器接口5  自动生成变压器编号
export const randomTransformerId = (params: Meter.ReqRandomTransformerId) => {
  return http.postForm<Meter.ResRandomTransformerId>(`/meter/randomTransformerId`, params);
};

// 系统设置-变压器接口6  返回一个仪表列表。回路中也可用
export const getMeterListByStationId = (params: Meter.ReqGetMeterListByStationId) => {
  return http.postForm<Meter.ResGetMeterListByStationId[]>(`/meter/getMeterListByStationId`, params);
};

/** 仪表接口 */
// 系统设置-仪表 接口1 查询仪表类型
export const getMeterTypeList = () => {
  return http.postForm<Meter.ResGetMeterTypeList[]>(`/meter/getMeterTypeList`);
};

// 系统设置-仪表 接口2 查询仪表状态
export const getMeterStateList = () => {
  return http.postForm<Meter.ResGetMeterStateList[]>(`/meter/getMeterStateList`);
};

// 系统设置-仪表 接口3 查询一个变电站的仪表
export const getMeterUseInfoList = (params: Meter.ReqGetMeterUseInfoList) => {
  return http.postForm<Meter.ResGetMeterUseInfoList>(`/meter/getMeterUseInfoList`, params);
};

// 系统设置-仪表 接口4 新增一个变电站的仪表
export const insertMeterUseInfo = (params: Meter.ReqInsertMeterUseInfo) => {
  return http.postForm<Meter.ResInsertMeterUseInfo>(`/meter/insertMeterUseInfo`, params);
};

// 系统设置-仪表 接口5 修改一个变电站的仪表
export const updateMeterUseInfo = (params: Meter.ReqUpdateMeterUseInfo) => {
  return http.postForm<Meter.ResUpdateMeterUseInfo>(`/meter/updateMeterUseInfo`, params);
};
// 系统设置-仪表 接口6 删除一个变电站的仪表
export const deleteMeterUseInfo = (params: Meter.ReqDeleteMeterUseInfo) => {
  return http.postForm<Meter.ResDeleteMeterUseInfo>(`/meter/deleteMeterUseInfo`, params);
};
// 系统设置-仪表 接口7  批量修改一个变电站的仪表状态
export const updateMultiMeterStatus = (params: Meter.ReqUpdateMultiMeterStatus) => {
  return http.postForm<Meter.ResUpdateMultiMeterStatus>(`/meter/updateMultiMeterStatus`, params);
};

// 系统设置-变压器接口8  自动生成仪表编号
export const randomMeterId = (params: Meter.ReqRandomMeterId) => {
  return http.postForm<Meter.ResRandomMeterId>(`/meter/randomMeterId`, params);
};

/** 通道（网关） */
// 系统设置-通道 接口1 查询一个变电站的通道
export const getGatewayInfo = (params: Meter.ReqGetGatewayInfo) => {
  return http.postForm<Meter.ResGetGatewayInfo[]>(`/meter/getGatewayInfo`, params);
};

// 系统设置-通道 接口2 增加一个变电站的通道
export const insertGatewayInfo = (params: Meter.ReqInsertGatewayInfo) => {
  return http.postForm<Meter.ResInsertGatewayInfo>(`/meter/insertGatewayInfo`, params);
};

// 系统设置-通道 接口3 删除一个变电站的通道
export const deleteGatewayInfo = (params: Meter.ReqDeleteGatewayInfo) => {
  return http.postForm<Meter.ResDeleteGatewayInfo>(`/meter/deleteGatewayInfo`, params);
};

// 系统设置-通道 接口4 修改一个变电站的通道
export const updateGatewayInfo = (params: Meter.ReqUpdateGatewayInfo) => {
  return http.postForm<Meter.ResUpdateGatewayInfo>(`/meter/updateGatewayInfo`, params);
};

// 系统设置-通道 接口5 自动生成通道编号
export const randomChannelId = (params: Meter.ReqRandomChannelId) => {
  return http.postForm<Meter.ResRandomChannelId>(`/meter/randomChannelId`, params);
};

// 系统设置-通道 接口6 查询通道的通讯设备
export const getGatewayDev = () => {
  return http.postForm<Meter.ResGetGatewayDev[]>(`/meter/getGatewayDev`);
};
