import { useState } from 'react';
import Viz from './components/vis/Viz';
import Controls from './components/controls/Controls';
import data from './assets/mergedOutputAllYears_v6.csv';
import './App.css';

const sortOptions = { toolName: 'tool name', toolUsage: 'tool usage' };
const ringWidthOptions = {
  meanPerTool: 'users of this tool',
  meanPerYear: 'all respondents of this year',
};
const ringPositionOptions = {
  totalUsage: 'users of this tool',
  totalRespondents: 'all respondents of this year',
};

function App() {
  const [sort, setSort] = useState('toolUsage');
  const [ringWidth, setRingWidth] = useState('meanPerTool');
  const [ringPosition, setRingPosition] = useState('totalUsage');
  const [topNumTools, setTopNumTools] = useState(40);
  const [userInput, setUserInput] = useState(null);

  return (
    <div className="app-wrapper">
      <Controls
        sort={sort}
        setSort={setSort}
        sortOptions={sortOptions}
        ringWidth={ringWidth}
        setRingWidth={setRingWidth}
        ringWidthOptions={ringWidthOptions}
        ringPosition={ringPosition}
        setRingPosition={setRingPosition}
        ringPositionOptions={ringPositionOptions}
        topNumTools={topNumTools}
        setTopNumTools={setTopNumTools}
        setUserInput={setUserInput}
      />
      <Viz
        sort={sort}
        ringWidth={ringWidth}
        ringPosition={ringPosition}
        topNumTools={topNumTools}
        userInput={userInput}
      />
    </div>
  );
}

export default App;
