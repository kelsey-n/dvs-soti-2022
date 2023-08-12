import { useEffect, useState, useRef } from 'react';
import { useScroll, animated, useSpring, useSprings } from 'react-spring';
import Viz from './components/vis/Viz';
import Controls from './components/controls/Controls';
import './App.css';
import './modal.css';
import { min } from 'd3';
import MicroModal from 'micromodal';

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
  MicroModal.init({ disableScroll: true });
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
      ? 283 + 70 + 80
      : 244 + 70 + 70
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

  // Animated rings
  const animatedRingProps = useSpring({
    config: {
      duration: 5000,
    },
    from: { y: window.innerHeight - 30 },
    to: { y: -30 },
    // loop: true,
  });

  return (
    <>
      {/* {range(0, 5).map((d) => {
        const widthHeight = randomIntFromInterval(25, 200);
        return (
          <animated.span
            key={d}
            className="animated-ring"
            style={{
              borderRadius: '50%',
              position: 'absolute',
              width: `${widthHeight}px`,
              height: `${widthHeight}px`,
              border: '2px solid white',
              x: `${randomIntFromInterval(
                -window.innerWidth / 2,
                window.innerWidth / 2
              )}px`,
              ...animatedRingProps,
            }}
          ></animated.span>
        );
      })} */}
      <animated.div className="intro-wrapper" style={introTextStyles}>
        <div className="title">
          Evolution of data viz tools
          {/* <span style={{ fontSize: '16px' }}>(2017 - 2022)</span> */}
        </div>
        <div className="intro-text">
          <div className="left-align">
            This visualization (about the tools used <em>for</em> data
            visualization) shows the evolution of this flourishing industry.
            Growth in the field is evident by the increase in respondents to the
            Data Visualization Society's{' '}
            <a
              href="https://www.datavisualizationsociety.org/survey"
              target="_blank"
              rel="noopener noreferrer"
            >
              industry survey
            </a>
            , as well as the diversity of tools used by data viz practitioners.
            In 2017, most tools used were coding-heavy ones, like D3, ggplot,
            Python and R. But by 2022, we see a more diverse field of tools
            including: tools not traditionally used for data viz (e.g.
            Powerpoint); design tools (e.g. Figma and Illustrator); and online
            data viz platforms (e.g. RAWGraphs and Flourish).
          </div>
          <br></br>
          <em>Let's meet some of the notable players in this field:</em>
          <br></br>
          <br></br>
          {/* </div> */}
          <div className="">
            <div className="grid-container">
              <div className="grid-child">
                <div className="grid-child-heading" id="rising-stars">
                  All-stars
                </div>
                Large growth, 1000+ users<br></br>
                <em>Powerpoint, Pen and paper, Power BI</em>
              </div>
              <div className="grid-child">
                <div className="grid-child-heading" id="emerging-talent">
                  Emerging talent
                </div>
                Large growth, less than 450 users<br></br>
                <em>Google Sheets, Figma, RAWGraphs</em>
              </div>
              <div className="grid-child">
                <div className="grid-child-heading" id="veterans">
                  Veterans
                </div>
                Small growth/shrinkage, 2000+ users<br></br>
                <em>Excel, Tableau, R</em>
              </div>
              <div className="grid-child">
                <div className="grid-child-heading" id="slump-phase">
                  Slump phase
                </div>
                Large shrinkage, 2000+ users<br></br>
                <em>D3, ggplot/ggplot2, Python/Pandas</em>
              </div>
            </div>
          </div>
          <br></br>
          See for yourself - <em>happy exploring!</em>
        </div>
        {/* <div className="intro-text">
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
        </div> */}
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
      <div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
        <div class="modal__overlay" tabindex="-1" data-micromodal-close>
          <div
            class="modal__container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-1-title"
          >
            <header class="modal__header">
              <h2 class="modal__title" id="modal-1-title">
                How to read this viz
              </h2>
              <button
                class="modal__close"
                aria-label="Close modal"
                data-micromodal-close
              ></button>
            </header>
            <main class="modal__content left-align" id="modal-1-content">
              {/* From 2017 to 2022, the Data Visualization Society has conducted an
              annual{' '}
              <a
                href="https://www.datavisualizationsociety.org/survey"
                target="_blank"
                rel="noopener noreferrer"
              >
                State of the Industry survey
              </a>
              . Its purpose is to record & understand the changing status of
              this blossoming field by asking practitioners various questions
              related to their work. The visualization below focuses
              specifically on the tools that respondents use for Data
              Visualization, and allows users to explore the data with several
              views. For clarity, the tools shown are only those with 30+ total
              users (250+ on mobile).
              <br></br>
              <br></br>
              <br></br>
              <b>BASICS TO UNDERSTAND THIS VISUALIZATION</b> */}
              Each ring represents a single year's data on the
              tools/technologies survey respondents use to visualize data.
              <br></br>
              <br></br>
              The angle of each colored arc represents the proportional usage of
              a specific tool (# of tool users / total users). Note, it is the
              angle and not the arc length that represents this value.
              <br></br>
              <br></br>
              There are two methods of sorting. The first sorts tools within
              years, with options to sort by tool name, tool usage, and tool
              growth (measured either by # of users or % of respondents). These
              views allow you to explore what tools are used each year and how
              their usage trends over time.
              <br></br>
              <br></br>
              The second method sorts rings by year or by sample size (i.e.
              sample size did not always increase every year). When sorting by
              sample size, the circumference of each ring is proportional to the
              sample size of that year. However, when sorting by year, the
              circumference represents the year, so the width of each ring
              becomes proportional to its sample size.
              <br></br>
              <br></br>
              <span style={{ 'font-size': '13px' }}>
                Data was sourced from the Data Visualization Society's{' '}
                <a
                  href="https://www.datavisualizationsociety.org/survey"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  State of the Industry survey
                </a>
                . For clarity, the tools shown are only those with 30+ total
                users (250+ on mobile).
              </span>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
