import http from "@/api";

// 获取组织机构树
export const getCompanyTree = () => {
  return http.post(`/org/getCompanyTree`);
};
