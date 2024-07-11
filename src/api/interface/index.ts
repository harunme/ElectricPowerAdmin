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

  export interface ResEnergyReportNoHjPageInfo
    extends ResPage<{
      stationid: string;
      stationname: string;
      date: string;
      value: number;
    }> {}

  export interface ReqSummary extends ReqPage {
    sortParam: string;
    sortTag: string;
    stationid?: string;
  }

  export interface ResSummary {
    disconnectNumber: number;
    red: number;
    green: number;
    yellow: number;
    pageInfo: ResPage<{
      stationid: string;
      stationname: string;
      transformerid: string;
      transformername: string;
      voltagestep: string;
      meter: string;
      pdatetime: string;
      loadFactor: string;
      p: number;
      p_Unit: string;
      pf: number;
      pf_Unit: string;
      s: number;
      s_Unit: string;
    }>;
  }
  export interface ReqGetAlarmEventYxList extends ReqPage {
    starttime?: string;
    endtime?: string;
    stationid?: string;
    metername?: string;
    paramname?: string;
  }
  export interface ResGetAlarmEventYxList
    extends ResPage<{
      eventname0: string;
      alarmtime: string;
      stationid: string;
      stationname: string;
      meter: string;
      metername: string;
      paramname: string;
      eventdescription: string;
      codetype: string;
      stateint: number;
      statedes: string;
    }> {}

  export interface ReqGetAlarmEventYcList extends ReqPage {
    starttime?: string;
    endtime?: string;
    stationid?: string;
    metername?: string;
    paramname?: string;
    eventtype?: string;
  }
  export interface ResGetAlarmEventYcList
    extends ResPage<{
      eventname0: string;
      alarmtime: string;
      stationid: string;
      stationname: string;
      meter: string;
      metername: string;
      paramname: string;
      eventdescription: string;
      codetype: string;
      stateint: number;
      statefloat: number;
      statedes: string;
      limitvalue: number;
    }> {}

  export interface ReqPlatformRunLogPageInfo extends ReqPage {
    starttime?: string;
    endtime?: string;
    stationid?: string;
    meterid?: string;
    eventtype?: string;
  }
  export interface ResPlatformRunLogPageInfo
    extends ResPage<{
      eventname0: string;
      alarmtime: string;
      stationid: string;
      stationname: string;
      meter: string;
      metername: string;
      paramname: string;
      eventdescription: string;
      codetype: string;
      stateint: number;
      statefloat: number;
      statedes: string;
      limitvalue: number;
    }> {}

  export interface ReqGetLogPageInfo extends ReqPage {
    starttime?: string;
    endtime?: string;
    selectedname?: string;
  }
  export interface ResGetLogPageInfo
    extends ResPage<{
      userid: string;
      content: string;
      stationname: string;
      useraddress: string;
      datetime: string;
    }> {}

  export interface ReqGetAlarmEventLogListHis extends ReqPage {
    starttime?: string;
    endtime?: string;
    stationid?: string;
    messinfotype?: string;
    alarmtype?: string;
    metersearch?: string;
    messinfolevel?: string;
  }
  export interface ResGetAlarmEventLogListHis
    extends ResPage<{
      accountid: string;
      destext: string;
      stationname: string;
      useaddress: string;
      logintime: string;
    }> {}

  export interface ReqTransformerTempMonthReport extends ReqPage {
    stationid?: string;
    transformerid?: string;
    starttime?: string;
  }
  export interface ResTransformerTempMonthReport
    extends ResPage<{
      stationid: string;
      stationname: string;
      objectid: string;
      objectname: string;
      meter: string;
      collecttime: string;
      fTempA: string;
      fTempB: string;
      fTempC: string;
    }> {}
}
