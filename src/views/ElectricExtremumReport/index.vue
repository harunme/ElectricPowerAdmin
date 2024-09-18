<template>
  <div class="flex-column">
    <StationContext :disable-all="true" :on-change="onContextStationChange" />
    <div class="main-box">
      <CollapseBox>
        <CircuitInfoTree
          ref="circuitInfoTreeRef"
          :show-cascade="true"
          :show-all="true"
          :is-multiple="true"
          :on-change="onCircuitInfoTreeChange"
        />
      </CollapseBox>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="报表类型">
            <el-select v-model="formInline.scheme" style="width: 92px">
              <el-option label="日报" value="day" />
              <el-option label="月报" value="month" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="formInline.scheme !== 'custom'" label="日期">
            <el-date-picker
              v-if="formInline.scheme === 'day'"
              @change="changeStartTime"
              v-model="formInline.starttime"
              type="date"
            />
            <el-date-picker
              v-if="formInline.scheme === 'month'"
              @change="changeStartTime"
              v-model="formInline.starttime"
              type="month"
            />
          </el-form-item>
          <el-form-item v-else label="日期">
            <el-date-picker v-model="formInline.daterange" @change="changeDaterange" type="daterange" />
          </el-form-item>
          <el-form-item label="电力类别">
            <el-select v-model="formInline.param" style="width: 120px">
              <el-option label="功率" value="P" />
              <el-option label="电流" value="I" />
              <el-option label="相电压" value="U" />
              <el-option label="线电压" value="ABCU" />
              <el-option label="不平衡度" value="UnB" />
              <el-option label="电压谐波" value="UHR" />
              <el-option label="电流谐波" value="IHR" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group v-if="formInline.scheme === 'month'">
              <el-button @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一月
              </el-button>
              <el-button @click="clickNext">
                下一月<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
            <el-button-group v-if="formInline.scheme === 'day'">
              <el-button @click="clickPrev">
                <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一日
              </el-button>
              <el-button @click="clickNext">
                下一日<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onExport">导出</el-button>
          </el-form-item>
        </el-form>
        <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="columns" :fetch-data="fetchData">
          <template #collecttime="{ row }"> {{ moment(row.collecttime).format("YYYY-MM-DD") }} </template>
          <template #fIamaxtime="{ row }">{{ moment(row.fIamaxtime).format("HH:mm") }} </template>
          <template #fIbmaxtime="{ row }">{{ moment(row.fIbmaxtime).format("HH:mm") }} </template>
          <template #fIcmaxtime="{ row }">{{ moment(row.fIcmaxtime).format("HH:mm") }} </template>
          <template #fIamintime="{ row }">{{ moment(row.fIamintime).format("HH:mm") }} </template>
          <template #fIbmintime="{ row }">{{ moment(row.fIbmintime).format("HH:mm") }} </template>
          <template #fIcmintime="{ row }">{{ moment(row.fIcmintime).format("HH:mm") }} </template>
          <template #fIamaxvalue="{ row }">
            <span style="font-weight: 600; color: rgb(255 153 0)">{{ row.fIamaxvalue }}</span>
          </template>
          <template #fIaminvalue="{ row }">
            <span style="font-weight: 600; color: rgb(100 218 61)">{{ row.fIaminvalue }}</span>
          </template>
          <template #fIcmaxvalue="{ row }">
            <span style="font-weight: 600; color: rgb(255 153 0)">{{ row.fIcmaxvalue }}</span>
          </template>
          <template #fIcminvalue="{ row }">
            <span style="font-weight: 600; color: rgb(100 218 61)">{{ row.fIcminvalue }}</span>
          </template>
          <template #fIbmaxvalue="{ row }">
            <span style="font-weight: 600; color: rgb(255 153 0)">{{ row.fIbmaxvalue }}</span>
          </template>
          <template #fIbminvalue="{ row }">
            <span style="font-weight: 600; color: rgb(100 218 61)">{{ row.fIbminvalue }}</span>
          </template>
        </PaginationTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="ElectricExtremumReport">
import { ref, reactive } from "vue";
import moment from "moment";
import PaginationTable from "@/components/PaginationTable/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import StationContext from "@/components/StationContext/index.vue";
import { ElecMaxMinAvgValue } from "@/api/modules/main";
import columnsConfig from "./config";
import { ElMessage } from "element-plus";
import { getContextStationId } from "@/utils";
import CircuitInfoTree from "@/components/CircuitInfoTree/index.vue";
import { exportExcel } from "@/utils/exportExcel";

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);

const tableRef = ref<any>(null);
const columns = ref<any>([]);
const circuit = ref<any>(null);
const circuitInfoTreeRef = ref<any>(null);

const formInline = reactive<{
  param: "I" | "U" | "ABCU" | "P" | "UnB" | "UHR" | "IHR";
  scheme: "day" | "month" | "custom";
  starttime: string;
  daterange: any;
}>({
  param: "I",
  scheme: "day",
  starttime: moment().format("YYYY-MM-DD"),
  daterange: [start, end]
});

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const changeStartTime = value => {
  if (formInline.scheme === "day") formInline.starttime = moment(value).format("YYYY-MM-DD");
  if (formInline.scheme === "month") formInline.starttime = moment(value).format("YYYY-MM");
};

const changeDaterange = value => {
  console.log("changeDaterange", value);
};

const clickPrev = () => {
  if (formInline.scheme === "month") formInline.starttime = moment(formInline.starttime).subtract(1, "M").format("YYYY-MM");
  else formInline.starttime = moment(formInline.starttime).subtract(1, "d").format("YYYY-MM-DD");
};

const clickNext = () => {
  if (formInline.scheme === "month") formInline.starttime = moment(formInline.starttime).add(1, "M").format("YYYY-MM");
  else formInline.starttime = moment(formInline.starttime).add(1, "d").format("YYYY-MM-DD");
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const params: any = {
      stationid: getContextStationId(),
      circuitids: circuit.value,
      scheme: formInline.scheme,
      starttime: formInline.starttime,
      param: formInline.param === "ABCU" ? "U" : formInline.param
    };
    if (formInline.scheme === "custom") {
      params.starttime = moment(formInline.daterange[0]).format("YYYY-MM-DD");
      params.endtime = moment(formInline.daterange[1]).format("YYYY-MM-DD");
    } else {
      params.starttime = formInline.starttime;
    }
    const { data } = await ElecMaxMinAvgValue(params);
    columns.value = columnsConfig[formInline.param];
    const list = data?.StatisticValue || [];
    resolve({ list, total: 0 });
  });
};
const onExport = async () => {
  const params: any = {
    stationid: getContextStationId(),
    circuitids: circuit.value,
    scheme: formInline.scheme,
    starttime: formInline.starttime,
    param: formInline.param === "ABCU" ? "U" : formInline.param
  };
  if (formInline.scheme === "custom") {
    params.starttime = moment(formInline.daterange[0]).format("YYYY-MM-DD");
    params.endtime = moment(formInline.daterange[1]).format("YYYY-MM-DD");
  } else {
    params.starttime = formInline.starttime;
  }
  const { data } = await ElecMaxMinAvgValue(params);

  let textKeyMaps = [] as any;
  columns.value.forEach(({ children, label, prop, slotName }) => {
    if (children) {
      children.forEach(item => {
        if (item.children) {
          item.children.forEach(subitem => {
            textKeyMaps.push({ [`${label}.${item.label}.${subitem.label}`]: subitem.slotName || subitem.prop });
          });
        } else textKeyMaps.push({ [`${label}.${item.label}`]: item.slotName || item.prop });
      });
    } else textKeyMaps.push({ [label]: slotName || prop });
  });
  exportExcel({
    data: data?.StatisticValue || [],
    textKeyMaps,
    filename:
      formInline.scheme === "custom"
        ? `${params.starttime}-${params.endtime}_电力极值报表.xlsx`
        : `${params.starttime}_电力极值报表.xlsx`
  });
};

const onContextStationChange = () => {
  circuitInfoTreeRef?.value?.resetData();
};

const onCircuitInfoTreeChange = (circuitids: string[]) => {
  if (circuitids.length === 0) return ElMessage.info({ message: "请至少选择一个回路" });
  circuit.value = circuitids.join("-");
  onSubmit();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
