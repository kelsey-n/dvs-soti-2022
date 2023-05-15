import { useRef, useState } from 'react';

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
    <div className="controls-wrapper">
      {/* Sort arcs within each ring  */}
      <div className="button-group">
        <p>Find patterns within & across years!</p>
        <div>
          {Object.entries(sortOptions).map(([value, label]) => (
            <button
              key={value}
              value={value}
              onClick={(event) => {
                setSort(event.target.value);
                setUserInput('sort');
              }}
              className={sort === value ? 'active' : null}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* Change ring position */}
      <div className="button-group">
        <p>Order rings by:</p>
        <div>
          {Object.entries(ringPositionOptions).map(([value, label]) => (
            <button
              key={value}
              value={value}
              onClick={(event) => {
                setRingPosition(event.target.value);
                setUserInput('ringPosition');
              }}
              className={ringPosition === value ? 'active' : ''}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="tip-text">
        Tip: Click any arc to focus on a single tool across views! Click
        background to clear.
      </div>
      {/* Change ring width */}
      {/* <form>
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
      </form> */}
      {/* Change top number of tools shown */}
      {/* <form>
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
      </form> */}
    </div>
  );
}

export default Controls;
