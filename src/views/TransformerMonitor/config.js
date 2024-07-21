const columns = {
  S: [
    { prop: "collecttime", label: "时间" },
    { prop: "value", label: "当日(kVA)" },
    { prop: "yesterdayValue", label: "上日(kVA)" }
  ],
  Q: [
    { prop: "collecttime", label: "时间" },
    { prop: "value", label: "当日(kVar)" },
    { prop: "yesterdayValue", label: "上日(kVar)" }
  ],
  P: [
    { prop: "collecttime", label: "时间" },
    { prop: "value", label: "当日(kW)" },
    { prop: "yesterdayValue", label: "上日(kW)" }
  ],
  Pf: [
    { prop: "collecttime", label: "时间" },
    { prop: "value", label: "当日" },
    { prop: "yesterdayValue", label: "上日" }
  ],
  Pv: [
    { prop: "collecttime", label: "时间" },
    { prop: "A", label: "A相(V)" },
    { prop: "B", label: "B相(V)" },
    { prop: "C", label: "C相(V)" }
  ],
  Lv: [
    { prop: "collecttime", label: "时间" },
    { prop: "A", label: "A相(V)" },
    { prop: "B", label: "B相(V)" },
    { prop: "C", label: "C相(V)" }
  ],
  I: [
    { prop: "collecttime", label: "时间" },
    { prop: "A", label: "A相(A)" },
    { prop: "B", label: "B相(A)" },
    { prop: "C", label: "C相(A)" }
  ],
  Temp: [
    { prop: "collecttime", label: "时间" },
    { prop: "A", label: "温度A(°C)" },
    { prop: "B", label: "温度B(°C)" },
    { prop: "C", label: "温度C(°C)" }
  ]
};

export default columns;
