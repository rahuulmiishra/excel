import { memo } from "react";

import { CellType } from "../../constant";

import "./style.css";

const Cell = ({ value, type, id, outerIndex, innerIndex, onInput }) => {
  function handleInput(e) {
    const value = e?.target?.value;
    onInput({ value, outerIndex, innerIndex });
  }

  if (type === CellType.COL) {
    return (
      <HeaderCell
        value={value}
        id={id}
        outerIndex={outerIndex}
        innerIndex={innerIndex}
      />
    );
  } else if (type === CellType.ROW) {
    return (
      <RowCell
        value={value}
        id={id}
        outerIndex={outerIndex}
        innerIndex={innerIndex}
      />
    );
  } else if (type === CellType.DUMMY) {
    return <DummyCell />;
  } else {
    return (
      <div className="info-label">
        <input
          onInput={handleInput}
          className="input-cell"
          type="text"
          value={value}
        />
      </div>
    );
  }
};

const HeaderCell = memo(({ value, outerIndex, innerIndex }) => {
  return (
    <div
      data-outer-index={outerIndex}
      data-inner-index={innerIndex}
      data-cell-type={CellType.COL}
      className="header-cell"
    >
      {value}
    </div>
  );
});

const RowCell = memo(({ value, outerIndex, innerIndex }) => {
  return (
    <div
      data-outer-index={outerIndex}
      data-inner-index={innerIndex}
      data-cell-type={CellType.ROW}
      className="row-cell"
    >
      {value}
    </div>
  );
});

const DummyCell = memo(() => {
  return <div className="dummy-cell" />;
});

export default memo(Cell);
