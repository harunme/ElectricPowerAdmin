import http from "@/api";

// 获取监测回路
export const getCircuitInfoTree = () => {
  return http.post(`/org/getCircuitInfoTree`);
};
