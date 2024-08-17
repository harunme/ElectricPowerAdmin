import http from "@/api";
import { Org } from "@/api/interface/index";

// 获取组织机构树
export const getCompanyTree = () => {
  return http.post(`/org/getCompanyTree`);
};

// 区域 接口1 查询区域
export const getSubGroupTree = () => {
  return http.postForm<Org.ResGetSubGroupTree>(`/org/getSubGroupTree`);
};
// 区域 接口2 新增一个区域
export const insertRegionInfo = (params: Org.ReqInsertRegionInfo) => {
  return http.postForm<Org.ResInsertRegionInfo>(`/org/insertRegionInfo`, params);
};
// 区域 接口3 删除一个区域
export const deleteRegionById = (params: Org.ReqGeleteRegionById) => {
  return http.postForm<Org.ResGeleteRegionById>(`/org/deleteRegionById`, params);
};
// 区域 接口4 修改一个区域
export const updateRegionById = (params: Org.ReqUpdateRegionById) => {
  return http.postForm<Org.ResUpdateRegionById>(`/org/updateRegionById`, params);
};
