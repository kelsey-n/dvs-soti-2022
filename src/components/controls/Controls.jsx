import { useState } from 'react';

function Controls({ sort, setSort, sortOptions }) {
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
    </div>
  );
}

export default Controls;
