import { useEffect, useState, useRef } from 'react';
import { useScroll, animated, useSpring } from 'react-spring';
import Viz from './components/vis/Viz';
import Controls from './components/controls/Controls';
import './App.css';
import { introText } from './constants';
import { min } from 'd3';

const sortOptions = {
  toolName: 'tool name',
  toolUsage: 'tool usage',
  absGrowth: 'growth (# users)',
  percGrowthUsers: 'growth (% respondents)',
};
const ringPositionOptions = {
  totalUsage: 'total usage per year',
  // totalRespondents: 'total respondents per year',
  year: 'years',
};
// NOT USING
const ringWidthOptions = {
  meanPerTool: 'users of this tool',
  meanPerYear: 'all respondents of this year',
};

// MOVE????
let rootDiv = document.querySelector('#root');
rootDiv.style.height = `${window.innerHeight * 2}px`; // CALCULATE THIS PROPERLY??? BASED ON RESPONSIVENESS OF SVG TOO

function App() {
  const [sort, setSort] = useState('toolUsage');
  const [ringWidth, setRingWidth] = useState('meanPerTool');
  const [ringPosition, setRingPosition] = useState('totalUsage');
  const [topNumTools, setTopNumTools] = useState(40);
  const [userInput, setUserInput] = useState(null);

  const [mobile, setMobile] = useState(
    window.innerHeight > window.innerWidth ? true : false
  );

  const controlsWidth = mobile ? 0 : min([450, window.innerWidth / 3]);
  const controlsElem = document.querySelector('.controls-wrapper-parent');
  const controlsHeight = mobile ? 244 : 0;

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth - controlsWidth,
    height: window.innerHeight - controlsHeight,
  });
  const [svgSize, setSvgSize] = useState(
    Math.min(dimensions.width, dimensions.height)
  );

  useEffect(() => {
    window.addEventListener('resize', () => {
      setMobile(window.innerHeight > window.innerWidth ? true : false);
    });
  }, []);

  useEffect(() => {
    if (!mobile || !controlsElem) return;
    // const controls = document.querySelector('.controls-wrapper-parent');
    console.log(controlsElem.offsetHeight);
  }, [controlsElem, mobile]);

  // Measure the size of the browser relative to controls width
  useEffect(() => {
    window.addEventListener('resize', () => {
      // Add in here check for if width > height: set width/height minus controls width (or height??? maybe doesn't matter )
      // setControlsWidth(mobile ? 0 : min([450, window.innerWidth / 3]));
      setDimensions({
        width:
          window.innerWidth - (mobile ? 0 : min([450, window.innerWidth / 3])),
        height: window.innerHeight - (mobile ? 244 : 0),
      });
      setSvgSize(
        Math.min(
          window.innerWidth - (mobile ? 0 : min([450, window.innerWidth / 3])),
          window.innerHeight - (mobile ? 244 : 0)
        )
      );
    });
  }, [mobile]);

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
        className={`app-wrapper ${mobile ? 'mobile' : ''}`}
        style={{
          // formula to map original_value from [0, 1] to [min, max]:
          // mapped_value = (max - min) * original_value + min
          //filter: scrollYProgress.to((val) => `blur(${10 - val * 10}px)`),
          transform: scrollYProgress.to(
            (val) =>
              `translate(${
                0 //window.innerWidth / 2 //(-window.innerWidth / 2) * val + window.innerWidth / 2
              }px, ${
                0 //(window.innerHeight + svgSize / 2) * val - svgSize / 2
              }px)` // rotate(${-90 * val + 90}deg)`
          ),
          pointerEvents: scrollYProgress.to((val) =>
            val < 0.98 ? 'none' : ''
          ),
        }}
      >
        <div className="controls-wrapper-parent">
          {/* <animated.div style={controlStyles}> */}
          <animated.div>
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
          ringPosition={ringPosition}
          topNumTools={topNumTools}
          userInput={userInput}
          width={dimensions.width}
          height={dimensions.height}
          svgSize={svgSize}
        />
      </animated.div>
    </>
  );
}

export default App;
