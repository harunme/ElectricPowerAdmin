// 请求响应参数（不包含data）
export interface Result<T = any> {
  data: T;
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

  export interface ResGetCirLoadRate {
    PowerValue: {
      stationid: string;
      circuitid: string;
      circuitname: string;
      collecttime: string;
      fPMaxValue: string;
      fPAverag: string;
      fPLoadRate: string;
    }[];
  }

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
  export interface ResAveragePowerReport {
    list: {
      stationid: string;
      circuitid: string;
      circuitname: string;
      collecttime: string;
      fEpi: string;
      fEpe: string;
      fEql: string;
      fEqc: string;
      fPF: string;
    }[];
  }

  export interface ResElectricReport {
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
  }
  export interface ReqElectricReport {
    stationid: string;
    circuitid: string;
    starttime: string;
    timeinterval: string;
  }

  export interface ResElecMaxMinAvgValue {
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
  }

  export interface ReqElecMaxMinAvgValue {
    stationid: string;
    circuitids: string;
    starttime: string;
    // 电流 I，电压 U，功率 P，不平衡度 UnB，电压谐波 UHR，电流谐波 IHR。
    param: "I" | "U" | "P" | "UnB" | "UHR" | "IHR";
    scheme: "day" | "month" | "custom";
  }

  export interface ResElectricReportNew {
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
  }
  export interface ReqElectricReportNew {
    stationid: string;
    circuitid: string;
    starttime: string;
  }

  export interface ResElectricMonthReport {
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
  }

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

  export interface ResGetMonthMom {
    PowerValue: {
      sumyoyvalue: string;
      collecttime: string;
      data: string;
      yoyvalue: string;
      predata: string;
      circuitid: string;
      circuitname: string;
    }[];
  }

  export interface ReqEnergyReportMOM {
    stationid: string;
    circuitids?: string;
    circuitid: string;
    starttime: string;
    scheme: "D" | "W" | "M";
  }

  export interface ResEnergyReportMOM {
    PowerValue: {
      diffvalue: string;
      curvalue: string;
      momvalue: string;
      beforevalue: string;
      circuitid: string;
      circuitname: string;
    }[];
  }

  export interface ReqConsumeEnergyReport {
    stationid: string;
    circuitids: string;
    starttime: string;
    endtime: string;
    energyKind?: "EPI" | "EPE" | "ZHEPI";
  }
  export interface ResConsumeEnergyReport {
    PowerValue: {
      diffvalue: string;
      endvalue: string;
      startvalue: string;
      circuitid: string;
      circuitname: string;
    }[];
  }

  export interface ReqEnergyLineLoss2Tree {
    stationid: string;
    starttime: string;
    endtime: string;
  }

  export interface ResEnergyLineLoss2Tree {
    LineLossData: {
      isincoming: boolean;
      subValue: number;
      meter: string;
      hasChildren: boolean;
      diffValue: number;
      stationname: string;
      parentValue: number;
      percent: number;
      circuitid: string;
      circuitname: string;
      stationid: string;
    }[];
  }

  export interface ReqGetCurveDataOfPowerAndTempABCNew {
    transformerid: string;
    starttime: string;
    params: "S" | "P" | "Q" | "Pf" | "U" | "I" | "Temp";
  }

  export interface ResGetCurveDataOfPowerAndTempABCNew {
    yesterdayOrigPower: {
      stationid: string;
      stationname: string;
      objectid: string;
      objectname: string;
      meter: string;
      collecttime: string;
      fP: string;
      fPF: string;
      fPFa: string;
      fPFb: string;
      fPFc: string;
      fPa: string;
      fPb: string;
      fPc: string;
      fQ: string;
      fQa: string;
      fQb: string;
      fQc: string;
      fS: string;
      fSa: string;
      fSb: string;
      fSc: string;
      fIa: string;
      fIb: string;
      fIc: string;
      fTempA: string;
      fTempB: string;
      fTempC: string;
      Uab: string;
      Ubc: string;
      Uca: string;
      Ua: string;
      Ub: string;
      Uc: string;
    }[];
    origPower: {
      stationid: string;
      stationname: string;
      objectid: string;
      objectname: string;
      meter: string;
      collecttime: string;
      fP: string;
      fPF: string;
      fPFa: string;
      fPFb: string;
      fPFc: string;
      fPa: string;
      fPb: string;
      fPc: string;
      fQ: string;
      fQa: string;
      fQb: string;
      fQc: string;
      fS: string;
      fSa: string;
      fSb: string;
      fSc: string;
      fIa: string;
      fIb: string;
      fIc: string;
      fTempA: string;
      fTempB: string;
      fTempC: string;
      Uab: string;
      Ubc: string;
      Uca: string;
      Ua: string;
      Ub: string;
      Uc: string;
    }[];
  }

  export interface ReqTransformerMonitor {
    stationid: string;
    transformerid: string;
  }
  export interface ResTransformerMonitor {
    TransformerStatus: {
      fIa: string;
      fIb: string;
      fIc: string;
      fP: string;
      fPF: string;
      fQ: string;
      fS: string;
      fTempA: string;
      fTempB: string;
      fTempC: string;
      fUab: string;
      fUbc: string;
      fUca: string;
      fInstalledcapacity: string;
      fRatedcurrent: string;
      loadFactor: string;
      maxDemand: string;
      loadRate: string;
      averageVal: string;
    };
  }

  export interface ReqElectricData {
    stationid: string;
    circuitids: string;
    startTime: string;
    endTime: string;
    phase: "IUnB" | "UUnB";
  }

  export interface ResElectricData {
    PowerValue: {
      stationid: string;
      circuitid: string;
      circuitname: string;
      date: string;
      phase: string;
      data: number;
    }[];
  }

  export interface ReqThreePhaseHarmonic {
    stationid: string;
    circuitids: string;
    time: string;
    energyKind: "I" | "U";
    thdtype: string;
    phase: string;
  }
  export interface ResThreePhaseHarmonic {
    PowerValue: {
      stationid: string;
      circuitid: string;
      circuitname: string;
      date: string;
      energykind: string;
      phase: string;
      thdtype: string;
      data: number;
    }[];
  }

  export interface ResGetUnConfirmedEventsByCache {
    code: number;
    msg: string;
    numsByLevel: {
      eventtype: number;
      eventname: string;
      eventcount: number;
      unconfirmcount: number;
    }[];
    numsByType: {
      eventtype: number;
      eventname: string;
      eventcount: number;
      unconfirmcount: number;
    }[];
  }

  export interface ReqGetAlarmEventLogList extends ReqPage {
    stationid: string;
    confirmstatus?: 0;
    starttime: string;
    endtime: string;
    messinfotype?: 2 | 3 | 4;
    alarmtype?: string;
    metersearch?: string;
    messinfolevel: "1" | "2" | "3";
  }

  export interface ResGetAlarmEventLogList
    extends ResPage<{
      eventname0: string;
      alarmtime: string;
      eventdescription: string;
      confirmer: string;
      deptid: string;
      deptname: string;
      stationid: string;
      stationname: string;
      circuitid: string;
      circuitname: string;
      meter: string;
      metername: string;
      messinfolevel: number;
      messinfoleveltext: string;
      messinfotype: number;
      messinfotypetext: string;
      confirmid: string;
      confirmstatus: boolean;
      alarmtype: string;
      paramname: string;
      mconfirmtime: string;
    }> {}

  export interface ReqElectricDataMonth {
    stationid: string;
    circuitids: string;
    starttime: string;
    endtime: string;
    energykind: "P";
    phase: string;
  }

  export interface ResElectricDataMonth {
    P: string[];
    Pa: string[];
    Pb: string[];
    Pc: string[];
    times: string[];
  }

  export interface ReqElectricDataPaging extends ReqPage {
    stationid: string;
    circuitids: string;
    starttime: string;
    endtime: string;
    energykind: "P";
    phase: string;
  }
  export interface ResElectricDataPaging
    extends ResPage<{
      stationid: string;
      circuitid: string;
      circuitname: string;
      collecttime: string;
      fP: number;
      fPa: number;
      fPb: number;
      fPc: number;
    }> {}

  export interface ResGetDMYAlarmCompare {
    curdaynums: number;
    yesdaynums: number;
    dayMom: string;
    curmonnums: number;
    yesmonnums: number;
    monthMom: string;
    curyearnums: number;
    yesyearnums: number;
    yearMom: string;
  }

  export interface ResGetMessInfoTypeAlarmLogNum {
    messinfotypeexplain: "string";
    messinfotypeid: "string";
    todaylognum: "string";
  }

  export interface ResGetMonthAlarmLogNum {
    fday: number;
    fdaynum: number;
  }

  export interface ReqGetSubstationAlarmLogNum extends ReqPage {
    starttime: string;
    endtime: string;
  }

  export interface ReqGetMonthAlarmLogNum {
    starttime?: string;
  }
  export interface ResGetSubstationAlarmLogNum
    extends ResPage<{
      eventname0: string;
      alarmtime: string | null;
      eventdescription: string;
      confirmer: string;
      deptid: string | null;
      deptname: string | null;
      stationid: string | null;
      stationname: string;
      circuitid: string | null;
      circuitname: string | null;
      meter: string | null;
      metername: string | null;
      messinfolevel: number;
      messinfoleveltext: string | null;
      messinfotype: number;
      messinfotypetext: string | null;
      confirmid: string | null;
      confirmstatus: false;
      alarmtype: string | null;
      paramname: string | null;
      mconfirmtime: string;
    }> {}
}
