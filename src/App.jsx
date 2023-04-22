import { useState } from 'react';
import Viz from './components/vis/Viz';
import Controls from './components/controls/Controls';
import data from './assets/mergedOutputAllYears_v6.csv';
import './App.css';

const sortOptions = { toolName: 'tool name', toolUsage: 'tool usage' };

function App() {
  const [sort, setSort] = useState('toolUsage');

  return (
    <div className="app-wrapper">
      <Controls sort={sort} setSort={setSort} sortOptions={sortOptions} />
      <Viz sort={sort} />
    </div>
  );
}

export default App;
