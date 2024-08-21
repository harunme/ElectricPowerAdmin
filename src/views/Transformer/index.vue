<template>
  <div class="Transformer">
    <TransformerSelect :disable-all="true" :on-change="onContextStationChange" />
    <div class="card content">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addTransformer">新增变压器</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <PaginationTable :fetch-on-mounted="false" ref="tableRef" :columns="columns" :fetch-data="fetchData">
          <template #actions="{ row }">
            <a class="mini-btn" @click="updateTransformer(row)">修改</a>
            <el-popconfirm title="确认删除?" @confirm="deleteTransformer(row.transformerid)">
              <template #reference>
                <a class="mini-btn">删除</a>
              </template>
            </el-popconfirm>
          </template>
          <template #type="{ row }">
            {{ row.type === "1" ? "干式变压器" : "油浸变压器" }}
          </template>
        </PaginationTable>
      </div>
    </div>
    <el-dialog v-model="formVisible" :title="isEdit ? '修改变压器' : '新增变压器'" width="500">
      <el-form
        ref="transformerFormRef"
        :model="form"
        label-position="right"
        :rules="rules"
        label-width="auto"
        style="padding: 16px 32px"
        :validate-on-rule-change="false"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="变配电站名称">
              <span>{{ getContextStationName() }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="变压器编号" prop="transformerid">
              <el-input v-model="form.transformerid" placeholder="变配电站代码+2位序列号">
                <template #append>
                  <a class="mini-btn" @click="randomId">自动生成</a>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="变压器名称" prop="transformername">
              <el-input v-model="form.transformername" placeholder="最大20个中英文字符" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item required label="变压器类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择变压器类型">
                <el-option label="干式变压器" value="1"></el-option>
                <el-option label="油浸变压器" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item required label="额定容量" prop="voltagestep">
              <el-input-number v-model="form.voltagestep" max="99999" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="额定电流" prop="current">
              <el-input-number v-model="form.current" max="99999" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item required label="关联仪表" prop="meter">
              <el-select v-model="form.meter" multiple placeholder="请选择关联仪表" style="width: 100%">
                <el-option v-for="item in meterList" :key="item.metercode" :label="item.metertypename" :value="item.metercode" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(transformerFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="Transformer">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import {
  getTransformerInfo,
  randomTransformerId,
  deleteTransformerInfoById,
  getMeterListByStationId,
  insertTransformerInfo,
  updateTransformerInfoById
} from "@/api/modules/meter";
import { Meter } from "@/api/interface/index";
import PaginationTable from "@/components/PaginationTable/index.vue";
import TransformerSelect from "@/components/TransformerSelect/index.vue";
import type { FormRules, FormInstance } from "element-plus";
import { getContextStationId, getContextStationName } from "@/utils";

const defaultForm = {
  transformerid: "",
  transformername: "",
  type: "1" as "1" | "2",
  voltagestep: 0,
  current: 0,
  meter: []
};

const formVisible = ref(false);
const tableRef = ref<any>(null);
const isEdit = ref(false);
const meterList = ref<Meter.ResGetMeterListByStationId[]>([]);
const transformerFormRef = ref<FormInstance>();
const form = ref<any>(defaultForm);

const columns: any = [
  { prop: "stationname", label: "变配电站名称" },
  { prop: "transformerid", label: "变压器编号" },
  { prop: "transformername", label: "变压器名称" },
  { prop: "customDom", slotName: "type", label: "变压器类型" },
  { prop: "voltagestep", label: "额定容量(kVA)" },
  { prop: "current", label: "额定电流(A)" },
  { prop: "meter", label: "关联仪表" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
];

const rules = reactive<FormRules<Meter.ReqInsertTransformerInfo>>({
  transformerid: [{ required: true, message: "请输入变压器编号" }],
  transformername: [
    { required: true, message: "请输入变压器名称" },
    { max: 20, message: "长度不超过 20 个字符" }
  ],
  meter: [{ required: true, message: "请选择关联仪表" }]
});

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    if (!getContextStationId()) {
      resolve({ list: [] });
    } else {
      const { data } = await getTransformerInfo({
        stationid: getContextStationId()
      });
      resolve({ list: data });
    }
  });
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { meter, ...params } = form.value;
      params.meter = meter.join(",");
      if (isEdit.value) {
        const res = await updateTransformerInfoById({ ...params, stationid: getContextStationId() });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      } else {
        const res = await insertTransformerInfo({ ...params, stationid: getContextStationId() });
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

const randomId = async () => {
  const { data } = await randomTransformerId({ stationid: getContextStationId() });
  form.value.transformerid = data.transformerid;
};

const addTransformer = () => {
  if (meterList.value.length === 0) return ElMessage.warning({ message: "当前站点无仪表，请先配置仪表" });
  formVisible.value = true;
  transformerFormRef.value?.resetFields();
  setTimeout(() => transformerFormRef.value?.clearValidate());
};

const updateTransformer = async row => {
  isEdit.value = true;
  formVisible.value = true;
  form.value = { ...row, meter: row.meter.split(",") };
  setTimeout(() => transformerFormRef.value?.clearValidate());
};

const deleteTransformer = async (transformerid: string) => {
  const res = await deleteTransformerInfoById({ transformerid });
  if (res.code === 1) {
    tableRef?.value?.resetData();
    ElMessage.success({ message: res.msg });
  } else {
    ElMessage.error({ message: res.msg });
  }
};

const onContextStationChange = async () => {
  const { data, msg } = await getMeterListByStationId({
    stationid: getContextStationId()
  });
  if (!data) {
    ElMessage.warning({ message: msg });
  }
  meterList.value = data || [];
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
