import http from "@/api";
import { Menu } from "@/api/interface/index";

// 角色 接口5 根据角色ID得到所有WEB菜单及选中项
export const selectProjectRoleById = (params?: Menu.ReqSelectProjectRoleById) => {
  return http.postForm<Menu.ResSelectProjectRoleById>(`/menu/selectProjectRoleById`, params);
};

// 登录成功后通过登录ID得到菜单树
export const getProjectRoleMenu = (params?: Menu.ReqGetProjectRoleMenu) => {
  return http.postForm(`/menu/getProjectRoleMenu`, params);
};
