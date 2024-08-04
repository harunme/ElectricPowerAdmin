<template>
  <div class="EnergyData flex-column">
    <TransformerSelect />
    <div class="main-box">
      <div class="card left-box">
        <el-tree
          default-expand-all
          style="max-width: 600px"
          :data="tree"
          show-checkbox
          node-key="regionid"
          :default-checked-keys="[100]"
          :props="props"
        />
      </div>
      <div class="card content-box">
        <el-tabs v-model="activeTab" @tab-click="tabClick">
          <el-tab-pane label="日报" name="D"> </el-tab-pane>
          <el-tab-pane label="月报" name="M"> </el-tab-pane>
          <el-tab-pane label="年报" name="Y"> </el-tab-pane>
        </el-tabs>
        <div>
          <el-form :inline="true" class="table-form-inline">
            <el-form-item v-if="activeTab === 'D'" label="时间范围">
              <el-date-picker style="width: 120px; margin-right: 4px" v-model="lineForm.date" type="date" />
              <el-select v-model="lineForm.starttime" style="width: 70px; margin-right: 4px">
                <el-option v-for="item in [...Array(24).keys()]" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">时 -</span>
              <el-select v-model="lineForm.endtime" style="width: 70px; margin: 0 4px">
                <el-option v-for="item in [...Array(24).keys()]" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">时</span>
            </el-form-item>
            <el-form-item v-if="activeTab === 'D'">
              <el-button-group>
                <el-button @click="clickPrev">
                  <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一日
                </el-button>
                <el-button @click="clickNext">
                  下一日<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </el-button-group>
            </el-form-item>
            <el-form-item v-if="activeTab === 'M'" label="时间范围">
              <el-date-picker style="width: 120px; margin-right: 4px" v-model="lineForm.date" type="month" />
              <el-select v-model="lineForm.starttime" style="width: 70px; margin-right: 4px">
                <el-option v-for="item in moment(lineForm.date).daysInMonth()" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">日 -</span>
              <el-select v-model="lineForm.endtime" style="width: 70px; margin: 0 4px">
                <el-option v-for="item in moment(lineForm.date).daysInMonth()" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">日</span>
            </el-form-item>
            <el-form-item v-if="activeTab === 'M'">
              <el-button-group>
                <el-button @click="clickPrev">
                  <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一月
                </el-button>
                <el-button @click="clickNext">
                  下一月<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </el-button-group>
            </el-form-item>
            <el-form-item v-if="activeTab === 'Y'" label="时间范围">
              <el-date-picker style="width: 120px; margin-right: 4px" v-model="lineForm.date" type="year" />
              <el-select v-model="lineForm.starttime" style="width: 70px; margin-right: 4px">
                <el-option v-for="item in Array.from({ length: 12 }, (_, i) => i + 1)" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">月 -</span>
              <el-select v-model="lineForm.endtime" style="width: 70px; margin: 0 4px">
                <el-option v-for="item in Array.from({ length: 12 }, (_, i) => i + 1)" :key="item" :label="item" :value="item" />
              </el-select>
              <span style="color: var(--el-text-color-regular)">月</span>
            </el-form-item>
            <el-form-item v-if="activeTab === 'Y'">
              <el-button-group>
                <el-button @click="clickPrev">
                  <el-icon class="el-icon--left"><ArrowLeft /></el-icon>上一年
                </el-button>
                <el-button @click="clickNext">
                  下一年<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </el-button-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button type="primary">图表</el-button>
              <el-button type="primary">饼图</el-button>
              <el-button type="primary">导出</el-button>
              <div style="margin-left: 8px; color: var(--el-text-color-regular)">(*为进线回路)</div>
            </el-form-item>
          </el-form>
          <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData" :selection-change="handleSelectionChange">
          </PaginationTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="EnergyData">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import moment from "moment";
import { ElectricityFeesNoHj } from "@/api/modules/main";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";

const tree = ref([] as any);
const tableRef = ref<any>(null);
const activeTab = ref<"D" | "M" | "Y">("D");
const props = { children: "children", label: "circuitname" };

const lineForm = reactive({
  date: "2024-06-30",
  starttime: 0,
  endtime: 23
});

const columns = ref<any>([]);

const tabClick = tab => {
  if (tab.paneName === "D") {
    lineForm.date = moment().format("YYYY-MM-DD");
    lineForm.starttime = 0;
    lineForm.endtime = 23;
  }
  if (tab.paneName === "M") {
    lineForm.date = moment().format("YYYY-MM");
    lineForm.starttime = 1;
    lineForm.endtime = moment().daysInMonth();
  }
  if (tab.paneName === "Y") {
    lineForm.date = moment().format("YYYY");
    lineForm.starttime = 1;
    lineForm.endtime = moment().month() + 1;
  }
  activeTab.value = tab.paneName;
  tableRef?.value?.resetData();
};

const clickPrev = () => {
  if (activeTab.value === "D") lineForm.date = moment(lineForm.date).subtract(1, "d").format("YYYY-MM-DD");
  if (activeTab.value === "M") lineForm.date = moment(lineForm.date).subtract(1, "M").format("YYYY-MM");
  if (activeTab.value === "Y") lineForm.date = moment(lineForm.date).subtract(1, "y").format("YYYY");
};

const clickNext = () => {
  if (activeTab.value === "D") lineForm.date = moment(lineForm.date).add(1, "d").format("YYYY-MM-DD");
  if (activeTab.value === "M") lineForm.date = moment(lineForm.date).add(1, "M").format("YYYY-MM");
  if (activeTab.value === "Y") lineForm.date = moment(lineForm.date).add(1, "y").format("YYYY");
};

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    if (lineForm.starttime > lineForm.endtime) {
      return ElMessage.info({ message: "开始时间必须小于截止时间" });
    }
    let starttime, endtime;
    if (activeTab.value === "D") {
      starttime = `${lineForm.date} ${Number(lineForm.starttime) < 10 ? `0${lineForm.starttime}` : lineForm.starttime}:00:00`;
      endtime = `${lineForm.date} ${Number(lineForm.endtime) < 10 ? `0${lineForm.endtime}` : lineForm.endtime}:00:00`;
    }
    if (activeTab.value === "M" || activeTab.value === "Y") {
      starttime = `${lineForm.date}-${lineForm.starttime < 10 ? `0${lineForm.starttime}` : lineForm.starttime}`;
      endtime = `${lineForm.date}-${lineForm.endtime < 10 ? `0${lineForm.endtime}` : lineForm.endtime}`;
    }
    const { data } = await ElectricityFeesNoHj({
      stationid: "000",
      circuitids: "000",
      scheme: activeTab.value,
      starttime,
      endtime
    });
    let _columns: any = [];
    const list = data?.EnergyReport.map((row: any, index) => {
      let data: any = {};
      let total: number = 0;
      if (index === 0) {
        data.circuitname = row[0].circuitname;
        _columns.push({ prop: "circuitname", label: "回路名称 / kW·h", width: 160 });
        row.forEach(item => {
          _columns.push({
            prop: item.collecttime,
            label: item.collecttime
          });
          data[item.collecttime] = item.data;
          total += item.data;
        });
        _columns.push({ prop: "total", label: "合计" });
        data.total = total;
      }
      return data;
    });
    columns.value = _columns;
    resolve({ list });
  });
};

const handleSelectionChange = () => {
  console.log("handleSelectionChange1111111");
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
