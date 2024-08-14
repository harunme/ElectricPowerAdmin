<template>
  <div class="flex-column Substation">
    <div class="main-box">
      <CollapseBox />
      <div class="card table-box flex-column">
        <div class="action-box">
          <el-form :inline="true" :model="formInline" class="table-form-inline">
            <el-form-item label="关键字">
              <el-input v-model="formInline.search" placeholder="请输入站点名称或编号" clearable>
                <template #append>
                  <el-button :icon="Search" @click="onSearch" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="priceSetVisible = true">电价设置</el-button>
              <!-- <el-button @click="onSubmit">巡检配置</el-button>
              <el-button @click="onSubmit">现场图片</el-button>
              <el-button @click="onSubmit">读取工程</el-button> -->
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="newSubstation">新增变配电站</el-button>
        </div>
        <PaginationTable ref="tableRef" :columns="columns" :fetch-data="fetchData">
          <template #voltagelevel="{ row }">
            <span>{{ row.voltagelevel }}kV</span>
          </template>
          <template #voltageoftrans="{ row }">
            <span>{{ row.voltageoftrans }}kV</span>
          </template>
          <template #actions="{ row }">
            <a class="mini-btn" @click="updateSubstation(row)">修改</a>
            <el-popconfirm title="确认删除?" @confirm="deleteSubstation(row.stationid)">
              <template #reference>
                <a class="mini-btn">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </PaginationTable>
      </div>
    </div>
    <el-dialog v-model="formVisible" :title="isEdit ? '修改变配电站' : '新增变配电站'" width="1000">
      <el-form
        ref="substationFormRef"
        :model="form"
        label-position="right"
        :rules="rules"
        label-width="auto"
        style="padding: 16px 32px"
        :validate-on-rule-change="false"
      >
        <span class="form-title">变配电站信息</span>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item required label="变配电站名称" prop="stationname">
              <el-input v-model="form.stationname" placeholder="1~20位中英文字符" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="组织机构" prop="deptid">
              <el-cascader
                v-model="form.deptid"
                style="width: 100%"
                :options="deptTree"
                :props="{ checkStrictly: true, value: 'deptid', label: 'deptname', emitPath: false }"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="区域" prop="regionid">
              <el-cascader
                v-model="form.regionid"
                style="width: 100%"
                :options="regionTree"
                :props="{ checkStrictly: true, value: 'regionid', label: 'regionname', emitPath: false }"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="供电电压等级" prop="voltagelevel">
              <el-select v-model="form.voltagelevel" placeholder="请输入供电电压等级">
                <el-option label="0.4kV" value="0.4"></el-option>
                <el-option label="10kV" value="10"></el-option>
                <el-option label="20kV" value="20"></el-option>
                <el-option label="35kV" value="35"></el-option>
                <el-option label="110kV" value="110"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="变电电压等级" prop="voltageoftrans">
              <el-select v-model="form.voltageoftrans" placeholder="请输入变电电压等级">
                <el-option label="10/0.4" value="10/0.4"></el-option>
                <el-option label="20/0.4" value="20/0.4"></el-option>
                <el-option label="35/0.4" value="35/0.4"></el-option>
                <el-option label="0.4" value="0.4"></el-option>
                <el-option label="6/0.4" value="6/0.4"></el-option>
                <el-option label="6(10)/0.4" value="6(10)/0.4"></el-option>
                <el-option label="10(6)/0.4" value="10(6)/0.4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="地址" prop="address">
              <el-input v-model="form.address" placeholder="最大30个中英文字符" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="额定容量" prop="installedcapacity">
              <el-input-number v-model="form.installedcapacity" max="999999" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="最大需量" prop="voltagestep">
              <el-input-number v-model="form.voltagestep" max="999999" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="变压器数量" prop="transformernum">
              <el-input-number v-model="form.transformernum" max="999999" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值班电话" prop="telephone">
              <el-input v-model="form.telephone" placeholder="请输入值班电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="head">
              <el-input v-model="form.head" placeholder="请输入负责人名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人手机号" prop="headphone">
              <el-input v-model="form.headphone" placeholder="请输入负责人手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <span class="form-title">电度电价设置</span>
        <el-row>
          <el-col :span="8">
            <el-form-item label="尖时段电价" prop="epijprice">
              <el-input-number v-model="form.epijprice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="峰时段电价" prop="epifprice">
              <el-input-number v-model="form.epifprice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="平时段电价" prop="epipprice">
              <el-input-number v-model="form.epipprice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="谷时段电价" prop="epigprice">
              <el-input-number v-model="form.epigprice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="深时段电价" prop="epi5price">
              <el-input-number v-model="form.epi5price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单一电价" prop="episingleprice">
              <el-input-number v-model="form.episingleprice" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(substationFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="priceSetVisible" title="电价设置" width="640">
      <el-form ref="substationFormRef" label-position="right" label-width="auto" style="padding: 16px 32px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="尖时段电价" prop="epijprice">
              <el-input-number style="width: 100%" v-model="form.epijprice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="峰时段电价" prop="epifprice">
              <el-input-number style="width: 100%" v-model="form.epifprice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平时段电价" prop="epipprice">
              <el-input-number style="width: 100%" v-model="form.epipprice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="谷时段电价" prop="epigprice">
              <el-input-number style="width: 100%" v-model="form.epigprice" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="深时段电价" prop="epi5price">
              <el-input-number style="width: 100%" v-model="form.epi5price" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单一电价" prop="episingleprice">
              <el-input-number style="width: 100%" v-model="form.episingleprice" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="Substation">
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import {
  getSubstationPageInfo,
  insertSubstationInfo,
  deleteSubstationInfoById,
  updateSubstationInfoById
} from "@/api/modules/meter";
import { Meter } from "@/api/interface/index";
import { getCompanyTree, getSubGroupTree } from "@/api/modules/org";
import PaginationTable from "@/components/PaginationTable/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import type { FormRules, FormInstance } from "element-plus";
// import { number } from "echarts";

const defaultForm = {
  stationname: "",
  deptid: undefined,
  regionid: undefined,
  installedcapacity: 0,
  voltagestep: 0,
  head: "",
  telephone: "",
  headphone: "",
  voltagelevel: "",
  voltageoftrans: "",
  address: "",
  transformernum: 0,
  epifprice: 0,
  epipprice: 0,
  epigprice: 0,
  epi5price: 0,
  episingleprice: 0,
  epijprice: 0
};
const formVisible = ref(false);
const priceSetVisible = ref(false);
const isEdit = ref(false);
const formInline = reactive({
  search: ""
});
const substationFormRef = ref<FormInstance>();
const tableRef = ref<any>(null);
// 组织机构树
const deptTree = ref([] as any);
// 区域树
const regionTree = ref([] as any);

const form = ref<Meter.ReqInsertSubstationInfo>(defaultForm);

const rules = reactive<FormRules<Meter.ReqInsertSubstationInfo>>({
  stationname: [
    { required: true, message: "请输入变配电站名称" },
    { max: 20, message: "长度不超过 20 个字符" }
  ],
  deptid: [{ required: true, message: "请选择组织机构" }],
  regionid: [{ required: true, message: "请选择区域" }],
  voltagelevel: [
    { required: true, message: "请输入供电电压等级" },
    { max: 20, message: "长度不超过 20 个字符" }
  ],
  voltageoftrans: [
    { required: true, message: "请输入变电电压等级" },
    { max: 20, message: "长度不超过 20 个字符" }
  ],
  address: [
    { required: true, message: "请输入地址" },
    { max: 30, message: "长度不超过 30 个字符" }
  ],
  installedcapacity: [{ required: true, message: "请输入变压器容量" }],
  voltagestep: [{ required: true, message: "请输入最大需量" }],
  transformernum: [{ required: true, message: "请输入变压器数量" }],
  telephone: [{ max: 11, message: "长度不超过 11 个字符" }],
  head: [{ max: 30, message: "长度不超过 30 个字符" }],
  headphone: [{ max: 11, message: "长度不超过 11 个字符" }]
});

const columns = [
  { prop: "stationid", label: "变配电站编号" },
  { prop: "stationname", label: "变配电站名称" },
  { prop: "deptname", label: "组织机构" },
  { prop: "regionname", label: "区域" },
  { prop: "customDom", slotName: "voltagelevel", label: "供电电压等级" },
  { prop: "customDom", slotName: "voltageoftrans", label: "变电电压等级" },
  { prop: "address", label: "地址" },
  { prop: "installedcapacity", label: "变压器容量" },
  { prop: "voltagestep", label: "最大需量" },
  { prop: "transformernum", label: "变压器数量" },
  { prop: "head", label: "负责人" },
  { prop: "telephone", label: "负责人手机号" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
];

const fetchData = async ({ pageNum, pageSize }): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await getSubstationPageInfo({
      pageNum,
      pageSize,
      search: formInline.search
      // deptid  或 regionid
    });
    resolve({ total: data?.total, list: data?.list });
  });
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const { deptid, regionid, ...params } = form.value;
      if (isEdit.value) {
        const res = await updateSubstationInfoById({ ...params, deptid: Number(deptid), regionid: Number(regionid) });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      } else {
        const res = await insertSubstationInfo({ ...params, deptid: Number(deptid), regionid: Number(regionid) });
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

const onSearch = () => {
  tableRef?.value?.resetData();
};

const deleteSubstation = async (stationid: string) => {
  const res = await deleteSubstationInfoById({ stationid });
  if (res.code === 1) {
    tableRef?.value?.resetData();
    ElMessage.success({ message: res.msg });
  } else {
    ElMessage.error({ message: res.msg });
  }
};

const updateSubstation = async row => {
  isEdit.value = true;
  formVisible.value = true;
  form.value = { ...row, deptid: Number(row.deptid), regionid: Number(row.regionid) };
  setTimeout(() => substationFormRef.value?.clearValidate());
};

const newSubstation = () => {
  form.value = defaultForm;
  formVisible.value = true;
  isEdit.value = false;
  substationFormRef.value?.resetFields();
};

onMounted(async () => {
  const getCompanyTreeRes = await getCompanyTree();
  const getSubGroupTreeRes = await getSubGroupTree();
  regionTree.value = getSubGroupTreeRes?.data;
  deptTree.value = getCompanyTreeRes?.data;
});
</script>

<style scoped lang="scss">
@import "./index";
</style>
