import React from "react";
import clone from "just-clone";

import { CellType } from "./constant";

const GRID_SIZE = 11;
const STARTING_ASCII = 65;

const TOOLTIP_WIDTH = 175;

const Cell = {
  id: "",
  type: "",
  value: "",
  formula: "",
  isSelected: false,
};

const useExcel = () => {
  const [sheet, setSheet] = React.useState([]);
  const [showContextMenu, setShowContextMenu] = React.useState(false);
  const [cellType, setCellType] = React.useState();
  const [menuPosition, setMenuPosition] = React.useState({});
  const [outerIndex, setOuterIndex] = React.useState(-1);
  const [innerIndex, setInnerIndex] = React.useState(-1);

  React.useEffect(() => {
    constructSheet();

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDocumentClick(e) {
    const selectedOuterIndex = e.target.getAttribute("data-outer-index");
    const selectedInnerIndex = e.target.getAttribute("data-inner-index");
    const selectedCellType = e.target.getAttribute("data-cell-type");
    if (selectedCellType) {
      setCellType(selectedCellType);
      setShowContextMenu(true);
      setOuterIndex(selectedOuterIndex);
      setInnerIndex(selectedInnerIndex);

      updateContextMenuPosition(e);
    } else {
      e.stopPropagation();
      e.preventDefault();
      setShowContextMenu(false);
    }
  }

  function addRow({ addAbove = false }) {
    const row = [];
    let sheetCpy = clone(sheet);
    const colCount = sheet[0].length;

    for (let i = 0; i < colCount; i++) {
      const cell = { ...Cell };
      cell.id = addAbove ? `New${outerIndex - 1}` : `New${outerIndex + 1}`;
      if (i === 0) {
        cell.type = CellType.ROW;
        cell.value = outerIndex - 1;
      } else {
        cell.type = CellType.CELL;
      }
      row.push(cell);
    }

    const idxToAdd = addAbove ? parseInt(outerIndex) : parseInt(outerIndex) + 1;

    sheetCpy.splice(idxToAdd, 0, row);

    sheetCpy = sheetCpy.map((outer, oIdx) => {
      return outer.map((inner, iIdx) => {
        inner.id = `${oIdx}${iIdx}`;

        if (iIdx === 0) {
          inner.value = oIdx;
        }

        return inner;
      });
    });
    setSheet(sheetCpy);
  }

  function addColumn({ addLeft = false }) {
    let headerASCII = STARTING_ASCII;
    let sheetCpy = clone(sheet);
    sheetCpy = sheetCpy.map((row) => {
      const cell = { ...Cell };
      const idxToAdd = addLeft
        ? parseInt(innerIndex)
        : parseInt(innerIndex) + 1;

      row.splice(idxToAdd, 0, cell);
      return row;
    });

    sheetCpy = sheetCpy.map((row, oIdx) => {
      return row.map((inner, iIdx) => {
        inner.id = `${oIdx}${iIdx}`;

        if (oIdx === 0) {
          if (iIdx === 0) {
            inner.type = CellType.DUMMY;
          } else {
            inner.type = CellType.COL;
            inner.value = String.fromCharCode(headerASCII++);
          }
        } else if (iIdx === 0) {
          inner.type = CellType.ROW;
          inner.value = oIdx;
        } else {
          inner.type = CellType.CELL;
        }

        return inner;
      });
    });
    setSheet(sheetCpy);
  }

  function updateContextMenuPosition(e) {
    const rect = e.target.getBoundingClientRect();
    const mouseLeft = rect.left;
    const mouseTop = rect.top;
    updatePosition({ mouseLeft, mouseTop });
  }

  function updatePosition({ mouseLeft, mouseTop }) {
    if (mouseLeft > 0 || mouseTop > 0) {
      let tooltipX = Math.max(50, mouseLeft - TOOLTIP_WIDTH / 2);
      const tooltipY = Math.max(mouseTop, 20);

      setMenuPosition({ y: tooltipY, x: tooltipX });
    } else if (mouseLeft === -1) {
    }
  }

  function constructSheet() {
    const arr = [...Array(GRID_SIZE).keys()];
    const collArr = [-99, ...Array(GRID_SIZE).keys()];

    const sheetCpy = [];
    let headerASCII = STARTING_ASCII;

    arr.forEach((outer, outerIndex) => {
      const innerArr = [];
      collArr.forEach((inner, innerIndex) => {
        const cell = { ...Cell };
        cell.id = `${outerIndex}${innerIndex}`;
        if (outerIndex === 0) {
          if (innerIndex === 0) {
            cell.type = CellType.DUMMY;
          } else {
            cell.type = CellType.COL;
            cell.value = String.fromCharCode(headerASCII++);
          }
        } else if (innerIndex === 0) {
          cell.type = CellType.ROW;
          cell.value = outerIndex;
        } else {
          cell.type = CellType.CELL;
        }

        innerArr.push(cell);
      });
      sheetCpy.push(innerArr);
    });
    setSheet(sheetCpy);
  }

  function onInput({ value, outerIndex, innerIndex }) {
    const oldSheet = clone(sheet);
    oldSheet[outerIndex][innerIndex].value = value;
    setSheet(oldSheet);
  }

  return {
    addColumn,
    addRow,
    cellType,
    sheet,
    onInput,
    showContextMenu,
    menuPosition,
  };
};

export default useExcel;
