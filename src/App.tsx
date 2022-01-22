import { useState } from 'react'
import logo from './logo.svg'
import { AxisLeft, AxisBottom } from "@visx/axis";
import './App.css'
import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import { Label, Connector, CircleSubject, LineSubject, Annotation } from '@visx/annotation';
import data from "./data";
//const data = require('data');



function App() {
  const [count, setCount] = useState(0)

  const months = [
    "Mar 20",
    "Apr 20",
    "May 20",
    "Jun 20",
    "Jul 20",
    "Aug 20",
    "Sep 20",
    "Oct 20",
    "Nov 20",
    "Dec 20",
    "Jan 21",
    "Feb 21",
    "Mar 21",
    "Apr 21",
    "May 21",
    "Jun 21",
    "Jul 21",
    "Aug 21",
    "Sep 21",
    "Oct 21",
    "Nov 21",
    "Dec 21",
    "Jan 22",
  ]

  //set up consts for further planning
  const diagramWidth = 1000
  const diagramHeight = 500
  const margin = 60
  const percentageY = scaleLinear()
    .domain([0,1])
    .range([diagramHeight - margin, margin])
  const dateX = scaleBand()
    .domain(months)
    .range([margin, diagramWidth - margin])
  const workingArea = diagramWidth - margin - margin
  const increment = workingArea / data.length
  const workingHeight = diagramHeight - margin - margin
  let plotLine = ""
  let startLine = margin
  let instance1x = 0
  let instance1y = 0
  let instance2x = 0
  let instance2y = 0
  let instance3x = 0
  let instance3y = 0


  data.forEach((_row: any, i: number) => {
    //console.log(i)
    if (i == 0) {
      plotLine += "M " + startLine + " " + (440 - (workingHeight * data[i].inpatient_beds_utilization)) + " "
      startLine = startLine + increment
    } else {
      plotLine += "L " + startLine + " " + (440 - (workingHeight * data[i].inpatient_beds_utilization)) + " "
      startLine = startLine + increment
    }

    if (i == 67){
      instance1x = startLine
      instance1y = (440 - (workingHeight * data[i].inpatient_beds_utilization))
    } else if (i == 147){
      instance2x = startLine
      instance2y = (440 - (workingHeight * data[i].inpatient_beds_utilization))
    } else if (i == 388) {
      instance3x = startLine
      instance3y = (440 - (workingHeight * data[i].inpatient_beds_utilization))
    }


    //console.log(row.inpatient_beds_utilization)
  })

 //console.log(plotLine)
//<path fill="none" stroke="black" strokeWidth={1} d="M 60 300 L 120 350 L 200 60 L 940 150"/>

//Draw order is always top to bottom in an SVG.
  return (
    <div className="App">

      <svg width={diagramWidth} height={diagramHeight} style={{border: "1px solid black"}}>
        <AxisLeft strokeWidth={1} left={margin} scale={percentageY} />
        <AxisBottom strokeWidth={1} top={diagramHeight - margin} left={0} scale={dateX} tickValues={months}/>

        <text x="-400" y="25" transform="rotate(-90)" fontSize={12}>
            Hospital Utilization (%)
          </text>

        <text x="100" y="480" fontSize={12}>
          Date of Report
        </text>

        <path fill="none" stroke="black" strokeWidth={1} d={plotLine}/>


        <Annotation
          x={instance1x}
          y={instance1y}
          dx={50} // x offset of label from subject
          dy={50} // y offset of label from subject
          >
          <Connector />
          <CircleSubject />
          <Label title="Start of WA Reopening Plan" subtitle="Announcement of 4 step reopening plan for Washington" />
          </Annotation>


          <Annotation
          x={instance2x}
          y={instance2y}
          dx={50} // x offset of label from subject
          dy={-30} // y offset of label from subject
          >
          <Connector />
          <CircleSubject />
          <Label title="Increased Restriction" subtitle="Announcement of restrictions and expansion of mask orders" />
          </Annotation>

          <Annotation
          x={instance3x}
          y={instance3y}
          dx={50} // x offset of label from subject
          dy={50} // y offset of label from subject
          >
          <Connector />
          <CircleSubject />
          <Label title="Phase 3" subtitle="Move to increase reopening of Washington state" />
          </Annotation>

      </svg>

      <h2>Assignment 1: Hospital Utilization for Washington</h2>
      <p>
        This graph utilizes 2 years of historical hospital data from the state of Washington, 
        showing how full hosptials were throughout the pandemic. Attached to some of these points
        are also major implementations of policy by the US Federal Government, highlighting the 
        potential impact that some of these wider policies might have had on the hospitalization
        rate, which has often been touted as the most important factor and consequence to avoid
        from a spike in infections. 
      </p>
      <p>
        The graph's design is chosen with the intent of maximizing the data ink present on the page;
        the graph is kept simple with the only additional markers on the line used to add important
        contextual information about the various points of time where policy took place, and nothing
        more. The overall intention is to demonstrate the impacts of policy on a key metric valued
        by virology and public health professionals, and the selection and display of the data is all
        dedicated to serving that vital message.
      </p>
      <p>
        An initial exploratory analysis of the graph yielded some very interesting results, which are 
        visible in the graph. There appears to be a very consistent movement in hospitalization up
        and down throughout the graph, which upon closer inspection yielded the curious result that 
        increases happened in the weekdays of a week, and dips happened towards the end of weekends. 
        That area would be of interest in further analysis. 
      </p>
      <p>
        Plotted with the other graphs are a selection of major events that unfolded in Washington state.
        These include the time the 4-stage reopening plan was announced, the time significant lockdowns
        were brought back into effect, and the time that a major phase was shifted towards reopening.
        As can be seen from the plots, these decisions were often reflective of the condition of the state
        at the time, with reopenings considered in times of lulls and extra restrictions in times where 
        large spikes in demand occurred. 
      </p>
      {/* 

      <svg width="500" height="500" style={{border: "1px solid black"}}>

        {[5, 20, 30, 50].map((num, i) => {
          return <circle cx={50 + i * 100} cy={60} r={num}
           fill={`rgb(${num * 3},${num * 2 + 90}, ${num * 5})`}/>;
        })}
        {[5, 20, 30, 50].map((num, i) => {
          const rectWidth = 40;

          return <rect transform={`rotate(${num}, ${30 + i * 120}, ${200})`}
           x={30 + i * 120} y={200} width={rectWidth} height={10} fill={`rgb(0,${num * 2 + 90},0)`} />;
        })}


        {[5, 20, 30, 50].map((num, i) => {
          const rectWidth = 40;

          return <line 
                  x1={30}
                  y1={300 + i * 15}
                  x2={10 + num * 5}
                  y2={300 + i * 15}
                  fill="black"
                  stroke={"black"} />;
        })}


        {[5, 20, 30, 50].map((num, i) => {
          const rectWidth = 40;

          return <text x={30} y={300 + i * 15} textAnchor="end">
            {num}
          </text>;
        })}


      </svg>

      <h1>Hello World</h1>
      <p>{false ? "foo" : "bar"}</p>

      <svg width="500" height="500" style={{ border: "1px solid pink"}}>
        {[10, 20, 50, 200].map((d) => {
          console.log(d + " is a datapoint.");
        })}
        {[10, 20, 50, 200].map((d) => {
          return <circle
          cx="50"
          cy={d}
          r="5"
          fill="black"
          />;
        })}

        <circle
        cx="50"
        cy="50"
        r="20"
        fill="black"
        />
        <line 
        x1={50} 
        y1={50} 
        x2={200} 
        y2={200} 
        stroke="black" />
        <text x="100" y="100"></text>
      </svg>


      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
      */}

    </div>
  )
}

export default App
