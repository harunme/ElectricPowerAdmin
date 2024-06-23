import http from "@/api";

// 获取组织机构树
export const getCompanyTree = () => {
  return http.post(`/org/getCompanyTree`);
};

// 获取区域
export const getSubGroupTree = () => {
  return http.post(`/org/getSubGroupTree`);
};
