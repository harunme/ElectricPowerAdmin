import http from "@/api";
import { Org } from "@/api/interface/index";

// 组织机构 接口1 查询组织机构
export const getCompanyTree = () => {
  return http.postForm<Org.ResGetCompanyTree>(`/org/getCompanyTree`);
};
// 组织机构 接口2 新增一个组织
export const insertDeptInfo = (params: Org.ReqInsertDeptInfo) => {
  return http.postForm<Org.ResInsertDeptInfo>(`/org/insertDeptInfo`, params);
};
// 组织机构 接口3 删除一个组织
export const deleteDeptById = (params: Org.ReqDeleteDeptById) => {
  return http.postForm<Org.ResDeleteDeptById>(`/org/deleteDeptById`, params);
};
// 组织机构 接口4 修改一个组织
export const updateDeptById = (params: Org.ReqUpdateDeptById) => {
  return http.postForm<Org.ResUpdateDeptById>(`/org/updateDeptById`, params);
};
// 组织机构 接口5 根据组织机构ID得到菜单
export const getProjectRoleMenuSelected = (params: Org.ReqGetProjectRoleMenuSelected) => {
  return http.postForm<Org.ResGetProjectRoleMenuSelected>(`/menu/getProjectRoleMenuSelected`, params);
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
