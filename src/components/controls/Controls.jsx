import { useState } from 'react';

function Controls({
  sort,
  setSort,
  sortOptions,
  ringWidth,
  setRingWidth,
  ringWidthOptions,
  ringPosition,
  setRingPosition,
  ringPositionOptions,
  topNumTools,
  setTopNumTools,
  setUserInput,
}) {
  return (
    <div>
      {/* Sort arcs within each ring  */}
      <form>
        <label htmlFor="sort-select">Sort each ring by </label>
        <select
          id="sort-select"
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            setUserInput('sort');
          }}
        >
          {Object.entries(sortOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </form>
      {/* Change ring width */}
      <form>
        <label htmlFor="ring-width-select">
          Ring width corresponds to average # tools used by
        </label>{' '}
        <select
          id="ring-width-select"
          value={ringWidth}
          onChange={(event) => {
            setRingWidth(event.target.value);
            setUserInput('ringWidth');
          }}
        >
          {Object.entries(ringWidthOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </form>
      {/* Change ring position */}
      <form>
        <label htmlFor="ring-position-select">Position rings by</label>
        <select
          id="ring-position-select"
          value={ringPosition}
          onChange={(event) => {
            setRingPosition(event.target.value);
            setUserInput('ringPosition');
          }}
        >
          {Object.entries(ringPositionOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </form>
      {/* Change top number of tools shown */}
      <form>
        <label htmlFor="num-tools-select">Show top x tools</label>
        <select
          id="num-tools-select"
          value={topNumTools}
          onChange={(event) => {
            setTopNumTools(event.target.value);
            setUserInput('numTools');
          }}
        >
          <option value={40}>40</option>
          <option value={30}>30</option>
          <option value={20}>20</option>
        </select>
      </form>
    </div>
  );
}

export default Controls;
