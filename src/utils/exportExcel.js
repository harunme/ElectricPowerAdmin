function exportExcel({ data, textKeyMaps, filename }) {
  // 调用函数，将数据源转化为 Excel 单元格数据，及 Excel 表头合并单元格配置
  const { headerMerges, cells: _cells } = transformDataToSheetCells(data, textKeyMaps);
  // merges.value = headerMerges;
  // cells.value = _cells;

  const worksheet = window.OriginXLSX.utils.aoa_to_sheet(_cells);
  worksheet["!merges"] = headerMerges;

  // 所有单元格居中显示
  Object.values(worksheet).forEach(cell => {
    if (cell.v) {
      cell.s = {
        alignment: {
          horizontal: "center",
          vertical: "center"
        }
      };
    }
  });

  toStyleXlsx({
    filename,
    worksheet
  });
}

export { exportExcel };
