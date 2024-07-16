const columns = {
  I: [
    { prop: "objectname", label: "回路名称" },
    { prop: "customDom", slotName: "collecttime", label: "日期", width: 120 },
    {
      label: "A相电流(A)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "customDom", slotName: "fIamaxvalue", label: "数值" },
            { prop: "customDom", slotName: "fIamaxtime", label: "发生时间", width: 84 }
          ]
        },
        {
          label: "最小值",
          children: [
            // { prop: "fIaminvalue", label: "数值" },
            { prop: "customDom", slotName: "fIaminvalue", label: "数值" },
            { prop: "customDom", slotName: "fIamintime", label: "发生时间", width: 84 }
          ]
        },
        { prop: "fIaavg", label: "平均值" }
      ]
    },
    {
      label: "B相电流(A)",
      children: [
        {
          label: "最大值",
          children: [
            // { prop: "fIbmaxvalue", label: "数值" },
            { prop: "customDom", slotName: "fIbmaxvalue", label: "数值" },
            { prop: "customDom", slotName: "fIbmaxtime", label: "发生时间", width: 84 }
          ]
        },
        {
          label: "最小值",
          children: [
            // { prop: "fIbminvalue", label: "数值" },
            { prop: "customDom", slotName: "fIbminvalue", label: "数值" },
            { prop: "customDom", slotName: "fIbmintime", label: "发生时间", width: 84 }
          ]
        },
        { prop: "fIbavg", label: "平均值" }
      ]
    },
    {
      label: "C相电流(A)",
      children: [
        {
          label: "最大值",
          children: [
            // { prop: "fIcmaxvalue", label: "数值" },
            { prop: "customDom", slotName: "fIcmaxvalue", label: "数值" },
            { prop: "customDom", slotName: "fIcmaxtime", label: "发生时间", width: 84 }
          ]
        },
        {
          label: "最小值",
          children: [
            // { prop: "fIcminvalue", label: "数值" },
            { prop: "customDom", slotName: "fIcminvalue", label: "数值" },
            { prop: "customDom", slotName: "fIcmintime", label: "发生时间", width: 84 }
          ]
        },
        { prop: "fIcavg", label: "平均值" }
      ]
    }
  ],
  U: [
    { prop: "objectname", label: "回路名称" },
    { prop: "collecttime", label: "日期", width: 200 },
    {
      label: "A相电压(V)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fUamaxvalue", label: "数值" },
            { prop: "fUamaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fUaminvalue", label: "数值" },
            { prop: "fUamintime", label: "发生时间" }
          ]
        },
        { prop: "fUaavg", label: "平均值" }
      ]
    },
    {
      label: "B相电压(V)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fUbmaxvalue", label: "数值" },
            { prop: "fUbmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fUbminvalue", label: "数值" },
            { prop: "fUbmintime", label: "发生时间" }
          ]
        },
        { prop: "fUbavg", label: "平均值" }
      ]
    },
    {
      label: "C相电压(V)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fUcmaxvalue", label: "数值" },
            { prop: "fUcmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fUcminvalue", label: "数值" },
            { prop: "fUcmintime", label: "发生时间" }
          ]
        },
        { prop: "fUcavg", label: "平均值" }
      ]
    }
  ],
  ABCU: [
    { prop: "objectname", label: "回路名称" },
    { prop: "collecttime", label: "日期", width: 200 },
    {
      label: "AB线电压(V)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fUabmaxvalue", label: "数值" },
            { prop: "fUabmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fUabminvalue", label: "数值" },
            { prop: "fUabmintime", label: "发生时间" }
          ]
        },
        { prop: "fUabavg", label: "平均值" }
      ]
    },
    {
      label: "BC线电压(V)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fUbcmaxvalue", label: "数值" },
            { prop: "fUbcmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fUbcminvalue", label: "数值" },
            { prop: "fUbcmintime", label: "发生时间" }
          ]
        },
        { prop: "fUbcavg", label: "平均值" }
      ]
    },
    {
      label: "CA线电压(V)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fUcamaxvalue", label: "数值" },
            { prop: "fUcamaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fUcaminvalue", label: "数值" },
            { prop: "fUcamintime", label: "发生时间" }
          ]
        },
        { prop: "fUcaavg", label: "平均值" }
      ]
    }
  ],
  P: [
    { prop: "objectname", label: "回路名称" },
    { prop: "collecttime", label: "日期", width: 200 },
    {
      label: "有功功率(kW)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "text", label: "数值" },
            { prop: "3sdf11", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "text", label: "数值" },
            { prop: "3sdf11", label: "发生时间" }
          ]
        },
        { prop: "3sdf", label: "平均值" }
      ]
    },
    {
      label: "无功功率(kVar)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "text", label: "数值" },
            { prop: "3sdf11", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "text", label: "数值" },
            { prop: "3sdf11", label: "发生时间" }
          ]
        },
        { prop: "3sdf", label: "平均值" }
      ]
    },
    {
      label: "视在功率(kVA)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "text", label: "数值" },
            { prop: "3sdf11", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "text", label: "数值" },
            { prop: "3sdf11", label: "发生时间" }
          ]
        },
        { prop: "3sdf", label: "平均值" }
      ]
    },
    {
      label: "功率因数",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "text", label: "数值" },
            { prop: "3sdf11", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "text", label: "数值" },
            { prop: "3sdf11", label: "发生时间" }
          ]
        },
        { prop: "3sdf", label: "平均值" }
      ]
    }
  ],
  UnB: [
    { prop: "objectname", label: "回路名称" },
    { prop: "collecttime", label: "日期", width: 200 },
    {
      label: "电压三相不平衡度(%)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fUUnBmaxvalue", label: "数值" },
            { prop: "fUUnBmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fUUnBminvalue", label: "数值" },
            { prop: "fUUnBmintime", label: "发生时间" }
          ]
        },
        { prop: "fUUnBavg", label: "平均值" }
      ]
    },
    {
      label: "电流三相不平衡度(%)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fIUnBmaxvalue", label: "数值" },
            { prop: "fIUnBmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fIUnBminvalue", label: "数值" },
            { prop: "fIUnBmintime", label: "发生时间" }
          ]
        },
        { prop: "fIUnBavg", label: "平均值" }
      ]
    }
  ],
  UHR: [
    { prop: "objectname", label: "回路名称" },
    { prop: "collecttime", label: "日期", width: 200 },
    {
      label: "A相电压总谐波含有率(%)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fUaTHDmaxvalue", label: "数值" },
            { prop: "fUaTHDmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fUaTHDminvalue", label: "数值" },
            { prop: "fUaTHDmintime", label: "发生时间" }
          ]
        },
        { prop: "fUaTHDavg", label: "平均值" }
      ]
    },
    {
      label: "B相电压总谐波含有率(%)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fUbTHDmaxvalue", label: "数值" },
            { prop: "fUbTHDmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fUbTHDminvalue", label: "数值" },
            { prop: "fUbTHDmintime", label: "发生时间" }
          ]
        },
        { prop: "fUbTHDavg", label: "平均值" }
      ]
    },
    {
      label: "C相电压总谐波含有率(%)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fUcTHDmaxvalue", label: "数值" },
            { prop: "fUcTHDmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fUcTHDminvalue", label: "数值" },
            { prop: "fUcTHDmintime", label: "发生时间" }
          ]
        },
        { prop: "fUcTHDavg", label: "平均值" }
      ]
    }
  ],
  IHR: [
    { prop: "objectname", label: "回路名称" },
    { prop: "collecttime", label: "日期", width: 200 },
    {
      label: "A相电流总谐波含有率(%)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fIaTHDmaxvalue", label: "数值" },
            { prop: "fIaTHDmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fIaTHDminvalue", label: "数值" },
            { prop: "fIaTHDmintime", label: "发生时间" }
          ]
        },
        { prop: "fIaTHDavg", label: "平均值" }
      ]
    },
    {
      label: "B相电流总谐波含有率(%)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fIbTHDmaxvalue", label: "数值" },
            { prop: "fIbTHDmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fIbTHDminvalue", label: "数值" },
            { prop: "fIbTHDmintime", label: "发生时间" }
          ]
        },
        { prop: "fIbTHDavg", label: "平均值" }
      ]
    },
    {
      label: "C相电流总谐波含有率(%)",
      children: [
        {
          label: "最大值",
          children: [
            { prop: "fIcTHDmaxvalue", label: "数值" },
            { prop: "fIcTHDmaxtime", label: "发生时间" }
          ]
        },
        {
          label: "最小值",
          children: [
            { prop: "fIcTHDminvalue", label: "数值" },
            { prop: "fIcTHDmintime", label: "发生时间" }
          ]
        },
        { prop: "fIcTHDavg", label: "平均值" }
      ]
    }
  ]
};

export default columns;
