import React from "react";

import Cell from "./components/cell";
import ContextMenu from "./components/context-menu";

import useExcel from "./useExcel";
import { CellType } from "./constant";

import "./style.css";

const CONTAINER_CLASS_NAME = "excel";

const Excel = () => {
  const {
    addColumn,
    addRow,
    cellType,
    menuPosition,
    onInput,
    sheet,
    showContextMenu,
  } = useExcel();

  return (
    <div className={CONTAINER_CLASS_NAME}>
      {showContextMenu && (
        <ContextMenu
          isRowSelect={cellType === CellType.ROW}
          menuPosition={menuPosition}
          addRow={addRow}
          addColumn={addColumn}
        />
      )}
      {sheet.map((row, outerIndex) => {
        return (
          <div key={outerIndex} className="excel-row">
            {row.map((r, innerIndex) => {
              return (
                <Cell
                  onInput={onInput}
                  outerIndex={outerIndex}
                  innerIndex={innerIndex}
                  key={r.id}
                  {...r}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Excel;
