import { useEffect, useState, useRef } from 'react';
import { useScroll, animated, useSpring } from 'react-spring';
import Viz from './components/vis/Viz';
import Controls from './components/controls/Controls';
import './App.css';
import { howToRead, howToReadText, introText } from './constants';
import { min } from 'd3';

const sortOptions = {
  toolName: 'tool name',
  toolUsage: 'tool usage',
  absGrowth: 'growth (# users)',
  percGrowthUsers: 'growth (% respondents)',
};
const ringPositionOptions = {
  totalUsage: 'sample size', // 'total usage per year',
  // totalRespondents: 'total respondents per year',
  year: 'years',
};
// NOT USING
const ringWidthOptions = {
  meanPerTool: 'users of this tool',
  meanPerYear: 'all respondents of this year',
};

function App() {
  const controlsRef = useRef();

  // Set root height to double page height to allow for scroll effect
  let rootDiv = document.querySelector('#root');
  rootDiv.style.height = `${window.innerHeight * 2}px`;

  const [sort, setSort] = useState('toolUsage');
  const [ringWidth, setRingWidth] = useState('meanPerTool');
  const [ringPosition, setRingPosition] = useState('year');
  const [topNumTools, setTopNumTools] = useState(40);
  const [userInput, setUserInput] = useState(null);
  const [clickedTool, setClickedTool] = useState(null);

  const [mobile, setMobile] = useState(
    window.innerHeight > window.innerWidth ? true : false
  );

  const controlsWidth = mobile ? 0 : min([450, window.innerWidth / 3]);
  const controlsHeight = mobile
    ? window.innerWidth < 415
      ? 283 + 70
      : 244 + 70
    : 0; // not best way to do this

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth - controlsWidth,
    height: window.innerHeight - controlsHeight,
  });

  useEffect(() => {
    window.addEventListener('resize', () => {
      setMobile(window.innerHeight > window.innerWidth ? true : false);
    });
  }, []);

  // Measure the size of the browser relative to controls width & height
  useEffect(() => {
    window.addEventListener('resize', () => {
      setDimensions({
        width:
          window.innerWidth - (mobile ? 0 : min([450, window.innerWidth / 3])),
        height:
          window.innerHeight -
          (mobile ? (window.innerWidth < 415 ? 283 + 70 : 244 + 70) : 0),
      });
    });
  }, [mobile]);

  // Transition Controls in when we scroll to the bottom of the page
  const [controlStyles, controlAPI] = useSpring(() => ({
    opacity: 0,
  }));
  // Transition Intro text out in when we scroll to the bottom of the page
  const [introTextStyles, introTextAPI] = useSpring(() => ({
    opacity: 1,
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
        introTextAPI.start({
          opacity: 0,
          immediate: true,
        });
      } else {
        controlAPI.start({ opacity: 0, immediate: true });
        introTextAPI.start({ opacity: 1, immediate: true });
      }
    },
    default: {
      immediate: true,
    },
  });

  // Clear clicked tool on click of controls container
  const resetClickedTool = (event) => {
    if (event.target === controlsRef.current) setClickedTool(null);
  };

  return (
    <>
      <animated.div className="intro-wrapper" style={introTextStyles}>
        <div className="title">
          Evolution of Data Viz Tools{' '}
          <span style={{ fontSize: '16px' }}>(2017 - 2022)</span>
        </div>
        <div className="intro-text">
          From 2017 to 2022, the Data Visualization Society has conducted an
          annual{' '}
          <a
            href="https://www.datavisualizationsociety.org/survey"
            target="_blank"
            rel="noopener noreferrer"
          >
            State of the Industry survey
          </a>
          . Its purpose is to record & understand the changing status of this
          blossoming field by asking practitioners various questions related to
          their work. The visualization below focuses specifically on the tools
          that respondents use for Data Visualization, and allows users to
          explore the data with several views. For clarity, the tools shown are
          only those with 30+ total users (250+ on mobile).
          <br></br>
          <br></br>
          <br></br>
          <b>BASICS TO UNDERSTAND THIS VISUALIZATION</b>
          <br></br>
          Each ring represents a single year's data on the tools/technologies
          survey respondents use to visualize data.
          <br></br>
          <br></br>
          The angle of each colored arc represents the proportional usage of a
          specific tool (# of tool users / total users). Note, it is the angle
          and not the arc length that represents this value.
          <br></br>
          <br></br>
          There are two methods of sorting. The first sorts tools within years,
          with options to sort by tool name, tool usage, and tool growth
          (measured either by # of users or % of respondents). These views allow
          you to explore what tools are used each year and how their usage
          trends over time.
          <br></br>
          <br></br>
          The second method sorts rings by year or by sample size (i.e. sample
          size did not always increase every year). When sorting by sample size,
          the circumference of each ring is proportional to the sample size of
          that year. However, when sorting by year, the circumference represents
          the year, so the width of each ring becomes proportional to its sample
          size.
          <br></br>
          <br></br>
          <em>Happy exploring!</em>
        </div>
      </animated.div>
      <animated.div
        className={`app-wrapper ${mobile ? 'mobile' : ''}`}
        style={{
          // formula to map original_value from [0, 1] to [min, max]:
          // mapped_value = (max - min) * original_value + min
          filter: scrollYProgress.to((val) => `blur(${10 - val * 10}px)`),
          transform: scrollYProgress.to((val) =>
            !mobile
              ? `translate(${
                  (-dimensions.width / 1.5) * val + dimensions.width / 1.5
                }px, ${
                  (window.innerHeight + dimensions.height / 1.5) * val -
                  dimensions.height / 1.5
                }px) rotate(${-90 * val + 90}deg)`
              : `translate(${
                  (-dimensions.width / 1.5) * val + dimensions.width / 1.5
                }px, ${
                  (window.innerHeight +
                    controlsHeight +
                    dimensions.height / 3) *
                    val -
                  controlsHeight -
                  dimensions.height / 3
                }px) rotate(${-90 * val + 90}deg)`
          ),
          pointerEvents: scrollYProgress.to((val) =>
            val < 0.98 ? 'none' : ''
          ),
        }}
      >
        <div
          ref={controlsRef}
          className="controls-wrapper-parent"
          onClick={resetClickedTool}
        >
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
              setClickedTool={setClickedTool}
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
          clickedTool={clickedTool}
          setClickedTool={setClickedTool}
        />
      </animated.div>
    </>
  );
}

export default App;
