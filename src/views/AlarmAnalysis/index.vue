<template>
  <div class="AlarmAnalysis">
    <div class="top">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="item">
            <div class="icon">
              <span>日</span>
            </div>
            <div class="count">
              <span>今日报警数</span>
              <span>{{ topData.curdaynums }}</span>
            </div>
            <div class="count">
              <span>昨日报警数</span>
              <span>{{ topData.yesdaynums }}</span>
            </div>
            <div class="count">
              <span>环比</span>
              <span>{{ topData.dayMom }}%</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item">
            <div class="icon">
              <span>月</span>
            </div>
            <div class="count">
              <span>本月报警数</span>
              <span>{{ topData.curmonnums }}</span>
            </div>
            <div class="count">
              <span>上月报警数</span>
              <span>{{ topData.yesmonnums }}</span>
            </div>
            <div class="count">
              <span>环比</span>
              <span>{{ topData.monthMom }}%</span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item">
            <div class="icon">
              <span>年</span>
            </div>
            <div class="count">
              <span>今年报警数</span>
              <span>{{ topData.curyearnums }}</span>
            </div>
            <div class="count">
              <span>去年报警数</span>
              <span>{{ topData.yesyearnums }}</span>
            </div>
            <div class="count">
              <span>环比</span>
              <span>{{ topData.yearMom }}%</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <div>
        <el-tabs type="card" class="tabs">
          <el-tab-pane label="站点报警排名">
            <div class="table-box">
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="时间范围">
                  <el-date-picker
                    @change="onTimeChange"
                    v-model="formInline.range"
                    type="daterange"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                </el-form-item>
              </el-form>
              <PaginationTable ref="tableRef" :columns="alarmColumns" :fetch-data="GetSubstationAlarmLogNum">
                <template #fLogconfirmedrate="{ row }">
                  <el-progress :percentage="(row.fLogconfirmedrate * 100).toFixed(1)" />
                </template>
              </PaginationTable>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <div>
          <div class="today">{{ moment().format("YYYY-MM-DD") }}</div>
          <el-tabs type="card" class="tabs">
            <el-tab-pane label="站点报警排名列表">
              <div class="table-box">
                <PaginationTable :columns="typeColumns" :fetch-data="GetMessInfoTypeAlarmLogNum"> </PaginationTable>
              </div>
            </el-tab-pane>
            <el-tab-pane label="站点报警排名图表" lazy>
              <Pie :data="pieData" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div>
          <div class="header">
            <span>平台月报警统计</span>
            <el-date-picker @change="GetMonthAlarmLogNum" v-model="formInline.starttime" type="month" />
          </div>
          <div class="monthChart">
            <ECharts v-if="option !== null" :option="option" />
            <el-empty v-elst description="暂无数据" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="AlarmAnalysis">
import { ref, reactive, onMounted } from "vue";
import moment from "moment";
import { ReqPage } from "@/api/interface/index";
import PaginationTable from "@/components/PaginationTable/index.vue";
import {
  getDMYAlarmCompare,
  getSubstationAlarmLogNum,
  getMessInfoTypeAlarmLogNum,
  getMonthAlarmLogNum
} from "@/api/modules/main";
import Pie from "@/components/Charts/components/Pie.vue";
import ECharts from "@/components/Charts/echarts.vue";

const formInline = reactive({
  range: [moment().startOf("month").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
  starttime: moment().format("YYYY-MM")
});

const pieData = ref([]);
const tableRef = ref<any>(null);
const option = ref<any>(null);

const topData = ref({
  curdaynums: 0,
  curmonnums: 38,
  curyearnums: 152,
  dayMom: "0.0",
  monthMom: "0.00",
  yearMom: "0.0",
  yesdaynums: 0,
  yesmonnums: 114,
  yesyearnums: 0
});

const GetSubstationAlarmLogNum = async ({ pageSize, pageNum }: ReqPage): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await getSubstationAlarmLogNum({
      pageNum,
      pageSize,
      starttime: moment(formInline.range[0]).format("YYYY-MM-DD"),
      endtime: moment(formInline.range[1]).format("YYYY-MM-DD")
    });
    resolve({ list: data.list, total: data.total });
  });
};

const GetMessInfoTypeAlarmLogNum = async (): Promise<any> => {
  return new Promise(async resolve => {
    const colors = ["rgb(44,191,192)", "rgb(166,141,214)", "rgb(75,159,234)", "rgb(224,154,6)"];
    const { data } = await getMessInfoTypeAlarmLogNum();
    pieData.value = data.map(({ messinfotypeexplain, todaylognum }, index) => ({
      value: todaylognum,
      name: messinfotypeexplain,
      itemStyle: {
        color: colors[index]
      }
    }));
    resolve({ list: data });
  });
};

const GetDMYAlarmCompare = async () => {
  const { data } = await getDMYAlarmCompare();
  topData.value = data;
};

const GetMonthAlarmLogNum = async () => {
  const { data } = await getMonthAlarmLogNum({
    starttime: moment(formInline.starttime).format("YYYY-MM")
  });

  if (data === null) option.value = null;
  else
    option.value = {
      xAxis: {
        type: "category",
        data: data.map(({ fday }) => fday)
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: data.map(({ fdaynum }) => ({
            value: fdaynum,
            itemStyle: {
              color: "#1677ff"
            }
          })),
          type: "bar"
        }
      ]
    };
};

const onTimeChange = () => {
  tableRef?.value?.resetData();
};

const alarmColumns: any = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "customDom", slotName: "fLogconfirmedrate", label: "报警处理率" },
  { prop: "fLognum", label: "告警数目" }
];

const typeColumns: any = [
  { prop: "messinfotypeexplain", label: "报警类型" },
  { prop: "todaylognum", label: "告警数目" }
];

onMounted(() => {
  GetDMYAlarmCompare();
  GetMonthAlarmLogNum();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
