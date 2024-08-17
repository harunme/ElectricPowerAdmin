import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
// import { searchRoleProjectMenu } from "@/api/modules/login";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";

const Menu = [
  {
    name: "overview",
    meta: {
      icon: "./images/menu-overview.svg",
      title: "概况",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false
    },
    children: [
      {
        path: "/EnergyReportOfCollection",
        name: "EnergyReportOfCollection",
        component: "/EnergyReportOfCollection/index",
        meta: {
          title: "用能月报",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: false
        }
      },
      {
        path: "/SubstationStatus",
        name: "SubstationStatus",
        component: "/SubstationStatus/index",
        meta: {
          title: "变配电站状态",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: true,
          isKeepAlive: false
        }
      },
      {
        path: "/TransformerList",
        name: "TransformerList",
        component: "/TransformerList/index",
        meta: {
          title: "变压器状态",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/Dashboard",
        name: "Dashboard",
        component: "/dashboard/dataVisualize/index",
        meta: {
          title: "看板",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      }
    ]
  },
  {
    name: "Power",
    meta: {
      icon: "./images/menu-electric-monitoring.svg",
      title: "电力监测",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false
    },
    children: [
      {
        path: "/ElectricData",
        name: "ElectricData",
        component: "/ElectricData/index",
        meta: {
          title: "电力数据",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/TransformerMonitor",
        name: "TransformerMonitor",
        component: "/TransformerMonitor/index",
        meta: {
          title: "变压器监测",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/ElectricReport",
        name: "ElectricReport",
        component: "/ElectricReport/index",
        meta: {
          title: "电力运行报表",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/DistributDiagram",
        name: "DistributDiagram",
        component: "/DistributDiagram/index",
        meta: {
          title: "配电图",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/ElectricExtremumReport",
        name: "ElectricExtremumReport",
        component: "/ElectricExtremumReport/index",
        meta: {
          title: "电力极值报表",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/ElectricDayReport",
        name: "ElectricDayReport",
        component: "/ElectricDayReport/index",
        meta: {
          title: "电力运行日报",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/ElectricMonthReport",
        name: "ElectricMonthReport",
        component: "/ElectricMonthReport/index",
        meta: {
          title: "电力运行月报",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/AveragePowerReport",
        name: "AveragePowerReport",
        component: "/AveragePowerReport/index",
        meta: {
          title: "平均功率因数",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/QuadrantElectricity",
        name: "QuadrantElectricity",
        component: "/QuadrantElectricity/index",
        meta: {
          title: "四象限电能",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/LoadFactor",
        name: "LoadFactor",
        component: "/LoadFactor/index",
        meta: {
          title: "负荷率",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/MonthlyTransTempReport_zx",
        name: "MonthlyTransTempReport_zx",
        component: "/MonthlyTransTempReport_zx/index",
        meta: {
          title: "变压器温度月报",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      }
    ]
  },
  {
    name: "Harmonic",
    meta: {
      icon: "./images/menu-electric-quality.svg",
      title: "电能质量",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false
    },
    children: [
      {
        path: "/HarmonicData",
        name: "HarmonicData",
        component: "/HarmonicData/index",
        meta: {
          title: "谐波监测",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/UnbMonitor",
        name: "UnbMonitor",
        component: "/UnbMonitor/index",
        meta: {
          title: "不平衡度监测",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      }
    ]
  },
  {
    name: "Analysis",
    meta: {
      icon: "./images/menu-electric-analysis.svg",
      title: "用电分析",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false
    },
    children: [
      {
        path: "/EnergyData",
        name: "EnergyData",
        component: "/EnergyData/index",
        meta: {
          title: "用能报表",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/EnergyYOY",
        name: "EnergyYOY",
        component: "/EnergyYOY/index",
        meta: {
          title: "同比分析",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/EnergyMOM",
        name: "EnergyMOM",
        component: "/EnergyMOM/index",
        meta: {
          title: "环比分析",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/ConsumeEnergyReport",
        name: "ConsumeEnergyReport",
        component: "/ConsumeEnergyReport/index",
        meta: {
          title: "电能集抄",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/LossAnalysis",
        name: "LossAnalysis",
        component: "/LossAnalysis/index",
        meta: {
          title: "计量及电路损耗",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/UserReport",
        name: "UserReport",
        component: "/UserReport/index",
        meta: {
          title: "自定义用电报表",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      }
    ]
  },
  {
    name: "Logging",
    meta: {
      icon: "./images/menu-logging.svg",
      title: "事件记录",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false
    },
    children: [
      {
        path: "/SignalEvent",
        name: "SignalEvent",
        component: "/SignalEvent/index",
        meta: {
          title: "遥信事件",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/OverLimitEvent",
        name: "OverLimitEvent",
        component: "/OverLimitEvent/index",
        meta: {
          title: "越限事件",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/SystemDaily",
        name: "SystemDaily",
        component: "/SystemDaily/index",
        meta: {
          title: "操作日志",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/SMSLog",
        name: "SMSLog",
        component: "/SMSLog/index",
        meta: {
          title: "短信日志",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/PlatformRunLog",
        name: "PlatformRunLog",
        component: "/PlatformRunLog/index",
        meta: {
          title: "平台运行日志",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/AlarmInfo",
        name: "AlarmInfo",
        component: "/AlarmInfo/index",
        meta: {
          title: "报警信息",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/PushRecord",
        name: "PushRecord",
        component: "/PushRecord/index",
        meta: {
          title: "推送记录",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/AlarmAnalysis",
        name: "AlarmAnalysis",
        component: "/AlarmAnalysis/index",
        meta: {
          title: "报警分析",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/AlarmInfoHistory",
        name: "AlarmInfoHistory",
        component: "/AlarmInfoHistory/index",
        meta: {
          title: "报警信息历史",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      }
    ]
  },
  {
    name: "Setting",
    meta: {
      icon: "./images/menu-setting.svg",
      title: "系统设置",
      isLink: "",
      isHide: false,
      isFull: false,
      isAffix: false,
      isKeepAlive: false
    },
    children: [
      {
        path: "/User",
        name: "User",
        component: "/User/index",
        meta: {
          title: "用户管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/UserGroup",
        name: "UserGroup",
        component: "/UserGroup/index",
        meta: {
          title: "用户组管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/RoleSet",
        name: "RoleSet",
        component: "/RoleSet/index",
        meta: {
          title: "角色管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/SubGroup",
        name: "SubGroup",
        component: "/SubGroup/index",
        meta: {
          title: "区域管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/RoleGroup",
        name: "RoleGroup",
        component: "/RoleGroup/index",
        meta: {
          title: "组织机构管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },

      {
        path: "/Substation",
        name: "Substation",
        component: "/Substation/index",
        meta: {
          title: "变配电站管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/Meter",
        name: "Meter",
        component: "/Meter/index",
        meta: {
          title: "仪表管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/Transformer",
        name: "Transformer",
        component: "/Transformer/index",
        meta: {
          title: "变压器管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/MonitoringLoop",
        name: "MonitoringLoop",
        component: "/MonitoringLoop/index",
        meta: {
          title: "监测回路管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/Gateway",
        name: "Gateway",
        component: "/Gateway/index",
        meta: {
          title: "通道管理",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      }
    ]
  }
];

export const useAuthStore = defineStore({
  id: "auth",
  state: (): AuthState => ({
    // 菜单权限列表
    authMenuList: [],
    // 当前页面的 router name，用来做按钮权限筛选
    routeName: ""
  }),
  getters: {
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: state => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: state => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList)
  },
  actions: {
    // Get AuthMenuList
    async searchRoleProjectMenu() {
      // const { data } = await searchRoleProjectMenu();
      // console.log("authMenuList", data);
      this.authMenuList = Menu as any;
    },
    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    }
  }
});
