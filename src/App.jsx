import { useEffect, useState, useRef } from 'react';
import { useScroll, animated, useSpring } from 'react-spring';
import Viz from './components/vis/Viz';
import Controls from './components/controls/Controls';
import './App.css';
import { introText } from './constants';

const sortOptions = {
  toolName: 'tool name',
  toolUsage: 'tool usage',
  absGrowth: 'growth (# users)',
  percGrowthUsers: 'growth (% respondents)',
};
const ringWidthOptions = {
  meanPerTool: 'users of this tool',
  meanPerYear: 'all respondents of this year',
};
const ringPositionOptions = {
  totalUsage: 'total usage per year',
  // totalRespondents: 'total respondents per year',
  year: 'years',
};

const controlsWidth = 182;

// MOVE????
let rootDiv = document.querySelector('#root');
rootDiv.style.height = `${window.innerHeight * 2}px`; // CALCULATE THIS PROPERLY??? BASED ON RESPONSIVENESS OF SVG TOO

function App() {
  const [sort, setSort] = useState('toolUsage');
  const [ringWidth, setRingWidth] = useState('meanPerTool');
  const [ringPosition, setRingPosition] = useState('totalUsage');
  const [topNumTools, setTopNumTools] = useState(40);
  const [userInput, setUserInput] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth - controlsWidth, // TOOOOOOOOOOOOO DOOOOOOOOOOOOOOOOOOOOOO: DYNAMICALLY GET WIDTH OF SIDE MENU (OR JUST PUT THE FINAL WIDTH IN HERE)
    height: window.innerHeight,
  });
  const [svgSize, setSvgSize] = useState(
    Math.min(dimensions.width, dimensions.height)
  );

  // Measure the size of the browser
  useEffect(() => {
    window.addEventListener('resize', () => {
      setDimensions({
        width: window.innerWidth - controlsWidth,
        height: window.innerHeight,
      });
      setSvgSize(
        Math.min(window.innerWidth - controlsWidth, window.innerHeight)
      );
    });
  }, []);

  // Transition Controls in when we scroll to the bottom of the page
  const [controlStyles, controlAPI] = useSpring(() => ({
    opacity: 0,
  }));

  const { scrollYProgress } = useScroll({
    // container: document.querySelector('#root'),
    onChange: ({ value: { scrollYProgress } }) => {
      if (scrollYProgress > 0.98) {
        controlAPI.start({
          opacity: 1,
          delay: 200,
          config: { duration: 1200 },
        });
      } else {
        controlAPI.start({ opacity: 0, immediate: true });
      }
    },
    default: {
      immediate: true,
    },
  });

  return (
    <>
      <div className="intro-text">{introText}</div>
      <animated.div
        className="app-wrapper"
        style={{
          // formula to map original_value from [0, 1] to [min, max]:
          // mapped_value = (max - min) * original_value + min
          filter: scrollYProgress.to((val) => `blur(${10 - val * 10}px)`),
          transform: scrollYProgress.to(
            (val) =>
              `translate(${
                (-window.innerWidth / 2) * val + window.innerWidth / 2
              }px, ${
                (window.innerHeight + svgSize / 2) * val - svgSize / 2
              }px) rotate(${-90 * val + 90}deg)`
          ),
          pointerEvents: scrollYProgress.to((val) =>
            val < 0.98 ? 'none' : ''
          ),
        }}
      >
        <div>
          <animated.div style={controlStyles}>
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
          </animated.div>
        </div>
        <Viz
          sort={sort}
          ringWidth={ringWidth}
          ringPosition={ringPosition}
          topNumTools={topNumTools}
          userInput={userInput}
          width={dimensions.width}
          height={dimensions.height}
        />
      </animated.div>
    </>
  );
}

export default App;
