<template>
  <div class="HarmonicData flex-column">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <CircuitInfoTree ref="circuitInfoTreeRef" :on-change="onCircuitInfoTreeChange" />
      </CollapseBox>
      <div class="card content-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="时间范围">
            <el-date-picker v-model="formInline.time" type="date" :size="size" style="width: 132px" />
          </el-form-item>
          <el-form-item label="谐波类型">
            <el-select v-model="formInline.energyKind" style="width: 132px">
              <el-option label="电流谐波" value="I" />
              <el-option label="电压谐波" value="U" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="formInline.phase">
              <el-checkbox-button v-for="(item, index) in Phases" :key="index" :label="item.key" :value="item.value" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="选择">
            <el-select v-model="formInline.thdtype" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="1" clearable>
              <el-option v-for="(item, index) in Thdtypes" :key="index" :label="item.key" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-tabs>
          <el-tab-pane label="图表" class="chart-box">
            <ECharts v-if="option !== null" :option="option" />
            <el-empty v-else description="暂无数据" />
          </el-tab-pane>
          <el-tab-pane label="数据" class="chart-box">
            <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="columns" :fetch-data="fetchData">
            </PaginationTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="HarmonicData">
import { ref, reactive } from "vue";
import moment from "moment";
import { ThreePhaseHarmonic } from "@/api/modules/main";
import StationContext from "@/components/StationContext/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import ECharts from "@/components/Charts/echarts.vue";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";
import { getContextStationId } from "@/utils";

const Thdtypes = [
  { key: "总谐波", value: "Thd" },
  { key: "2次谐波含量", value: "Hr02" },
  { key: "3次谐波含量", value: "Hr03" },
  { key: "4次谐波含量", value: "Hr04" },
  { key: "5次谐波含量", value: "Hr05" },
  { key: "6次谐波含量", value: "Hr06" },
  { key: "7次谐波含量", value: "Hr07" },
  { key: "8次谐波含量", value: "Hr08" },
  { key: "9次谐波含量", value: "Hr09" },
  { key: "10次谐波含量", value: "Hr10" },
  { key: "11次谐波含量", value: "Hr11" },
  { key: "12次谐波含量", value: "Hr12" },
  { key: "13次谐波含量", value: "Hr13" },
  { key: "14次谐波含量", value: "Hr14" },
  { key: "15次谐波含量", value: "Hr15" },
  { key: "16次谐波含量", value: "Hr16" },
  { key: "17次谐波含量", value: "Hr17" },
  { key: "18次谐波含量", value: "Hr18" },
  { key: "19次谐波含量", value: "Hr19" },
  { key: "20次谐波含量", value: "Hr20" },
  { key: "21次谐波含量", value: "Hr21" },
  { key: "22次谐波含量", value: "Hr22" },
  { key: "23次谐波含量", value: "Hr23" },
  { key: "24次谐波含量", value: "Hr24" },
  { key: "25次谐波含量", value: "Hr25" },
  { key: "26次谐波含量", value: "Hr26" },
  { key: "27次谐波含量", value: "Hr27" },
  { key: "28次谐波含量", value: "Hr28" },
  { key: "29次谐波含量", value: "Hr29" },
  { key: "30次谐波含量", value: "Hr30" },
  { key: "31次谐波含量", value: "Hr31" }
];

const Phases = [
  { key: "A相", value: "a" },
  { key: "B相", value: "b" },
  { key: "C相", value: "c" }
];
const EnergyKindMap = {
  I: "电流谐波",
  U: "电压谐波"
};

const size = ref<"default" | "large" | "small">("default");
const tableRef = ref<any>(null);
const circuit = ref<any>(null);
const circuitInfoTreeRef = ref<any>(null);
const columns = ref<any>([]);

const option = ref<any>(null);

const formInline = reactive({
  energyKind: "I" as "I" | "U",
  time: moment().format("YYYY-MM-DD"),
  thdtype: ["Thd"],
  phase: ["a", "b", "c"]
});

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    console.log("form", formInline);
    const { data } = await ThreePhaseHarmonic({
      stationid: getContextStationId(),
      circuitids: circuit.value,
      time: moment(formInline.time).format("YYYY-MM-DD"),
      energyKind: formInline.energyKind,
      thdtype: formInline.thdtype.join("-"),
      phase: formInline.phase.join(",")
    });
    if (!data?.threePhaseHarmonicData) {
      option.value = null;
      columns.value = [
        { prop: "circuitname", label: "回路名称" },
        { prop: "collecttime", label: "采集时间" }
      ];
      return resolve({ list: [] });
    } else {
      const legends = [] as string[];
      const series = [] as any;
      const _columns = [
        { prop: "circuitname", label: "回路名称" },
        { prop: "collecttime", label: "采集时间", width: 182 }
      ] as any;
      const list = data?.threePhaseHarmonicData.map(({ valueList, ...rest }, index) => {
        const data = { circuitname: valueList[0].circuitname, ...rest };

        formInline.phase.forEach(phase => {
          formInline.thdtype.forEach(type => {
            const name = `${Phases.find(i => i.value === phase)?.key} ${Thdtypes.find(i => i.value === type)?.key}`;
            const item = valueList.find(v => v.phase === phase.toUpperCase());
            data[name] = item ? item[type] : "-";
            if (index === 0) _columns.push({ prop: name, label: name, width: 132 });
          });
        });
        return data;
      });
      formInline.phase.forEach(phase => {
        formInline.thdtype.forEach(type => {
          const name = `${Phases.find(i => i.value === phase)?.key} ${Thdtypes.find(i => i.value === type)?.key}`;
          legends.push(name);
          series.push({
            name,
            type: "line",
            stack: "Total",
            data: data?.threePhaseHarmonicData.map(({ valueList }) => {
              const item = valueList.find(v => v.phase === phase.toUpperCase());
              if (item) return item[type];
              else return "-";
            })
          });
        });
      });
      columns.value = _columns;
      resolve({ list });
      option.value = {
        title: {
          text: `${moment(formInline.time).format("YYYY-MM-DD")} ${EnergyKindMap[formInline.energyKind]}`,
          left: "center",
          textStyle: {
            color: "rgb(31,125,195)",
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: legends,
          left: "center",
          top: "4%"
        },
        grid: {
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
          data: data?.threePhaseHarmonicData.map(({ collecttime }) => collecttime)
        },
        yAxis: {
          type: "value"
        },
        series: series
      };
    }
  });
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const onContextStationChange = async () => {
  circuitInfoTreeRef?.value?.resetData();
};

const onCircuitInfoTreeChange = (circuitids: string[]) => {
  circuit.value = circuitids[0];
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
