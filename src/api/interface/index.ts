// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLogin {
    username: string;
    password: string;
  }
  export interface ResLogin {
    homeUrl: string;
    token: string;
  }
}

// 变电站模块
export namespace Meter {
  export interface Station {
    stationname: string;
  }
  export interface ReqGetSubstationListBySubGroupId extends ReqPage {
    deptid?: number;
  }
  export interface ResGetSubstationListBySubGroupId extends ResPage<Station> {}
}

// 业务模块
export namespace Main {
  export interface ReqEnergyReportNoHjPageInfo extends ReqPage {
    startTime: string;
    endTime: string;
  }
}
