<template>
  <div class="flex-column User">
    <div class="main-box">
      <CollapseBox>
        <DeptTree :on-change="onDeptTreeChange" />
      </CollapseBox>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="formInline.search" placeholder="请输入用户名或姓名" clearable />
          </el-form-item>
          <el-form-item label="角色类型">
            <el-cascader
              v-model="formInline.roleid"
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
          <el-form-item label="用户组">
            <el-cascader
              v-model="formInline.groupid"
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
          <el-form-item>
            <el-button @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="addUser">新增</el-button>
          </el-form-item>
        </el-form>
        <PaginationTable ref="tableRef" :fetch-on-mounted="false" :columns="columns" row-key="userid" :fetch-data="fetchData">
          <template #actions="{ row }">
            <a class="mini-btn" @click="setRole(row)">权限设置</a>
            <a class="mini-btn" @click="updateUserAction(row)">修改</a>
            <el-popconfirm title="确认删除?" @confirm="deleteUserAction(row.userid)">
              <template #reference>
                <a class="mini-btn">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </PaginationTable>
      </div>
    </div>
    <el-dialog v-model="formVisible" :title="isEdit ? '修改用户' : '新增用户'" width="860" :destroy-on-close="true">
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
            <el-form-item required label="用户名" prop="username" :label-width="formLabelWidth">
              <el-input v-model="form.username" autocomplete="off" placeholder="用户名仅支持英文和数字(最多20位)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="姓名" prop="name" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off" placeholder="请填写真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="密码" prop="password" :label-width="formLabelWidth">
              <el-input
                v-model="form.password"
                autocomplete="off"
                type="password"
                placeholder="密码必须包含大小写字母，数字及特殊符号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="密码确认" prop="passwordconfirm" :label-width="formLabelWidth">
              <el-input v-model="form.passwordconfirm" autocomplete="off" type="password" placeholder="请再次输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="组织机构" prop="deptid" :label-width="formLabelWidth">
              <el-cascader
                @change="changeDept"
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
            <el-form-item required label="角色" prop="roleid" :label-width="formLabelWidth">
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
            <el-form-item required label="用户组" prop="groupid" :label-width="formLabelWidth">
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
            <el-form-item label="用户手机号" prop="telephone" :label-width="formLabelWidth">
              <el-input v-model="form.telephone" autocomplete="off" placeholder="请填写11位手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
              <el-input v-model="form.email" autocomplete="off" placeholder="请填写邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题" prop="title" :label-width="formLabelWidth">
              <el-input v-model="form.title" autocomplete="off" placeholder="请输入平台名称" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="submitForm(userFormRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="roleDialogVisible" :destroy-on-close="true" title="权限设置" width="1200">
      <el-container class="select-modal">
        <el-aside width="280px" style="padding: 0 16px">
          <el-tabs stretch>
            <el-tab-pane label="组织机构">
              <el-tree
                :current-node-key="selectedUser.deptid"
                default-expand-all
                style="max-width: 600px"
                :data="companyTree"
                node-key="deptid"
                :props="companyProps"
                @node-click="nodeClick"
                :highlight-current="true"
                :expand-on-click-node="false"
              />
            </el-tab-pane>
            <el-tab-pane label="区域">
              <el-tree
                default-expand-all
                style="max-width: 600px"
                :data="groupTree"
                node-key="regionid"
                :props="groupProps"
                @node-click="nodeClick"
                :highlight-current="true"
                :expand-on-click-node="false"
              />
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-main class="main">
          <div class="form">
            <el-form :inline="true" :model="roleFormInline" class="demo-form-inline">
              <el-form-item label="关键字">
                <el-input style="width: 300px" v-model="roleFormInline.search" placeholder="请输入站点名称或编号" clearable />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSearchStation">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="content" v-loading="loadingStation">
            <el-checkbox-group v-model="checkStationList">
              <el-checkbox :key="item.stationid" v-for="item in stationList" :label="item.stationname" :value="item.stationid" />
            </el-checkbox-group>
          </div>
        </el-main>
      </el-container>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUserSubstations()">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="User">
import { reactive, ref, watch } from "vue";
import CollapseBox from "@/components/CollapseBox/index.vue";
import PaginationTable from "@/components/PaginationTable/index.vue";
import {
  getUserCommonInfo,
  deleteUser,
  updateUser,
  insertUser,
  getCompanyTree,
  selectUserGroupTree,
  getRolesListTree,
  getSubGroupTree,
  updateUserAndSub,
  getSubstationListUnderCompanyOrSubgroup,
  getSubstationListOfSelected
} from "@/api/modules/org";
import DeptTree from "@/components/DeptTree/index.vue";
import type { FormRules, FormInstance } from "element-plus";
import { Org } from "@/api/interface/index";
import { ElMessage } from "element-plus";

const formLabelWidth = "90px";
const tableRef = ref<any>(null);
const deptid = ref<any>(null);
const selectedUser = ref<any>(null);
const deptTree = ref<any>([]);
const userGroupTree = ref<any>([]);
const userRoleTree = ref<any>([]);
const formVisible = ref(false);
const roleDialogVisible = ref(false);
const isEdit = ref(false);
const userFormRef = ref<FormInstance>();
const checkStationList = ref<string[]>([]);
const stationList = ref<any>([]);
const loadingStation = ref<boolean>(true);
const getSubstationListUnderCompanyOrSubgroupParams = ref<any>({});
// 组织机构树
const companyTree = ref([] as any);
// 区域树
const groupTree = ref([] as any);
const formInline = reactive({
  deptid: "",
  groupid: "",
  roleid: "",
  search: ""
});
const roleFormInline = reactive({
  search: ""
});

const defaultForm = {
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
};
const form = ref<any>(defaultForm);
const companyProps = { children: "children", label: "deptname" };
const groupProps = { children: "children", label: "regionname" };
const columns: any = [
  { prop: "username", label: "用户名" },
  { prop: "name", label: "姓名" },
  { prop: "deptname", label: "组织机构" },
  { prop: "rolename", label: "角色" },
  { prop: "groupname", label: "用户组" },
  { prop: "telephone", label: "手机号", width: 132 },
  { prop: "email", label: "邮箱" },
  { prop: "title", label: "备注" },
  { prop: "customDom", slotName: "actions", label: "操作", width: 172 }
];

const rules = reactive<FormRules<Org.ReqInsertDeptInfo>>({
  username: [
    { required: true, message: "请输入用户名" },
    { max: 24, message: "长度不超过 24 个字符" }
  ],
  name: [
    { required: true, message: "请输入姓名" },
    { max: 24, message: "长度不超过 12 个字符" }
  ],
  password: [
    { required: true, message: "请输入密码" },
    { min: 6, message: "长度至少 6 个字符" }
  ],
  passwordconfirm: [
    { required: true, message: "请输入密码" },
    { min: 6, message: "长度至少 6 个字符" }
  ],
  telephone: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" }],
  email: [{ type: "email", message: "请输入正确的邮箱地址" }],
  deptid: [{ required: true, message: "请选择组织机构" }],
  groupid: [{ required: true, message: "请选择用户组" }]
});

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    const params: any = { deptid: deptid.value };
    if (formInline.search) params.search = formInline.search;
    if (formInline.roleid) params.roleid = formInline.roleid;
    if (formInline.groupid) params.groupid = formInline.groupid;
    const { data } = await getUserCommonInfo(params);
    resolve({ list: data });
  });
};

const nodeClick = async node => {
  const params: any = {};
  if (node.regionid) {
    params.regionid = node.regionid;
  }
  if (node.deptid) {
    params.deptid = node.deptid;
  }
  loadingStation.value = true;
  const { data } = await getSubstationListUnderCompanyOrSubgroup({ ...params, search: roleFormInline.search });
  stationList.value = data;
  loadingStation.value = false;
  getSubstationListUnderCompanyOrSubgroupParams.value = params;
};

const changeDept = async deptid => {
  const userGroupRes = await selectUserGroupTree({
    deptid: deptid
  });

  const roleRes = await getRolesListTree({
    deptid: deptid
  });
  userRoleTree.value = roleRes.data;

  userGroupTree.value = userGroupRes.data;
};

const updateUserSubstations = async () => {
  const { msg, code } = await updateUserAndSub({
    userid: selectedUser.value.userid,
    stationid: checkStationList.value.join(";")
  });
  if (code === 1) {
    ElMessage.success(msg);
  } else {
    ElMessage.warning(msg);
  }
  roleDialogVisible.value = false;
};

const onCancel = () => {
  setTimeout(() => userFormRef.value?.resetFields());
  formVisible.value = false;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const params = { ...form.value };
      if (params.password !== params.passwordconfirm) ElMessage.warning({ message: "密码不一致,请重新输入" });
      else {
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
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const updateUserAction = async row => {
  isEdit.value = true;
  formVisible.value = true;
  form.value = { ...row };
  setTimeout(() => userFormRef.value?.clearValidate());
};

const deleteUserAction = async (userid: string) => {
  const res = await deleteUser({ userid });
  if (res.code === 1) {
    tableRef?.value?.resetData();
    ElMessage.success({ message: res.msg });
  } else {
    ElMessage.error({ message: res.msg });
  }
};

const addUser = () => {
  isEdit.value = false;
  formVisible.value = true;
  userFormRef.value?.resetFields();
  setTimeout(() => userFormRef.value?.clearValidate());
};

const onDeptTreeChange = async node => {
  deptid.value = node.deptid;
  tableRef?.value?.resetData();

  const companyRes = await getCompanyTree();
  deptTree.value = companyRes.data;
};

const onSubmit = () => {
  tableRef?.value?.resetData();
};

const onSearchStation = async () => {
  loadingStation.value = true;
  const { data } = await getSubstationListUnderCompanyOrSubgroup({
    search: roleFormInline.search,
    ...getSubstationListUnderCompanyOrSubgroupParams.value
  });
  stationList.value = data;
  loadingStation.value = false;
};

const setRole = async (row: any) => {
  const { data }: any = await getSubstationListOfSelected({
    userid: row.userid
  });
  checkStationList.value = data.map(({ stationid }) => stationid);
  selectedUser.value = row;
  roleDialogVisible.value = true;
};

watch(roleDialogVisible, async () => {
  if (roleDialogVisible.value) {
    stationList.value = [];
    loadingStation.value = true;
    const getCompanyTreeRes = await getCompanyTree();
    const getSubGroupTreeRes = await getSubGroupTree();
    groupTree.value = getSubGroupTreeRes?.data;
    companyTree.value = getCompanyTreeRes?.data;
    const { data } = await getSubstationListUnderCompanyOrSubgroup({
      deptid: selectedUser.value.deptid
    });

    stationList.value = data;
    loadingStation.value = false;
  }
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
