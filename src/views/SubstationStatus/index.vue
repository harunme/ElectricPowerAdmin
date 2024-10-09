<template>
  <div class="SubstationStatus">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="dataVisualize-box">
      <el-row style="height: 38vh" :gutter="16">
        <el-col :span="8">
          <div class="box">
            <div class="title">概况</div>
            <div class="overview">
              <el-row>
                <el-col :span="8">
                  <div>
                    <div>
                      <img :src="overview1" />
                      <h5>电压等级</h5>
                    </div>

                    <p>{{ SubstationStatus.SubStationStatus.substationstatus.substationinfo.voltagelevel }}kV</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <div>
                      <img :src="overview2" />
                      <h5>变压器台数</h5>
                    </div>
                    <p>{{ SubstationStatus.SubStationStatus.substationstatus.substationinfo.transformernum }}台</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <div>
                      <img :src="overview3" />
                      <h5>负载率</h5>
                    </div>
                    <p>{{ SubstationStatus.SubStationStatus.substationstatus.loadfactor }}%</p>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <div>
                    <div>
                      <img :src="overview4" />
                      <h5>额定容量</h5>
                    </div>
                    <p>{{ SubstationStatus.SubStationStatus.substationstatus.substationinfo.installedcapacity }}kVA</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <div>
                      <img :src="overview5" />
                      <h5>最大需量</h5>
                    </div>
                    <p>{{ SubstationStatus.SubStationStatus.substationstatus.substationinfo.voltagestep }} kW</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div>
                    <div>
                      <img :src="overview6" />
                      <h5>测控装置</h5>
                    </div>
                    <p>{{ SubstationStatus.SubStationStatus.substationstatus.subMeterNums }} 个</p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="box">
            <div class="title">运行状态</div>
            <div class="run-status">
              <el-row class="top">
                <el-col :span="6">
                  <img
                    src="data:image/png;base64,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"
                  />
                  <h5>有功功率</h5>
                  <h4>
                    <span>{{ SubstationStatus.SubStationStatus.RunningStatus.FPFQ.fP }} </span>kW
                  </h4>
                </el-col>
                <el-col :span="6">
                  <img
                    src="data:image/png;base64,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"
                  />
                  <h5>无功功率</h5>
                  <h4>
                    <span> {{ SubstationStatus.SubStationStatus.RunningStatus.FPFQ.fQ }} </span>Kvar
                  </h4>
                </el-col>
                <el-col :span="6">
                  <img
                    src="data:image/png;base64,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"
                  />
                  <h5>环境温度</h5>
                  <h4>
                    <span> {{ SubstationStatus.SubStationStatus.RunningStatus.FTempFHumidity.fETemp }} </span>℃
                  </h4>
                </el-col>
                <el-col :span="6">
                  <img
                    src="data:image/png;base64,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"
                  />
                  <h5>环境湿度</h5>
                  <h4>
                    <span>{{ SubstationStatus.SubStationStatus.RunningStatus.FTempFHumidity.fEHumi }} </span>%
                  </h4>
                </el-col>
              </el-row>
              <el-row class="bottom">
                <el-col :span="6" @click="router.push('/DistributDiagram')">
                  <div class="after">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAdCAYAAAA3i0VNAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfdJREFUeNrsVz1LxEAQ3TsOtBAMNtqIARu7u067i92VZ2dn/AfptPM6LeM/uNbu/oF7YG8sBDuDWCiIRBALQeIsvMUh5C6bcyE5uIGXzcfs5mVmdmbSSNNUkLhA3SQhRC06dAiSsCrqKcdNWLCuBJUEDbjbB7Q4hDYz+Z3BYrPMaWOegH6S425fKJI58NI/kRN0bMyRbI43Sa8p5kAWJBck54FkSOhl7g2R9GtlyRN2vkM4yslhlZIMCGPCN67XVWkixAVrPRK+cP5gleWEBOoQnpBkLwwTeUL4IIxZQndsJnMnw13V801Ys5fznMuAcA1LqzLXJRwghiMbsaxJxtgcgnVFqpbugnA4ZY0zwiXmnRLeEb8djIEtd/sweUAYEWLmKr/IHdDVrvvBOLBVu/nFEMrnBDej2J8SXzoeP9kLnzGOCuKyNEk9Sb2wY9jFCLZJDjNdUB9rhba7oD6LT8cwYvYJHuElc3+EuAxt58kEza+Ll5j898gpz2KD/DpTMo9g0S6ScmXl0LTBWLLhrv9Kq6qfK8S87gdeUTQ8hFlUNUkHZPTGvAfZPRbHpUm6KH0meqY//D7LIG+ZlnBo6u4Vdr6F0ldGNgyIypw0l5SJyRvU4LVZKq3hR8nMpowQj8Yk1RdtY5EyeW6ZcEu4MtSXRVZU8ivAAFl68Cvx8AyXAAAAAElFTkSuQmCC"
                    />
                    <h5>配电图</h5>
                  </div>
                  <div class="before">
                    <h5>配电图</h5>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="after">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAkCAYAAAAQC8MVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmxJREFUeNq8WDtSwzAQVTKpIZwgKugJJ8CcgHCChBvkBugI6ShoVFJCx1CZGXp8A0xHR9LRGSmzhp0drT525J15E1veWE9PK2u1o6ZpBJg0qEWczQ22Cf4HsTH8aoMKSPhsASTfDT6ArDKYDsLWKFs0/1ZapRksGt62Bspg6vl/b4wTxrUh95/o+tjgNrfSsWRXBjO43hmcQ0jcDEo6Mgxq5GOne4X8V4A6d3jEkF2RzqdArAL/Bu6zk44hy6lawPNiKNIhspyqrkFlJx0iG1JVDEnaRzZF1UFI+8hyqs4TYy2V9DyV7IJRVfdYzbGk61SyCrVVKCwO8b2kpGl/7JrgdjCcTZ1BgqMhielrpUFhcAnvFLDb7ZCPTNnBpjD92GwIyExJiqs/2jerrFVwTdqWkBZqduTdbQ15BWfLfZ+B7yyOryaT0iFV/xb5OCG+XjMpjVW1cXtiMCLZ3GY/2wnJdw6lqarKsyGJVLItdGAxxJJWLlKODUn0IRuKsRjSVNW1T9U+ZH3hEEtaMbuWU9U+ZKkC2L4jSEui6ktI1VSyEkZqfd5IZxopXQSUr5j2hU/VFLLKM80/SIF5j3ChJruQXUe8WHWM8TsmVdRdTgp0xVYwXRZfISWYUGpTQ4kG0sS8izrXoFKLB/KMpoil49PTBTjMNpzfhGx9MyhSuOzZkSLa7fgCrvsUNBRKSzXnNEl44ZGj7ZAVFx1yGNmp9VQPTw3u0f05VBvbsmeJkpBrg8ecRcQRqs9yVsFpobUn+L0iRTopMlsMWaogtR2kkdVQxeSQsoUjnxXQNgjRWGUFOchJdPQZhGRrvwIMAI0e4ngCFyv/AAAAAElFTkSuQmCC"
                    />
                    <h5>视频</h5>
                  </div>
                  <div class="before">
                    <h5>视频</h5>
                  </div>
                </el-col>
                <el-col :span="6" @click="router.push('/TransformerMonitor')">
                  <div class="after">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAjCAYAAAANDvOtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgpJREFUeNrUWEFOwzAQNFVvIOEbHIvEveEFzQ/ID8gPyBPCD8oP0hcQfhB+EO5I9AgnUokjUljDWqxWjmPAJmakkWpnsx2v1/bGou974cgMKB1tc0c7iX6dNIhv/LlC6yC4QtvKQWiLtrlPsU3/hXTElsJmlxK7xofYHB29EMcqGrUhwms2KC1ibYhoTaLao/9mLMJjOWpDTWzLEdtyYJZMSH8iVrLRU3TAxNGW53mC75tQ/SYNJI6UCimAC4PtguWhjpLJNkE/dEDp2OL1FVlbtLhtbkkB624zE8NIgcuBZ4fAnLRz7BuyTZjfISxtz/c+wvsJCcyQEvuOgUfAA+Ac+16BO+AD83UK3CfvKnTAZ+CTwfYQ/Sq8oV9qq96tgRUXm2DnUsSHe4x2p8W2kQrVuFOClVg17TfkwYaGfkKodXBB2mdzlvwbtnCmRANcAFfYzvhusI1s+hvamIl/hHkgvzXZwtTiLWIVuwae4++dL6Eh0kDtLJdsRbcxipVsy7vGdIgyZ2tWHyRkNXvJW19iS7IfaqzIcVnGFtkrUlWt+Lkek1gauTaE0BC7ga6Bb30LDSG2xPoi8y3Ut9gUa4tghZBPsV3ois2n2FYERuxVl+RiO3aWy4iE0rTaqs8aVY0/ks7dX0ypAxJ2fJ+43lVNjYLfyBSWW5Wp0GmhivSSw+XGZNJvsHcBBgAMXBINXZ1c3AAAAABJRU5ErkJggg=="
                    />
                    <h5>变压器</h5>
                  </div>
                  <div class="before">
                    <h5>变压器</h5>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="after">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAgCAYAAABkWOo9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAa9JREFUeNrsWMttwzAMTQLfo956CFBvUG8QjeARPEI2iLuBR8gI3aDqBHU3cDZQgRx6U6WCBhSWsj520xTxAx7gRD9KJh8pL5VSiwRUwFQcgOEwhkayUtOgjFl3lXiaU6CI6bxa/BPMht6socsEeTJBIDTXI9Z91+Sa8jcN7Y0tHW176/nJ0aeJMXKMoYPSbM8/B9O1IvO058BU8Mj+rdN3HbmVaQp1eUjNmrLJZWir/hY/jKWi3kjPG9K8GCnZWs+vEeOMiz1Yv+/O1iVOc2ftTCSUgTZix9pvkvvKPPv0xIWDW8bIUzfr6ISGclR55/AfC8z/nJgvDwwkvM75fOCsBWjYkL5VIzT3MOIO1hn7+s5doBgzYqE6UBupjeaBY0UGR9zr1weksQz4Ce1rYEEoAUeae9LcQFCaV/kIbSVxRbZLxSOMuYc5TpYmbzPkFy3hZwKJ+BB2aCNmrhd4pvycobt+7SoZ5zLvputRiQoKMeKLBr4L5Z6MJ5F/c9+3p2uXp2db8Duf6A6IduNZqPEI/lCyMcmE4XqUunpIkC0fmMNN2sB6ljsKpG+X+RJgAMzm+tiKlkmzAAAAAElFTkSuQmCC"
                    />
                    <h5>通讯</h5>
                  </div>
                  <div class="before">
                    <h5>通讯</h5>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="8" clsss="records">
          <div class="event-record">
            <div class="box">
              <div class="title">当日事件记录</div>
              <div class="content">
                <el-row>
                  <el-col :span="8" @click="showTable('OverLimitEventNew')">
                    <div class="label">
                      <span>遥测越限</span>
                    </div>
                    <div class="count">
                      <h4>{{ SubstationStatus.SubStationStatus.DayReport.OverLimitTimes }}次</h4>
                    </div>
                  </el-col>
                  <el-col :span="8" @click="showTable('EnergyLineLoss')">
                    <div class="label">
                      <span>遥信变位</span>
                    </div>
                    <div class="count">
                      <h4>{{ SubstationStatus.SubStationStatus.DayReport.SwitchingTimes }}次</h4>
                    </div>
                  </el-col>
                  <el-col :span="8" @click="showTable('CommunicationStatusNew')">
                    <div class="label">
                      <span>失联装置</span>
                    </div>
                    <div class="count">
                      <h4>{{ SubstationStatus.SubStationStatus.DayReport.DisconnectNumber }}次</h4>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="inspection-record">
            <div class="box">
              <div class="title">近期巡检记录</div>
              <div class="content">
                <div class="left">
                  <p>
                    <span>巡检时间：</span>
                    <span>
                      {{ SubstationStatus.PlaceCheckformListParamMap.list[0]?.taskstartdate }}
                      -
                      {{ SubstationStatus.PlaceCheckformListParamMap.list[0]?.taskfinishdate }}
                    </span>
                  </p>
                  <p>
                    <span>巡检项数：</span>
                    <span> {{ SubstationStatus.PlaceCheckformListParamMap.list[0]?.inspectionnum }}项</span>
                  </p>
                  <p>
                    <span>缺陷项：</span>
                    <span> {{ SubstationStatus.PlaceCheckformListParamMap.list[0]?.problemtotal }}项</span>
                  </p>
                  <p>
                    <span>巡检人员：</span>
                    <span> {{ SubstationStatus.PlaceCheckformListParamMap.list[0]?.chargename }}</span>
                  </p>
                </div>
                <div class="right">
                  <div class="passrate">
                    <span> {{ SubstationStatus.PlaceCheckformListParamMap.list[0]?.passrate * 100 }}%</span>
                    <h5>合格率</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row style="height: calc(62vh - 152px)" :gutter="16">
        <el-col :span="16">
          <div class="box">
            <div class="title">
              <span>当日逐时用电曲线</span>
              <el-radio-group v-model="type" @input="changeType">
                <el-radio-button label="分时段" value="month"></el-radio-button>
                <el-radio-button label="总用电" value="day"></el-radio-button>
              </el-radio-group>
            </div>
            <div class="chart-box" v-if="type === 'month'">
              <template v-if="option !== null">
                <div class="line">
                  <ECharts v-if="option !== null" :option="option" />
                </div>
                <div class="pie">
                  <ECharts v-if="pieOption !== null" :option="pieOption" />
                </div>
              </template>
              <el-empty v-else description="暂无数据" />
            </div>
            <div class="chart-box" v-else>
              <div class="line" style="display: flex; align-items: center; width: 100%">
                <ECharts v-if="totalOption !== null" :option="totalOption" />
                <el-empty v-else description="暂无数据" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="box">
            <div class="title">
              <span>用电概况</span>
              <el-radio-group v-model="scheme" @input="changeScheme">
                <el-radio-button label="D">日</el-radio-button>
                <el-radio-button label="M">月</el-radio-button>
                <el-radio-button label="Y">年</el-radio-button>
              </el-radio-group>
            </div>
            <div class="power-overview">
              <div class="energy">
                <div>
                  <span>{{ TimeMap[scheme][0] }}用电</span>
                </div>
                <div>
                  <span>{{ NowAndLastEnergyTotalValue.NowTotalValue.sumvalue }} kW·h</span>
                </div>
              </div>
              <div class="energy">
                <div>
                  <span>{{ TimeMap[scheme][1] }}同期</span>
                </div>
                <div>
                  <span>{{ NowAndLastEnergyTotalValue.LastTotalValue.sumvalue }} kW·h</span>
                </div>
              </div>
              <div class="energy">
                <div>
                  <span>环比</span>
                </div>
                <div>
                  <span>{{ NowAndLastEnergyTotalValue.linkRelativeRatio }}%</span>
                </div>
              </div>
              <div class="energytime">
                <div>
                  <p class="top">{{ SubstationStatus.EHCAndES.EnergyStatus.MaxValueTimes }}</p>
                  <p class="last">最大用电时间</p>
                </div>
                <div>
                  <p class="top">{{ SubstationStatus.EHCAndES.EnergyStatus.MaxValueInfoOfOneDay }}kW</p>
                  <p class="last">该时段平均功率</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="dialogVisible" :title="title" width="800">
      <div class="chart-box" style="height: 600px; padding: 0 32px 32px 18px">
        <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData"> </PaginationTable>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="SubstationStatus">
import { onMounted, ref, onUnmounted } from "vue";
import { getContextStationId } from "@/utils";
import { ECOption } from "@/components/Charts/config";
import ECharts from "@/components/Charts/echarts.vue";
import moment from "moment";
import StationContext from "@/components/StationContext/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import {
  CommunicationStatusNew,
  OverLimitEventNew,
  getMothJFPG,
  EnergyLineLoss,
  getNowAndLastEnergyTotalValue
} from "@/api/modules/main";
import overview1 from "./images/overview-1.png";
import overview2 from "./images/overview-2.png";
import overview3 from "./images/overview-3.png";
import overview4 from "./images/overview-4.png";
import overview5 from "./images/overview-5.png";
import overview6 from "./images/overview-6.png";
import { useRouter } from "vue-router";

import { getSubstationStatus } from "@/api/modules/main";

const TimeMap = {
  D: ["当日", "昨日"],
  M: ["当月", "上月"],
  Y: ["今年", "去年"]
};

const router = useRouter();

const dialogVisible = ref<boolean>(false);
const option = ref<ECOption | null>(null);
const totalOption = ref<ECOption | null>(null);
const pieOption = ref<ECOption | null>(null);
const title = ref<string>("");
const tableRef = ref<any>(null);
const columns = ref<any>([]);
const scheme = ref<"D" | "M" | "Y">("D");
const type = ref<"month" | "day">("month");
const url = ref<"CommunicationStatusNew" | "OverLimitEventNew" | "EnergyLineLoss">("CommunicationStatusNew");
const GetSubstationStatusInterval = ref<any>(null);
// const pieData = ref<any>([]);

const NowAndLastEnergyTotalValue = ref<any>({
  NowTotalValue: {
    sumvalue: 0
  },
  LastTotalValue: {
    sumvalue: 0
  },
  linkRelativeRatio: 0
});
const SubstationStatus = ref({
  SubStationStatus: {
    DayReport: {
      DisconnectNumber: 3,
      OverLimitTimes: 3,
      SwitchingTimes: 0
    },
    RunningStatus: {
      FPFQ: {
        fP: 0,
        fQ: 0
      },
      FTempFHumidity: {
        fTemp: 0.0,
        fHumi: 0.0
      }
    },
    substationstatus: {
      subMeterNums: 0,
      substationinfo: {
        voltagestep: 0,
        installedcapacity: 0,
        transformernum: 0,
        voltagelevel: 0,
        voltageoftrans: 0.0,
        loadfactor: 0
      }
    }
  },
  EHCAndES: {
    EnergyStatus: {
      MaxValueTimes: "-",
      MaxValueInfoOfOneDay: "-"
    },
    EnergyHourCurve: {
      resToday: [
        {
          stationid: "000",
          collecttime: "2024-08-05 00:00:00",
          value: 250.0
        }
      ],
      resYesterday: [
        {
          stationid: "000",
          collecttime: "2024-08-04 00:00:00",
          value: 200.0
        }
      ]
    }
  },
  PlaceCheckformListParamMap: {
    list: [] as any[]
  }
});

onMounted(() => {
  if (getContextStationId()) {
    GetSubstationStatusInterval.value = window.setInterval(
      () => {
        GetSubstationStatus();
        GetMothJFPG();
      },
      1000 * 60 * 3
    );
    GetNowAndLastEnergyTotalValue();
  }
});

onUnmounted(() => {
  if (GetSubstationStatusInterval.value) window.clearInterval(GetSubstationStatusInterval.value);
});

const onContextStationChange = () => {
  GetSubstationStatus();
  GetNowAndLastEnergyTotalValue();
  GetMothJFPG();
};

const fetchData = async ({ pageSize, pageNum }): Promise<any> => {
  return new Promise(async resolve => {
    const params = {
      stationid: getContextStationId(),
      pageNum,
      pageSize
    };
    let res;
    if (url.value === "CommunicationStatusNew") res = await CommunicationStatusNew(params);
    if (url.value === "OverLimitEventNew") res = await OverLimitEventNew(params);
    if (url.value === "EnergyLineLoss") res = await EnergyLineLoss(params);
    console.log("res", res);
    resolve({ list: res?.data?.list, total: res?.data?.total });
  });
};

const showTable = (type: "CommunicationStatusNew" | "OverLimitEventNew" | "EnergyLineLoss") => {
  if (type === "OverLimitEventNew") {
    columns.value = [
      { prop: "starttime", label: "开始时间" },
      { prop: "endtime", label: "结束时间" },
      { prop: "alarmtype", label: "类型" },
      { prop: "metername", label: "仪表名称" },
      { prop: "paramname", label: "参数名称", width: 80 },
      { prop: "value", label: "报警值", width: 80 }
    ];
    title.value = "遥测越限";
  }
  if (type === "CommunicationStatusNew") {
    columns.value = [
      { prop: "channelname", label: "网关" },
      { prop: "channelport", label: "串口号" },
      { prop: "metername", label: "仪表名称" },
      { prop: "laststoptime", label: "离线时间", width: 180 },
      { prop: "lostContacttime", label: "累计中断时间", width: 120 }
    ];
    title.value = "失联装置";
  }
  if (type === "EnergyLineLoss") {
    columns.value = [
      { prop: "starttime", label: "时间" },
      { prop: "metername", label: "仪表名称" },
      { prop: "metercode", label: "仪表编号" },
      { prop: "paramname", label: "参数名称" },
      { prop: "value", label: "报警值", width: 80 }
    ];
    title.value = "遥信变位";
  }
  url.value = type;
  dialogVisible.value = true;
  tableRef?.value?.resetData();
};

const GetSubstationStatus = async () => {
  const { data }: any = await getSubstationStatus({
    stationid: getContextStationId(),
    starttime: moment().format("YYYY-MM-DD HH:mm:ss")
  });
  SubstationStatus.value = data;
};

const GetNowAndLastEnergyTotalValue = async (scheme: "D" | "M" | "Y" = "D") => {
  const { data }: any = await getNowAndLastEnergyTotalValue({
    stationid: getContextStationId(),
    starttime: moment().format("YYYY-MM-DD HH:mm:ss"),
    scheme
  });
  NowAndLastEnergyTotalValue.value = data;
};

const GetMothJFPG = async () => {
  const { data }: any = await getMothJFPG({
    stationid: getContextStationId()
  });

  let legend = [] as any;
  let xAxisData = [] as any;
  let series = [] as any;

  if (type.value === "month") {
    const NameMap = {
      fEpijsum: "尖总电量",
      fEpifsum: "峰总电量",
      fEpipsum: "平总电量",
      fEpigsum: "谷总电量"
    };
    let total = 0;
    const pieData = data
      ? Object.keys(data?.JFPGSum).map(key => {
          total += data?.JFPGSum[key];
          return {
            value: data?.JFPGSum[key],
            name: NameMap[key]
          };
        })
      : [];

    pieOption.value = {
      title: {
        text: "当月占比环形图",
        subtext: `合计: ${total}`,
        textStyle: {
          color: "#999",
          fontWeight: "normal",
          fontSize: 14
        }
      },
      tooltip: {
        trigger: "item"
      },
      legend: {
        bottom: "0%",
        left: "20%",
        align: "left",
        textStyle: {
          fontSize: 12,
          color: "#a1a1a1",
          fontWeight: 400
        }
      },
      series: [
        {
          type: "pie",
          radius: "50%",
          silent: true,
          clockwise: true,
          data: pieData,
          labelLine: {
            show: false
          },

          label: {
            show: false
          }
        }
      ]
    };
    series = [
      {
        name: "正向有功尖电量",
        type: "line",
        smooth: 0.6,
        stack: "Total",
        data: data ? (data.Epijlist || []).map(({ fEpij }) => Number(fEpij)) : []
      },
      {
        name: "正向有功峰电量",
        type: "line",
        smooth: 0.6,
        stack: "Total",
        data: data ? (data.Epiflist || []).map(({ fEpif }) => Number(fEpif)) : []
      },
      {
        name: "正向有功平电量",
        type: "line",
        smooth: 0.6,
        stack: "Total",
        data: data ? (data.Epiplist || []).map(({ fEpip }) => Number(fEpip)) : []
      },
      {
        name: "正向有功谷电量",
        type: "line",
        smooth: 0.6,
        stack: "Total",
        data: data ? (data.Epiglist || []).map(({ fEpig }) => Number(fEpig)) : []
      }
    ];
    xAxisData = data
      ? (data.Epijlist || data.Epiglist || data.Epiplist || data.Epiflist).map(({ collecttime }) =>
          moment(collecttime).format("MM-DD")
        )
      : [];
    legend = ["正向有功尖电量", "正向有功峰电量", "正向有功平电量", "正向有功谷电量"];
    option.value = {
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: legend
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },

      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xAxisData
      },
      yAxis: {
        type: "value"
      },
      series
    };
  }
  if (type.value === "day") {
    series = [
      {
        name: "今日",
        smooth: 0.6,
        type: "line",
        stack: "Total",
        data: SubstationStatus.value.EHCAndES.EnergyHourCurve.resToday.map(({ value }) => Number(value))
      },
      {
        name: "昨日",
        smooth: 0.6,
        type: "line",
        stack: "Total",
        data: SubstationStatus.value.EHCAndES.EnergyHourCurve.resYesterday.map(({ value }) => Number(value))
      }
    ];
    xAxisData = SubstationStatus.value.EHCAndES.EnergyHourCurve.resToday.map(({ collecttime }) => collecttime);
    legend = ["昨日", "今日"];
    totalOption.value = {
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: legend
      },
      grid: {
        top: "8%",
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: "none"
          },
          dataView: { readOnly: false },
          magicType: { type: ["line", "bar"] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xAxisData
      },
      yAxis: {
        type: "value"
      },
      series
    };
  }
};

const changeScheme = e => {
  GetNowAndLastEnergyTotalValue(e.target.value);
  GetSubstationStatus();
};
const changeType = () => {
  // type.value = e.target.value;

  GetMothJFPG();
};
// changeType
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
