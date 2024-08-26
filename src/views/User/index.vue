<template>
  <div class="flex-column User">
    <div class="main-box">
      <CollapseBox>
        <DeptTree :on-change="onDeptTreeChange" />
      </CollapseBox>
      <div class="card table-box">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="formInline.user" placeholder="请输入用户名或姓名" clearable />
          </el-form-item>
          <el-form-item label="角色类型">
            <el-select v-model="formInline.region" placeholder="点击选择用户角色" clearable>
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户组">
            <el-select v-model="formInline.region" placeholder="点击选择用户组" clearable>
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="formVisible = true">新增</el-button>
          </el-form-item>
        </el-form>
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
      </div>
    </div>
    <el-dialog v-model="formVisible" title="新增用户信息" width="860">
      <el-form
        ref="userFormRef"
        :model="form"
        label-position="right"
        :rules="rules"
        label-width="auto"
        style="padding: 16px 32px"
        :validate-on-rule-change="false"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item required label="用户名" :label-width="formLabelWidth">
              <el-input v-model="form.username" autocomplete="off" placeholder="用户名仅支持英文和数字(最多20位)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off" placeholder="请填写真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="密码" :label-width="formLabelWidth">
              <el-input v-model="form.password" autocomplete="off" placeholder="密码必须包含大小写字母，数字及特殊符号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="密码确认" :label-width="formLabelWidth">
              <el-input v-model="form.passwordconfirm" autocomplete="off" placeholder="请再次输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="组织机构" :label-width="formLabelWidth">
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
          <el-col :span="12">
            <el-form-item required label="角色" :label-width="formLabelWidth">
              <el-cascader
                v-model="form.roleid"
                style="width: 100%"
                :options="userRoleTree"
                :props="{
                  checkStrictly: true,
                  value: 'roleid',
                  label: 'rolename',
                  emitPath: false
                }"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="用户组" :label-width="formLabelWidth">
              <el-cascader
                v-model="form.groupid"
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
          <el-col :span="12">
            <el-form-item label="用户手机号" :label-width="formLabelWidth">
              <el-input v-model="form.telephone" autocomplete="off" placeholder="请填写11位手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="邮箱" :label-width="formLabelWidth">
              <el-input v-model="form.email" autocomplete="off" placeholder="请填写邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题" :label-width="formLabelWidth">
              <el-input v-model="form.title" autocomplete="off" placeholder="请输入平台名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(userFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="User">
import { reactive, ref } from "vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import {
  getUserCommonInfo,
  deleteUser,
  updateUser,
  insertUser,
  getCompanyTree,
  selectUserGroupTree,
  getRolesListTree
} from "@/api/modules/org";
import DeptTree from "@/components/DeptTree/index.vue";
import type { FormRules, FormInstance } from "element-plus";
import { Org } from "@/api/interface/index";
import { ElMessage } from "element-plus";

const formLabelWidth = "90px";
const tableRef = ref<any>(null);
const deptid = ref<any>(null);
const deptTree = ref<any>([]);
const userGroupTree = ref<any>([]);
const userRoleTree = ref<any>([]);
const formVisible = ref(false);
const isEdit = ref(false);
const userFormRef = ref<FormInstance>();
const formInline = reactive({
  user: "",
  region: "",
  date: ""
});
const form = ref<any>({
  username: "",
  name: "",
  password: "",
  passwordconfirm: "",
  deptid: "",
  groupid: "",
  roleid: "",
  email: "",
  telephone: "",
  title: ""
});

const columns: any = [
  { prop: "username", label: "用户名" },
  { prop: "name", label: "姓名" },
  { prop: "deptname", label: "组织机构" },
  { prop: "rolename", label: "角色" },
  { prop: "groupname", label: "用户组" },
  { prop: "telephone", label: "手机号" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 132 }
];

const rules = reactive<FormRules<Org.ReqInsertDeptInfo>>({
  groupname: [
    { required: true, message: "请输入用户组名称" },
    { max: 30, message: "长度不超过 30 个字符" }
  ],
  parentid: [{ required: true, message: "请选择上级用户组" }],
  deptid: [{ required: true, message: "请选择组织机构" }]
});

// http://111.231.24.91/org/getUserCommonInfo
const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const { data } = await getUserCommonInfo({
      deptid: deptid.value
    });
    // userGroupTree.value = [{ groupname: "无", groupid: -1 } as any].concat(data);
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
        const res = await updateUser({ ...params });
        if (res.code === 1) {
          ElMessage.success({ message: res.msg });
          tableRef?.value?.resetData();
        } else {
          ElMessage.error({ message: res.msg });
        }
        formVisible.value = false;
      } else {
        const res = await insertUser({ ...params });
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
  setTimeout(() => userFormRef.value?.clearValidate());
};

const deleteGroup = async (groupid: string) => {
  const res = await deleteUser({ groupid });
  if (res.code === 1) {
    tableRef?.value?.resetData();
    ElMessage.success({ message: res.msg });
  } else {
    ElMessage.error({ message: res.msg });
  }
};

// onMounted(async () => {});

const onDeptTreeChange = async node => {
  deptid.value = node.deptid;
  tableRef?.value?.resetData();

  const companyRes = await getCompanyTree();
  deptTree.value = companyRes.data;

  const userGroupRes = await selectUserGroupTree({
    deptid: deptid.value
  });

  const roleRes = await getRolesListTree({
    deptid: deptid.value
  });
  userRoleTree.value = roleRes.data;

  userGroupTree.value = userGroupRes.data;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
