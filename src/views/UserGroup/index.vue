<template>
  <div class="UserGroup">
    <CollapseBox>
      <DeptTree :on-change="onDeptTreeChange" />
    </CollapseBox>
    <div class="card">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addUserGroup">新增用户组</el-button>
        </el-form-item>
      </el-form>
      <div class="table-box">
        <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="columns" row-key="groupid" :fetch-data="fetchData">
          <template #actions="{ row }">
            <a class="mini-btn" @click="updateGroup(row)">修改</a>
            <el-popconfirm title="确认删除?" @confirm="deleteGroup(row.groupid)">
              <template #reference>
                <a class="mini-btn">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </PaginationTable>
        <el-dialog v-model="formVisible" :title="isEdit ? '修改用户组' : '新增用户组'" width="500">
          <el-form
            ref="userGroupFormRef"
            :model="form"
            label-position="right"
            :rules="rules"
            label-width="auto"
            style="padding: 16px 32px"
            :validate-on-rule-change="false"
          >
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item required label="用户组名称" prop="groupname">
                  <el-input v-model="form.groupname" placeholder="最大10个中英文字符" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item required label="上级用户组" prop="parentid">
                  <el-cascader
                    v-model="form.parentid"
                    style="width: 100%"
                    :options="userGroupTree"
                    :props="{
                      checkStrictly: true,
                      value: 'groupid',
                      label: 'groupname',
                      emitPath: false
                    }"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item required label="组织机构" prop="deptid">
                  <el-cascader
                    v-model="form.deptid"
                    style="width: 100%"
                    :options="deptTree"
                    :props="{
                      checkStrictly: true,
                      value: 'deptid',
                      label: 'deptname',
                      emitPath: false
                    }"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="英文名称" prop="foreignname">
                  <el-input v-model="form.foreignname" placeholder="最大30个字符" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户组说明" prop="groupexplain">
                  <el-input v-model="form.groupexplain" placeholder="最大30个字符" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="formVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm(userGroupFormRef)">确定</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx" name="UserGroup">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
import { Org } from "@/api/interface/index";
import { selectUserGroupTree, insertUserGroup, deleteUserGroup, updateUserGroup, getCompanyTree } from "@/api/modules/org";
import PaginationTable from "@/components/PaginationTable/index.vue";
import DeptTree from "@/components/DeptTree/index.vue";
import CollapseBox from "@/components/CollapseBox/index.vue";

const defaultForm = {
  groupname: "",
  foreignname: "",
  parentid: undefined,
  deptid: undefined,
  groupexplain: ""
};

const formVisible = ref(false);
const tableRef = ref<any>(null);
const deptTree = ref<any>([]);
const userGroupTree = ref<any>([]);
const deptid = ref<string | null>(null);

const isEdit = ref(false);
const userGroupFormRef = ref<FormInstance>();
const form = ref<any>(defaultForm);

const rules = reactive<FormRules<Org.ReqInsertDeptInfo>>({
  groupname: [
    { required: true, message: "请输入用户组名称" },
    { max: 30, message: "长度不超过 30 个字符" }
  ],
  parentid: [{ required: true, message: "请选择上级用户组" }],
  deptid: [{ required: true, message: "请选择组织机构" }]
});

const addUserGroup = () => {
  isEdit.value = false;
  formVisible.value = true;
  userGroupFormRef.value?.resetFields();
  setTimeout(() => userGroupFormRef.value?.clearValidate());
};

const columns: any = [
  { prop: "groupname", label: "用户组名称" },
  { prop: "foreignname", label: "英文名称" },
  { prop: "deptname", label: "组织机构" },
  { prop: "groupexplain", label: "用户组说明" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await selectUserGroupTree({
      deptid: deptid.value
    });
    userGroupTree.value = [{ groupname: "无", groupid: -1 } as any].concat(data);
    resolve({ list: data });
  });
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = { ...form.value };
      if (params.parentid === -1) params.parentid = 0;

      if (isEdit.value) {
        const res = await updateUserGroup({ ...params });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      } else {
        const res = await insertUserGroup({ ...params });
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

const updateGroup = async row => {
  isEdit.value = true;
  formVisible.value = true;
  form.value = { ...row, parentid: String(row.parentid) === "0" ? -1 : row.parentid };
  setTimeout(() => userGroupFormRef.value?.clearValidate());
};

const deleteGroup = async (groupid: string) => {
  const res = await deleteUserGroup({ groupid });
  if (res.code === 1) {
    tableRef?.value?.resetData();
    ElMessage.success({ message: res.msg });
  } else {
    ElMessage.error({ message: res.msg });
  }
};

onMounted(async () => {
  const { data } = await getCompanyTree();
  deptTree.value = data;
});

const onDeptTreeChange = node => {
  deptid.value = node.deptid;
  tableRef?.value?.resetData();
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
