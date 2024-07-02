<template>
  <div class="flex-column">
    <div class="main-box">
      <div class="card left-box"></div>
      <div class="card table-box flex-column">
        <el-form :inline="true" :model="formInline" class="table-form-inline">
          <el-form-item label="关键字">
            <el-input v-model="formInline.user" placeholder="请输入角色名称或描述" clearable />
          </el-form-item>
          <el-form-item>
            <el-button @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="formVisible = true">新增角色</el-button>
          </el-form-item>
        </el-form>
        <PaginationTable :columns="columns" :fetch-data="fetchData">
          <template #actions="">
            <el-button type="text" size="mini">配置菜单权限</el-button>
            <el-button type="text" size="mini">修改</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </PaginationTable>
      </div>
    </div>
    <el-dialog v-model="formVisible" title="新增用户信息" width="500">
      <el-form :model="form" label-position="left">
        <el-form-item required label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="用户名仅支持英文和数字(最多20位)" />
        </el-form-item>
        <el-form-item required label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="请填写真实姓名" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="密码必须包含大小写字母，数字及特殊符号" />
        </el-form-item>
        <el-form-item label="密码确认" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item label="组织机构" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="请选择组织机构" />
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择角色">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户组" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择用户组">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户手机号" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="请填写11位手机号" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="请填写邮箱" />
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入平台名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">Cancel</el-button>
          <el-button type="primary" @click="formVisible = false"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="RoleSet">
import { reactive, ref } from "vue";
import PaginationTable from "@/components/PaginationTable/index.vue";

const formLabelWidth = "90px";

const formVisible = ref(false);
const formInline = reactive({
  user: "",
  region: "",
  date: ""
});
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
});

const columns = [
  { prop: "stationname", label: "角色名称" },
  { prop: "stationname", label: "组织机构" },
  { prop: "stationname", label: "描述" },
  { prop: "actions", label: "操作" }
];

const fetchData = async (): Promise<any> => {
  return new Promise(async resolve => {
    // const { data } = await EnergyReportNoHjPageInfo({
    //   pageNum,
    //   pageSize,
    //   startTime: "2024-06-01",
    //   endTime: "2024-06-23"
    // });
    // console.log("fetchData", data.list);
    resolve({ total: 0, list: [] });
  });
};

const onSubmit = () => {
  console.log("submit!");
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
