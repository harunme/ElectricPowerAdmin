const columnsConfig = {
  P: [
    { prop: "circuitname", label: "回路名称" },
    { prop: "collecttime", label: "采集时间", width: 180 },
    { prop: "fPa", label: "Pa(kW)" },
    { prop: "fPb", label: "Pb(kW)" },
    { prop: "fPc", label: "Pc(kW)" },
    { prop: "fP", label: "P(kW)" }
  ],
  I: [
    { prop: "circuitname", label: "回路名称" },
    { prop: "collecttime", label: "采集时间", width: 180 },
    { prop: "fIa", label: "Ia(A)" },
    { prop: "fIb", label: "Ib(A)" },
    { prop: "fIc", label: "Ic(A)" }
  ],
  U: [
    { prop: "circuitname", label: "回路名称" },
    { prop: "collecttime", label: "采集时间", width: 180 },
    { prop: "fUa", label: "Ua(V)" },
    { prop: "fUb", label: "Ub(V)" },
    { prop: "fUc", label: "Uc(V)" }
  ],
  UL: [
    { prop: "circuitname", label: "回路名称" },
    { prop: "collecttime", label: "采集时间", width: 180 },
    { prop: "fUab", label: "Uab(V)" },
    { prop: "fUbc", label: "Ubc(V)" },
    { prop: "fUca", label: "Uca(V)" }
  ],
  Fr: [
    { prop: "circuitname", label: "回路名称" },
    { prop: "collecttime", label: "采集时间", width: 180 },
    { prop: "fUab", label: "Fr(Hz)" }
  ],
  PF: [
    { prop: "circuitname", label: "回路名称" },
    { prop: "collecttime", label: "采集时间", width: 180 },
    { prop: "fPfa", label: "Pfa" },
    { prop: "fPfb", label: "Pfb" },
    { prop: "fPfc", label: "Pfc" },
    { prop: "fPf", label: "Pf" }
  ],
  Q: [
    { prop: "circuitname", label: "回路名称" },
    { prop: "collecttime", label: "采集时间", width: 180 },
    { prop: "fQa", label: "Qa(kVar)" },
    { prop: "fQb", label: "Qb(kVar)" },
    { prop: "fQc", label: "Qc(kVar)" },
    { prop: "fQ", label: "Q(kVar)" }
  ],
  S: [
    { prop: "circuitname", label: "回路名称" },
    { prop: "collecttime", label: "采集时间", width: 180 },
    { prop: "fSa", label: "Sa(kVA)" },
    { prop: "fSb", label: "Sb(kVA)" },
    { prop: "fSc", label: "Sc(kVA)" },
    { prop: "fS", label: "S(kVA)" }
  ],
  UnB: [
    { prop: "circuitname", label: "回路名称" },
    { prop: "collecttime", label: "采集时间", width: 180 },
    { prop: "fUUnB", label: "UUnB" }
  ],
  LF: [
    { prop: "circuitname", label: "回路名称" },
    { prop: "collecttime", label: "采集时间", width: 180 },
    { prop: "fLf", label: "Lf(%)" }
  ]
};

const phaseConfig = {
  P: "Pa-Pb-Pc-P",
  I: "Ia-Ib-Ic",
  U: "Ua-Ub-Uc",
  UL: "Uab-Ubc-Uca",
  Fr: "Fr",
  PF: "Pfa-Pfb-Pfc-Pf",
  Q: "Qa-Qb-Qc-Q",
  S: "Sa-Sb-Sc-S",
  UnB: "IUnB-UUnB",
  LF: "Lf"
};

export { columnsConfig, phaseConfig };
