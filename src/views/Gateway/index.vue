<template>
  <div class="Meter">
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
            <span>{{ meterStateList.find(item => item.state === row.useflag)?.stateexplain }}</span>
          </template>
          <template #metertype="{ row }">
            <span>{{ meterTypeList.find(item => item.metertypecode === row.metertype)?.metertypename }}</span>
          </template>
          <template #channelname="{ row }">
            <span>{{ row.channelname ? `${row.channelname}(${row.channelid})` : "-" }}</span>
          </template>
          <template #actions="{ row }">
            <a class="mini-btn" @click="updateTransformer(row)">修改</a>
            <el-popconfirm title="确认删除?" @confirm="deleteMeter(row.metercode)">
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
        ref="meterFormRef"
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
            <el-form-item required label="通道编号" prop="metercode">
              <el-input v-model="form.metercode" placeholder="变配电站代码+2位序列号">
                <template #append>
                  <a class="mini-btn" @click="randomId">自动生成</a>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="通道名称" prop="meterdesc">
              <el-input v-model="form.meterdesc" placeholder="最大10个中英文字符" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="通道类型" prop="metertype">
              <el-select v-model="form.metertype" placeholder="请选择通道类型" style="width: 100%">
                <el-option
                  v-for="item in meterTypeList"
                  :key="item.metertypecode"
                  :label="item.metertypename"
                  :value="item.metertypecode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="通道地址" prop="meteraddr">
              <el-input v-model="form.meteraddr" placeholder="1-6位整数类型" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="通道状态" prop="useflag">
              <el-select v-model="form.useflag" placeholder="请选择通道状态" style="width: 100%">
                <el-option v-for="item in meterStateList" :key="item.state" :label="item.stateexplain" :value="item.state" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(meterFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="statusFormVisible" title="批量修改通道状态" width="500">
      <el-form
        ref="meterStatusFormRef"
        :model="statusForm"
        label-position="right"
        :rules="statusRules"
        label-width="auto"
        style="padding: 16px 32px"
        :validate-on-rule-change="false"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item required label="通道状态" prop="useflag">
              <el-select v-model="statusForm.useflag" placeholder="请选择通道状态" style="width: 100%">
                <el-option v-for="item in meterStateList" :key="item.state" :label="item.stateexplain" :value="item.state" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="statusFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitStatusForm(meterStatusFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="Meter">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
import { Meter } from "@/api/interface/index";
import {
  getGatewayInfo,
  getMeterStateList,
  getMeterTypeList,
  deleteMeterUseInfo,
  randomMeterId,
  insertMeterUseInfo,
  updateMeterUseInfo,
  updateMultiMeterStatus
} from "@/api/modules/meter";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";

const defaultForm = {
  meterdesc: "",
  metertype: "",
  meteraddr: "",
  channelid: "",
  useflag: "",
  metercode: ""
};

const meterStateList = ref<any>([]);
const meterTypeList = ref<any>([]);
const selectedRows = ref<any>([]);

const formVisible = ref(false);
const tableRef = ref<any>(null);

const isEdit = ref(false);
const meterFormRef = ref<FormInstance>();
const form = ref<any>(defaultForm);

const meterStatusFormRef = ref<FormInstance>();
const statusForm = ref<any>({
  useflag: ""
});
const statusFormVisible = ref(false);
const statusRules = reactive<any>({
  useflag: [{ required: true, message: "请选择状态" }]
});

const rules = reactive<FormRules<Meter.ReqInsertMeterUseInfo>>({
  meterdesc: [
    { required: true, message: "请输入通道名称" },
    { max: 10, message: "长度不超过 10 个字符" }
  ],
  metercode: [{ required: true, message: "请输入通道编号" }],
  metertype: [{ required: true, message: "请选择通道类型" }],
  meteraddr: [{ required: true, message: "请输入通道地址" }],
  channelid: [{ required: true, message: "请选择通道" }],
  useflag: [{ required: true, message: "请选择状态" }]
});

const addMeter = () => {
  formVisible.value = true;
  meterFormRef.value?.resetFields();
  setTimeout(() => meterFormRef.value?.clearValidate());
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
  const { data } = await randomMeterId({ stationid: "000" });
  form.value.metercode = data.metercode;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = form.value;
      if (isEdit.value) {
        const res = await updateMeterUseInfo({ ...params, stationid: "000" });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      } else {
        const res = await insertMeterUseInfo({ ...params, stationid: "000" });
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

const submitStatusForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("selectedRows.value", selectedRows.value);
      const res = await updateMultiMeterStatus({
        metercode: selectedRows.value.map(({ metercode }) => metercode).join(";"),
        useflag: statusForm.value.useflag
      });
      if (res.code === 1) {
        ElMessage.success({ message: res.msg });
        tableRef?.value?.resetData();
      } else {
        ElMessage.error({ message: res.msg });
      }
      statusFormVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};

const updateTransformer = async row => {
  isEdit.value = true;
  formVisible.value = true;
  form.value = { ...row };
  setTimeout(() => meterFormRef.value?.clearValidate());
};

const deleteMeter = async (metercode: string) => {
  const res = await deleteMeterUseInfo({ metercode });
  if (res.code === 1) {
    tableRef?.value?.resetData();
    ElMessage.success({ message: res.msg });
  } else {
    ElMessage.error({ message: res.msg });
  }
};

onMounted(async () => {
  const state = await getMeterStateList();
  meterStateList.value = state.data;

  const type = await getMeterTypeList();
  meterTypeList.value = type.data;
});

const handleSelectionChange = rows => {
  selectedRows.value = rows;
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
<!-- http://111.231.24.91/meter/getGatewayInfo -->
