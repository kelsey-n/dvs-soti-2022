import { useState } from 'react';
import Viz from './components/vis/Viz';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import data from './assets/mergedOutputAllYears_v6.csv';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Viz />
    </>
  );
}

export default App;
