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

// 用户组 接口1 根据组织机构ID查询用户组
export const selectUserGroupTree = (params: Org.ReqSelectUserGroupTree) => {
  return http.postForm<Org.ResSelectUserGroupTree>(`/org/selectUserGroupTree`, params);
};
// 用户组 接口2 新增用户组
export const insertUserGroup = (params: Org.ReqInsertUserGroup) => {
  return http.postForm<Org.ResInsertUserGroup>(`/org/insertUserGroup`, params);
};
// 用户组 接口3 删除一个用户组
export const deleteUserGroup = (params: Org.ReqDeleteUserGroup) => {
  return http.postForm<Org.ResDeleteUserGroup>(`/org/deleteUserGroup`, params);
};
// 用户组 接口4 修改用户组
export const updateUserGroup = (params: Org.ReqUpdateUserGroup) => {
  return http.postForm<Org.ResUpdateUserGroup>(`/org/updateUserGroup`, params);
};

// 角色 接口1 根据组织机构ID查询角色
export const getRolesListTree = (params: Org.ReqGetRolesListTree) => {
  return http.postForm<Org.ResGetRolesListTree>(`/org/getRolesListTree`, params);
};
// 角色 接口2 新增角色
export const insertRole = (params: Org.ReqInsertRole) => {
  return http.postForm<Org.ResInsertRole>(`/org/insertRole`, params);
};
// 角色 接口3 删除角色
export const deleteRole = (params: Org.ReqDeleteRole) => {
  return http.postForm<Org.ResDeleteRole>(`/org/deleteRole`, params);
};
// 角色 接口4 修改角色
export const updateRole = (params: Org.ReqUpdateRole) => {
  return http.postForm<Org.ResUpdateRole>(`/org/updateRole`, params);
};

// 角色 接口6 根据角色ID得到所有APP菜单及选中项
export const listProjectRoleAppMenu = (params: Org.ReqListProjectRoleAppMenu) => {
  return http.postForm<Org.ResListProjectRoleAppMenu>(`/org/listProjectRoleAppMenu`, params);
};

// 角色 接口1 根据组织机构ID查询用户信息
export const getUserCommonInfo = (params?: Org.ReqGetUserCommonInfo) => {
  return http.postForm<Org.ResGetUserCommonInfo[]>(`/org/getUserCommonInfo`, params);
};

// 角色 接口2 根据用户ID查询变电站信息
export const getSubstationListOfSelected = (params: Org.ReqGetSubstationListOfSelected) => {
  return http.postForm<Org.ResGetSubstationListOfSelected>(`/org/getSubstationListOfSelected`, params);
};

// 角色 接口3  用户ID所属组织或区域的所有变电站
export const getSubstationListUnderCompanyOrSubgroup = (params?: Org.ReqGetSubstationListUnderCompanyOrSubgroup) => {
  return http.postForm<Org.ResGetSubstationListUnderCompanyOrSubgroup>(`/org/getSubstationListUnderCompanyOrSubgroup`, params);
};

// 角色 接口4  修改用户ID和变电站关系表
export const updateUserAndSub = (params: Org.ReqUpdateUserAndSub) => {
  return http.postForm<Org.ResUpdateUserAndSub>(`/org/updateUserAndSub`, params);
};

// 角色 接口5  新增一个用户
export const insertUser = (params: Org.ReqInsertUser) => {
  return http.postForm<Org.ResInsertUser>(`/org/insertUser`, params);
};

// 角色 接口6  删除一个用户
export const deleteUser = (params: Org.ReqDeleteUser) => {
  return http.postForm<Org.ResDeleteUser>(`/org/deleteUser`, params);
};

// 角色 接口7  修改一个用户
export const updateUser = (params: Org.ReqUpdateUser) => {
  return http.postForm<Org.ResUpdateUser>(`/org/updateUser`, params);
};

// 角色 接口8  修改一级密码
export const updatePassword = (params: Org.ReqUpdatePassword) => {
  return http.postForm<Org.ResUpdatePassword>(`/org/updatePassword`, params);
};

// 角色 接口9  修改二级密码
export const updatePassword2 = (params: Org.ReqUpdatePassword2) => {
  return http.postForm<Org.ResUpdatePassword2>(`/org/updatePassword2`, params);
};
