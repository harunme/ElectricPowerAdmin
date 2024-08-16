<template>
  <div class="Gateway">
    <TransformerSelect />
    <div class="card content">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addMeter">新增通道</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData" :selection-change="handleSelectionChange">
          <template #useflag="{ row }">
            <span>{{ gatewayStateList.find(item => item.state === row.useflag)?.stateexplain }}</span>
          </template>
          <template #comdev="{ row }">
            <span>{{ gatewayDev.find(item => item.comdev === row.comdev)?.devexplain }}</span>
          </template>
          <template #channelname="{ row }">
            <span>{{ row.channelname ? `${row.channelname}(${row.channelid})` : "-" }}</span>
          </template>
          <template #actions="{ row }">
            <a class="mini-btn" @click="updateTransformer(row)">修改</a>
            <el-popconfirm title="确认删除?" @confirm="deleteGateway(row.name)">
              <template #reference>
                <a class="mini-btn">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </PaginationTable>
      </div>
    </div>
    <el-dialog v-model="formVisible" :title="isEdit ? '修改通道' : '新增通道'" width="500">
      <el-form
        ref="gatewayFormRef"
        :model="form"
        label-position="right"
        :rules="rules"
        label-width="auto"
        style="padding: 16px 32px"
        :validate-on-rule-change="false"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="变配电站名称" prop="stationname">
              <span>TEST</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="通道编号" prop="name">
              <el-input v-model="form.name" :disabled="isEdit" placeholder="变配电站代码+2位序列号">
                <template #append v-if="!isEdit">
                  <a class="mini-btn" @click="randomId">自动生成</a>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="通道名称" prop="describe">
              <el-input v-model="form.describe" placeholder="最大10个中英文字符" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="通道性质" prop="comdev">
              <el-select v-model="form.comdev" placeholder="请选择通道性质" style="width: 100%">
                <el-option v-for="item in gatewayDev" :key="item.comdev" :label="item.devexplain" :value="item.comdev" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="通道地址" prop="devname1">
              <el-input v-model="form.devname1" placeholder="1-6位整数类型" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="通道状态" prop="useflag">
              <el-select v-model="form.useflag" placeholder="请选择通道状态" style="width: 100%">
                <el-option v-for="item in gatewayStateList" :key="item.state" :label="item.stateexplain" :value="item.state" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(gatewayFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="Gateway">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
import { Meter } from "@/api/interface/index";
import {
  getGatewayInfo,
  getMeterStateList,
  getGatewayDev,
  randomChannelId,
  insertGatewayInfo,
  deleteGatewayInfo,
  updateGatewayInfo
} from "@/api/modules/meter";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";

const defaultForm = {
  name: "",
  stationid: "",
  describe: "",
  comdev: "",
  channelid: "",
  devname1: "",
  useflag: ""
};

const gatewayStateList = ref<any>([]);
const gatewayDev = ref<any>([]);
const selectedRows = ref<any>([]);

const formVisible = ref(false);
const tableRef = ref<any>(null);

const isEdit = ref(false);
const gatewayFormRef = ref<FormInstance>();
const form = ref<any>(defaultForm);

const rules = reactive<FormRules<Meter.ReqInsertGatewayInfo>>({
  describe: [
    { required: true, message: "请输入通道名称" },
    { max: 10, message: "长度不超过 10 个字符" }
  ],
  name: [{ required: true, message: "请输入通道编号" }],
  comdev: [{ required: true, message: "请选择通道性质" }],
  devname1: [{ required: true, message: "请输入通道地址" }],
  useflag: [{ required: true, message: "请选择通道状态" }]
});

const addMeter = () => {
  isEdit.value = false;
  formVisible.value = true;
  gatewayFormRef.value?.resetFields();
  setTimeout(() => gatewayFormRef.value?.clearValidate());
};

const columns: any = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "name", label: "通道编号" },
  { prop: "describe", label: "通道名称" },
  { prop: "customDom", slotName: "comdev", label: "通道性质" },
  { prop: "devname1", label: "通道地址" },
  { prop: "customDom", slotName: "useflag", label: "使用状态" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await getGatewayInfo({
      stationid: "000"
    });
    resolve({ list: data });
  });
};

const randomId = async () => {
  const { data } = await randomChannelId({ stationid: "000" });
  form.value.name = data.name;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = form.value;
      if (isEdit.value) {
        const res = await updateGatewayInfo({ ...params, stationid: "000" });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      } else {
        const res = await insertGatewayInfo({ ...params, stationid: "000" });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const updateTransformer = async ({ stationname, ...row }) => {
  console.log(stationname);
  isEdit.value = true;
  formVisible.value = true;
  form.value = { ...row };
  setTimeout(() => gatewayFormRef.value?.clearValidate());
};

const deleteGateway = async (name: string) => {
  const res = await deleteGatewayInfo({ name, stationid: "000" });
  if (res.code === 1) {
    tableRef?.value?.resetData();
    ElMessage.success({ message: res.msg });
  } else {
    ElMessage.error({ message: res.msg });
  }
};

onMounted(async () => {
  const state = await getMeterStateList();
  gatewayStateList.value = state.data;

  const dev = await getGatewayDev();
  gatewayDev.value = dev.data;
});

const handleSelectionChange = rows => {
  selectedRows.value = rows;
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
<!-- http://111.231.24.91/meter/getGatewayInfo -->
