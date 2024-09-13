// import qs from "qs";
import { Login } from "@/api/interface/index";
// import { PORT1 } from "@/api/config/servicePort";
// import authMenuList from "@/assets/json/authMenuList.json";
import http from "@/api";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLogin) => {
  return http.postForm<Login.ResLogin>(`/api/login`, params);
};

// 获取菜单列表
export const searchRoleProjectMenu = () => {
  return http.get<Menu.MenuOptions[]>(`/menu/searchRoleProjectMenu`, { projectType: 0 }, { loading: false });
};

// 用户退出登录
export const logout = () => {
  return http.post(`/api/logout`);
};
