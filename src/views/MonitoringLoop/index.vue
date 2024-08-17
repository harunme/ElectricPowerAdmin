<template>
  <div class="MonitoringLoop">
    <TransformerSelect />
    <div class="card content">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addCircuit">新增回路</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <PaginationTable ref="tableRef" :columns="columns" row-key="circuitid" :fetch-data="fetchData">
          <template #isincoming="{ row }">
            <span>{{ row.isincoming ? "是" : "否" }}</span>
          </template>
          <template #actions="{ row }">
            <a class="mini-btn" @click="updateCircuit(row)">修改</a>
            <el-popconfirm title="确认删除?" @confirm="deleteCircuit(row.circuitid)">
              <template #reference>
                <a class="mini-btn">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </PaginationTable>
      </div>
    </div>
    <el-dialog v-model="formVisible" :title="isEdit ? '修改回路' : '新增回路'" width="500">
      <el-form
        ref="circuitFormRef"
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
            <el-form-item required label="回路编号" prop="circuitid">
              <el-input v-model="form.circuitid" :disabled="isEdit" placeholder="变配电站代码+2位序列号">
                <template #append v-if="!isEdit">
                  <a class="mini-btn" @click="randomId">自动生成</a>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="回路名称" prop="circuitname">
              <el-input v-model="form.circuitname" placeholder="最大10个中英文字符" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="上级回路" prop="parentid">
              <el-cascader
                v-model="form.parentid"
                style="width: 100%"
                :options="circuitInfoTree"
                :props="{
                  checkStrictly: true,
                  value: 'circuitid',
                  label: 'circuitname',
                  emitPath: false
                }"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否进线" prop="isincoming">
              <el-switch v-model="form.isincoming" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="仪表编号" prop="meter">
              <el-input v-model="form.meter" placeholder="关联仪表编号，最多15位字符" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(circuitFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="MonitoringLoop">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
import { Sys } from "@/api/interface/index";
import { getCircuitInfoTree, randomCircuitId, insertCircuitInfo, deleteCircuitById, updateCircuitById } from "@/api/modules/sys";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";

const defaultForm = {
  stationid: "",
  circuitid: "",
  circuitname: "",
  parentid: undefined,
  isincoming: 0,
  meter: ""
};

const formVisible = ref(false);
const tableRef = ref<any>(null);
const circuitInfoTree = ref<any>([]);

const isEdit = ref(false);
const circuitFormRef = ref<FormInstance>();
const form = ref<any>(defaultForm);

const rules = reactive<FormRules<Sys.ReqInsertCircuitInfo>>({
  circuitid: [{ required: true, message: "请输入回路编号" }],
  circuitname: [
    { required: true, message: "请输入回路名称" },
    { max: 10, message: "长度不超过 10 个字符" }
  ],
  parentid: [{ required: true, message: "请选择上级回路" }],
  meter: [{ required: true, message: "请输入关联的仪表" }]
});

const addCircuit = () => {
  isEdit.value = false;
  formVisible.value = true;
  circuitFormRef.value?.resetFields();
  setTimeout(() => circuitFormRef.value?.clearValidate());
};

const columns: any = [
  { prop: "circuitname", label: "回路名称" },
  { prop: "circuitid", label: "回路编号" },
  { prop: "parentname", label: "上级回路" },
  { prop: "customDom", slotName: "isincoming", label: "是否进线" },
  { prop: "meter", label: "仪表编号" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await getCircuitInfoTree({
      stationid: "000"
    });
    circuitInfoTree.value = [{ circuitname: "无", circuitid: -1 } as any].concat(data);
    resolve({ list: data });
  });
};

const randomId = async () => {
  const { data } = await randomCircuitId({ stationid: "000" });
  form.value.circuitid = data.circuitid;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = { ...form.value };
      if (params.parentid === -1) params.parentid = 0;
      if (params.isincoming) params.isincoming = 1;
      else params.isincoming = 0;

      if (isEdit.value) {
        const res = await updateCircuitById({ ...params, stationid: "000" });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      } else {
        const res = await insertCircuitInfo({ ...params, stationid: "000" });
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

const updateCircuit = async row => {
  console.log(row);
  isEdit.value = true;
  formVisible.value = true;
  form.value = { ...row, isincoming: row.isincoming ? true : false, parentid: row.parentid === "0" ? -1 : row.parentid };
  setTimeout(() => circuitFormRef.value?.clearValidate());
};

const deleteCircuit = async (circuitid: string) => {
  const res = await deleteCircuitById({ circuitid, stationid: "000" });
  if (res.code === 1) {
    tableRef?.value?.resetData();
    ElMessage.success({ message: res.msg });
  } else {
    ElMessage.error({ message: res.msg });
  }
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
