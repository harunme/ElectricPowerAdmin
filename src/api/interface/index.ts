// 请求响应参数（不包含data）
export interface Result<T = any> {
  data: T;
  code: number;
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

export namespace Sys {
  export interface ReqGetCircuitInfoTree {}
  export interface ResGetCircuitInfoTree {}
  export interface ReqInsertCircuitInfo {
    stationid: string;
    circuitid: string;
    circuitname: string;
    parentid: string;
    isincoming: 0 | 1;
    meter: string;
  }
  export interface ResInsertCircuitInfo {}
  export interface ReqDeleteCircuitById {}
  export interface ResDeleteCircuitById {}
  export interface ReqUpdateCircuitById {}
  export interface ResUpdateCircuitById {}
  export interface ReqRandomCircuitId {
    stationid: string;
  }
  export interface ResRandomCircuitId {
    circuitid: string;
  }
}

export namespace Org {
  export interface ResGetSubGroupTree {}

  export interface ReqInsertRegionInfo {}
  export interface ResInsertRegionInfo {}
  export interface ReqGeleteRegionById {
    regionid: string;
  }
  export interface ResGeleteRegionById {}
  export interface ReqUpdateRegionById {}
  export interface ResUpdateRegionById {}

  export interface ReqGetCompanyTree {}
  export interface ResGetCompanyTree {}
  export interface ReqInsertDeptInfo {}
  export interface ResInsertDeptInfo {}
  export interface ReqDeleteDeptById {
    deptid: string;
  }
  export interface ResDeleteDeptById {}
  export interface ReqUpdateDeptById {}
  export interface ResUpdateDeptById {}
  export interface ReqGetProjectRoleMenuSelected {}
  export interface ResGetProjectRoleMenuSelected {}
  export interface ReqSelectUserGroupTree {}
  export interface ResSelectUserGroupTree {}
  export interface ReqInsertUserGroup {}
  export interface ResInsertUserGroup {}
  export interface ReqDeleteUserGroup {
    groupid: string;
  }
  export interface ResDeleteUserGroup {}
  export interface ReqUpdateUserGroup {}
  export interface ResUpdateUserGroup {}
  export interface ReqGetRolesListTree {}
  export interface ResGetRolesListTree {}
  export interface ReqInsertRole {}

  export interface ResInsertRole {}
  export interface ReqDeleteRole {}
  export interface ResDeleteRole {}
  export interface ReqUpdateRole {}
  export interface ResUpdateRole {}
  export interface ReqSelectProjectRoleById {}
  export interface ResSelectProjectRoleById {}
  export interface ReqListProjectRoleAppMenu {}
  export interface ResListProjectRoleAppMenu {}
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

  export interface ReqGetSubstationPageInfo extends ReqPage {
    deptid?: string;
    regionid?: string;
    search?: string;
  }
  export interface ResGetSubstationPageInfo
    extends ResPage<{
      stationid: string;
      stationname: string;
      deptname: string;
      deptid: number;
      regionid: number;
      regionname: string;
      head: string;
      telephone: string;
      address: string;
      voltagestep: number;
      sxtsumP: string;
      sxtsumQ: string;
      transformernum: number;
      type: number;
      order: number;
      level: number;
      startno: number;
    }> {}

  export interface ReqInsertSubstationInfo {
    stationname: string;
    deptid: number | undefined;
    regionid: number | undefined;
    installedcapacity: number;
    voltagestep: number;
    head: string;
    telephone: string;
    headphone: string;
    voltagelevel: string;
    voltageoftrans: string;
    address: string;
    transformernum: number;
    epijprice: number;
    epifprice: number;
    epipprice: number;
    epigprice: number;
    epi5price: number;
    episingleprice: number;
  }

  export interface ResInsertSubstationInfo {
    stationid: string;
    stationname: string;
    deptname: string;
    deptid: string;
    regionid: string;
    regionname: string;
    head: string;
    telephone: string;
    address: string;
    voltagestep: number;
    sxtsumP: string;
    sxtsumQ: string;
    transformernum: number;
    type: number;
    order: number;
    level: number;
    startno: number;
  }

  export interface ReqDeleteSubstationInfoById {
    stationid: string;
  }

  export interface ResDeleteSubstationInfoById {}
  export interface ReqGetTransformerInfo {
    stationid: string;
  }
  export interface ResGetTransformerInfo {
    stationid: string;
    stationname: string;
    transformerid: string;
    transformername: string;
    regionid: string;
    regionname: string;
    current: string;
    meter: string;
    firstmeterno: string;
  }

  export interface ReqInsertTransformerInfo {
    stationid?: string;
    transformerid: string;
    transformername: string;
    type: "1" | "2";
    voltagestep: number;
    current: number;
    meter: string;
  }

  export interface ResInsertTransformerInfo {}
  export interface ReqUpdateTransformerInfoById {
    stationid: string;
    transformerid: string;
    transformername: string;
    type: "1" | "2";
    voltagestep: string;
    current: string;
    meter: string;
  }
  export interface ResUpdateTransformerInfoById {}
  export interface ReqDeleteTransformerInfoById {
    transformerid: string;
  }
  export interface ResDeleteTransformerInfoById {}
  export interface ReqPdateByPrimaryKeySelectiveBatchByfSubid {}
  export interface ResPdateByPrimaryKeySelectiveBatchByfSubid {}
  export interface ReqUpdateSubstationInfoById {}
  export interface ResUpdateSubstationInfoById {}
  export interface ReqUploadSvgMultiFile {}
  export interface ResUploadSvgMultiFile {}

  export interface ResGetMeterTypeList {
    metertypecode: string;
    metertypename: string;
  }

  // export interface ReqGetMeterStateList {}
  export interface ResGetMeterStateList {
    state: string;
    stateexplain: string;
  }
  export interface ReqGetMeterUseInfoList extends ReqPage {
    stationid: string;
  }

  export interface ResGetMeterUseInfoList
    extends ResPage<{
      stationid: string;
      metercode: string;
      meterdesc: string;
      channelid: string;
      metertype: string;
      meteraddr: string;
      useflag: string;
      meterorder: string;
    }> {}
  export interface ReqInsertMeterUseInfo {
    stationid: string;
    metercode: string;
    meterdesc: string;
    metertype: string;
    meteraddr: string;
    channelid: string;
    useflag: any;
  }
  export interface ResInsertMeterUseInfo {}
  export interface ReqUpdateMeterUseInfo {}
  export interface ResUpdateMeterUseInfo {}
  export interface ReqDeleteMeterUseInfo {
    metercode: string;
  }
  export interface ResDeleteMeterUseInfo {}
  export interface ReqUpdateMultiMeterStatus {
    metercode: "";
    useflag: any;
  }
  export interface ResUpdateMultiMeterStatus {}
  export interface ReqGetGatewayInfo {
    stationid: string;
  }
  export interface ResGetGatewayInfo {
    name: string;
    comdev: number;
    describe: string;
    devname1: string;
    useflag: number;
    stationid: string;
  }
  export interface ReqInsertGatewayInfo {
    stationid: string;
    describe: string;
    comdev: number;
    devname1: string;
    useflag: number;
    name: string;
  }
  export interface ResInsertGatewayInfo {}
  export interface ReqDeleteGatewayInfo {
    stationid: string;
    name: string;
  }
  export interface ResDeleteGatewayInfo {}
  export interface ReqUpdateGatewayInfo {}
  export interface ResUpdateGatewayInfo {}

  export interface ReqGetMeterListByStationId {
    stationid: string;
    search?: string;
  }

  export interface ResGetMeterListByStationId {
    metercode: string;
    meterdesc: string;
    stationid: string;
    metertype: any;
    metertypename: string;
  }

  export interface ResGetGatewayDev {
    comdev: number;
    devexplain: string;
  }

  export interface ReqRandomTransformerId {
    stationid: string;
  }
  export interface ResRandomTransformerId {
    transformerid: string;
  }

  export interface ReqRandomChannelId {
    stationid: string;
  }
  export interface ResRandomChannelId {
    name: string;
  }

  export interface ReqRandomMeterId {
    stationid: string;
  }
  export interface ResRandomMeterId {
    metercode: string;
  }
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
    stationid?: string;
    confirmstatus?: 0;
    starttime?: string;
    endtime?: string;
    messinfotype?: 2 | 3 | 4;
    alarmtype?: string;
    metersearch?: string;
    messinfolevel?: "1" | "2" | "3";
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

  export interface ReqGetSubstationStatus {
    stationid: string;
    starttime: string;
  }

  export interface ResGetSubstationStatus {
    SubStationStatus: {
      DayReport: {
        DisconnectNumber: number;
        OverLimitTimes: number;
        SwitchingTimes: number;
      };
      RunningStatus: {
        FPFQ: {
          stationid: string;
          fP: number;
          fQ: number;
          collecttime: string;
        };
        FTempFHumidity: {
          stationid: string;
          fTemp: number;
          fHumi: number;
          collecttime: string;
        };
      };
      substationstatus: {
        subMeterNums: number;
        substationinfo: {
          stationid: string;
          stationname: string;
          deptname: string;
          deptid: string;
          regionname: string;
          regionid: string;
          head: null;
          telephone: null;
          code: null;
          address: null;
          voltagestep: number;
          sxtsumP: string;
          sxtsumQ: string;
          transformernum: number;
          type: number;
          order: number;
          level: number;
          source: number;
          startno: number;
          changeflag: number;
          index: number;
          selected: number;
          editflag: number;
        };
      };
    };
    EHCAndES: {
      EnergyHourCurve: {
        resToday: {
          stationid: string;
          collecttime: string;
          value: number;
        }[];
        resYesterday: {
          stationid: string;
          collecttime: string;
          value: number;
        }[];
      };
      EnergyStatus: {
        MaxValueInfoOfOneDay: number;
        MaxValueTimes: string;
        TotalPValue: string;
        TodayTotalValue: {
          stationid: string;
          sumvalue: number;
        };
        YesterdayTotalValue: {
          stationid: string;
          sumvalue: number;
        };
        linkRelativeRatio: number;
      };
    };
    PlaceCheckformListParamMap: {
      formerPlacecheckform: "{}";
      latterPlacecheckform: "";
      list: {
        chargename: string;
        createtime: string;
        distance: string;
        placecheckformid: string;
        stationname: string;
        stationid: string;
        taskstartdate: string;
        taskfinishdate: string;
        taskid: string;
        tasknumber: string;
        taskstateid: string;
        problemtotal: string;
        unsolvedtotal: string;
        inspectionnum: number;
        passrate: number;
        taskresult: number;
        taskuserfinishnum: number;
        taskusernum: number;
        userlist: {
          createtime: string;
          distance: number;
          exesituation: number;
          explain: string;
          latitude: string;
          longitude: string;
          location: string;
          signintime: string;
          taskresultid: number;
          taskstateid: number;
          userid: number;
          username: string;
        }[];
      }[];
    };
  }

  export interface ReqGetMothJFPG {
    stationid: string;
  }

  export interface ResGetMothJFPG {
    Epijlist: {
      stationid: string;
      fEpij: number;
      collecttime: string;
    }[];
    Epiflist: {
      stationid: string;
      fEpif: number;
      collecttime: string;
    }[];
    Epiplist: {
      stationid: string;
      fEpip: number;
      collecttime: string;
    }[];
    Epiglist: {
      stationid: string;
      fEpig: number;
      collecttime: string;
    }[];
    JFPGSum: {
      fEpijsum: number;
      fEpifsum: number;
      fEpipsum: number;
      fEpigsum: number;
    };
  }

  export interface ReqGetNowAndLastEnergyTotalValue {
    stationid: string;
    starttime: string;
    scheme: "D" | "M" | "Y";
  }

  export interface ResGetNowAndLastEnergyTotalValue {
    NowTotalValue: {
      stationid: string;
      sumvalue: number;
    };
    LastTotalValue: {
      stationid: string;
      sumvalue: number;
    };
    linkRelativeRatio: number;
  }

  export interface ReqGetTransformerListByfSubid {
    stationid: string;
  }
  export interface ResGetTransformerListByfSubid
    extends ResPage<{
      transformername: string;
      metercode: string;
      voltagestep: number;
      maxdemand: number;
      maxtime: string;
    }> {}

  export interface ReqCommunicationStatusNew extends ReqPage {
    stationid: string;
  }

  export interface ResCommunicationStatusNew
    extends ResPage<{
      channelid: string;
      channelname: string;
      channelport: string;
      meterid: string;
      metername: string;
      laststoptime: string;
      lostContacttime: string;
      dayrundate: string;
      faultnums: number;
      totalrundate: string;
      isdisconnect: true;
    }> {}

  export interface ReqElectricityFeesNoHj {
    stationid: string;
    circuitids: string;
    scheme: "D" | "M" | "Y";
    starttime: string;
    endtime: string;
  }

  export interface ResElectricityFeesNoHj {
    EnergyReport: {
      circuitid: string;
      circuitname: string;
      data: number;
      isincoming: boolean;
      collecttime: string;
    }[][];
  }

  export interface ReqOverLimitEventNew extends ReqPage {
    stationid: string;
  }
  export interface ResOverLimitEventNew
    extends ResPage<{
      metercode: string;
      metername: string;
      paramcode: string;
      paramname: string;
      alarmtype: string;
      alarmdesc: string;
      limitvalue: string;
      value: string;
      starttime: string;
      endtime: string;
    }> {}

  export interface ReqEnergyLineLoss {
    stationid: string;
  }

  export interface ResEnergyLineLoss
    extends ResPage<{
      metercode: string;
      metername: string;
      paramcode: string;
      paramname: string;
      alarmdesc: string;
      starttime: string;
      value: string;
    }> {}
}
