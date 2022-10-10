import React from "react";

import "./style.css";

const ColumnOptions = ["+ Insert 1 Column Left", "+ Insert 1 Column Right"];
const RowOptions = ["+ Insert 1 Row above", "+ Insert 1 Row below"];

const ContextMenu = ({
  isRowSelect = false,
  menuPosition = { x: 0, y: 0 },
  addRow = () => {},
  addColumn = () => {},
}) => {
  let options = [...ColumnOptions];

  if (isRowSelect) {
    options = [...RowOptions];
  }

  function handleClick(index) {
    return () => {
      if (isRowSelect) {
        addRow({ addAbove: index === 0 });
      } else {
        addColumn({ addLeft: index === 0 });
      }
    };
  }

  return (
    <div
      className="context-menu"
      style={{ left: `${menuPosition.x}px`, top: `${menuPosition.y}px` }}
    >
      {options.map((o, index) => {
        return (
          <div
            className="content-menu-item"
            onClick={handleClick(index)}
            key={o}
          >
            {o}
          </div>
        );
      })}
    </div>
  );
};

export default ContextMenu;
