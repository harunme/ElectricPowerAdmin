// 请求响应参数（不包含data）
export interface Result<T = any> {
  data: T;
  code: string;
  msg: string;
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

  export interface ReqTransformerTempMonthReport {
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

  export interface ResGetCirLoadRate
    extends Result<{
      PowerValue: {
        stationid: string;
        circuitid: string;
        circuitname: string;
        collecttime: string;
        fPMaxValue: string;
        fPAverag: string;
        fPLoadRate: string;
      }[];
    }> {}

  export interface ReqGetCirLoadRate {
    stationid: string;
    circuitid: string;
    starttime: string;
    scheme: "M" | "Y";
  }

  export interface ReqAveragePowerReport {
    stationid?: string;
    circuitid?: string;
    starttime?: string;
    scheme: "M" | "Y";
  }
  export interface ResAveragePowerReport
    extends Result<{
      list: {
        stationid: string;
        circuitid: string;
        circuitname: string;
        collecttime: string;
        fEpi: string;
        fEpe: string;
        fEql: string;
        fEqc: string;
        fPf: string;
      }[];
    }> {}

  export interface ResElectricReport
    extends Result<{
      PowerValue: {
        circuitid: string;
        circuitname: string;
        collecttime: string;
        fEpe: string;
        fEpi: string;
        fIa: string;
        fIb: string;
        fIc: string;
        fP: string;
        fPf: string;
        fQ: string;
        fS: string;
        fUa: string;
        fUb: string;
        fUc: string;
        fUab: string;
        fUbc: string;
        fUca: string;
      }[];
    }> {}

  export interface ReqElectricReport {
    stationid: string;
    circuitid: string;
    starttime: string;
    timeinterval: string;
  }

  export interface ResElecMaxMinAvgValue
    extends Result<{
      StatisticValue: {
        stationid: string;
        stationname: string;
        objectid: string;
        objectname: string;
        meter: string;
        collecttime: string;
        fIaavg: string;
        fIamaxvalue: string;
        fIaminvalue: string;
        fIamaxtime: string;
        fIamintime: string;
        fIbavg: string;
        fIbmaxvalue: string;
        fIbminvalue: string;
        fIbmaxtime: string;
        fIbmintime: string;
        fIcavg: string;
        fIcmaxvalue: string;
        fIcminvalue: string;
        fIcmaxtime: string;
        fIcmintime: string;
      }[];
    }> {}

  export interface ReqElecMaxMinAvgValue {
    stationid: string;
    circuitids: string;
    starttime: string;
    // 电流 I，电压 U，功率 P，不平衡度 UnB，电压谐波 UHR，电流谐波 IHR。
    param: "I" | "U" | "P" | "UnB" | "UHR" | "IHR";
    scheme: "day" | "month" | "custom";
  }

  export interface ResElectricReportNew
    extends Result<{
      PowerValue: {
        circuitid: string;
        circuitname: string;
        collecttime: string;
        fEpe: string;
        fEpi: string;
        fIa: string;
        fIb: string;
        fIc: string;
        fP: string;
        fPF: string;
        fQ: string;
        fS: string;
        fUa: string;
        fUb: string;
        fUc: string;
        fUab: string;
        fUbc: string;
        fUca: string;
      }[];
    }> {}

  export interface ReqElectricReportNew {
    stationid: string;
    circuitid: string;
    starttime: string;
  }

  export interface ResElectricMonthReport
    extends Result<{
      PowerValue: {
        circuitid: string;
        circuitname: string;
        collecttime: string;
        fEpe: string;
        fEpi: string;
        fIa: string;
        fIb: string;
        fIc: string;
        fP: string;
        fPF: string;
        fQ: string;
        fS: string;
        fUa: string;
        fUb: string;
        fUc: string;
        fUab: string;
        fUbc: string;
        fUca: string;
      }[];
    }> {}

  export interface ReqElectricMonthReport {
    stationid: string;
    circuitid: string;
    starttime: string;
  }

  export interface ReqGetMonthMom {
    stationid: string;
    circuitid: string;
    starttime: string;
  }

  export interface ResGetMonthMom
    extends Result<{
      PowerValue: {
        sumyoyvalue: string;
        collecttime: string;
        data: string;
        yoyvalue: string;
        predata: string;
        circuitid: string;
        circuitname: string;
      }[];
    }> {}

  export interface ReqEnergyReportMOM {
    stationid: string;
    circuitids?: string;
    circuitid: string;
    starttime: string;
    scheme: "D" | "W" | "M";
  }

  export interface ResEnergyReportMOM
    extends Result<{
      PowerValue: {
        diffvalue: string;
        curvalue: string;
        momvalue: string;
        beforevalue: string;
        circuitid: string;
        circuitname: string;
      }[];
    }> {}
}
