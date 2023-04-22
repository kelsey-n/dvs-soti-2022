import { useState } from 'react';

function Controls({
  sort,
  setSort,
  sortOptions,
  ringWidth,
  setRingWidth,
  ringWidthOptions,
}) {
  const sortOptionsToLabel = {};
  return (
    <div>
      {/* Sort options within each ring  */}
      <form>
        <label htmlFor="sort-select">Sort each ring by </label>
        <select
          id="sort-select"
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
          }}
        >
          {Object.entries(sortOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </form>
      {/* Options to change ring width */}
      <form>
        <label htmlFor="ring-width-select">Determine ring width by </label>
        <select
          id="ring-width-select"
          value={ringWidth}
          onChange={(event) => {
            setRingWidth(event.target.value);
          }}
        >
          {Object.entries(ringWidthOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}

export default Controls;
