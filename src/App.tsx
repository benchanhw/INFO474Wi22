import { useState } from 'react'
import logo from './logo.svg'
import { AxisLeft, AxisBottom } from "@visx/axis";
import './App.css'
import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import { Label, Connector, CircleSubject, LineSubject, Annotation } from '@visx/annotation';
import data from "./data";
import data2 from "./data2";
import data_tag from "./tagged_data";
import hosp_util from "./hosp_util";
import covid_util from "./covid_util";
import * as d3 from "d3";
import { stringify } from 'querystring';
//const data = require('data');



function App() {
  const [count, setCount] = useState(150)

  const dayNames = [ "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th",
  "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd",
  "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"]

  const months = [
    "Mar 2020",
    "Apr 2020",
    "May 2020",
    "Jun 2020",
    "Jul 2020",
    "Aug 2020",
    "Sep 2020",
    "Oct 2020",
    "Nov 2020",
    "Dec 2020",
    "Jan 2021",
    "Feb 2021",
    "Mar 2021",
    "Apr 2021",
    "May 2021",
    "Jun 2021",
    "Jul 2021",
    "Aug 2021",
    "Sep 2021",
    "Oct 2021",
    "Nov 2021",
    "Dec 2021",
    "Jan 2022",
  ]

  const dateMonth = [
    "03/01/2020",
    "04/01/2020",
    "05/01/2020",
    "06/01/2020",
    "07/01/2020",
    "08/01/2020",
    "09/01/2020",
    "10/01/2020",
    "11/01/2020",
    "12/01/2020",
    "01/01/2021",
    "02/01/2021",
    "03/01/2021",
    "04/01/2021",
    "05/01/2021",
    "06/01/2021",
    "07/01/2021",
    "08/01/2021",
    "09/01/2021",
    "10/01/2021",
    "11/01/2021",
    "12/01/2021",
    "01/01/2022",
  ]

  const states = [
    "AK",
    "AL",
    "AR",
    "AS",
    "AZ",
    "CA",
    "CO",
    "CT",
    "DC",
    "DE",
    "FL",
    "GA",
    "HI",
    "IA",
    "ID",
    "IL",
    "IN",
    "KS",
    "KY",
    "LA",
    "MA",
    "MD",
    "ME",
    "MI",
    "MN",
    "MO",
    "MS",
    "MT",
    "NC",
    "ND",
    "NE",
    "NH",
    "NJ",
    "NM",
    "NV",
    "NY",
    "OH",
    "OK",
    "OR",
    "PA",
    "PR",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VA",
    "VI",
    "VT",
    "WA",
    "WI",
    "WV",
    "WY"
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
{/*
//assignment 1 plot
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
*/}
 
  

  const increment2 = workingArea / data2.length
  startLine = margin
  var lineplotUtil = [0]
  var lineplotCovid = [0]
  var stateTotal = {}
  var stateFill = {}
  var stateCovid = {}
  var stateHosp = {}

  //data by year
  var data2020 = [0]
  var data2021 = [0]

  //var dynamicFill = {}

  //var segmentTest = new Date("05/01/2021")
  //console.log(segmentTest.getMonth())




  //var cutoff = new Date("01/01/2021")


  for(let i = 0; i < states.length; i++) {
    stateTotal[states[i]] = 0 
    stateFill[states[i]] = 0 
    stateCovid[states[i]] = 0
    stateHosp[states[i]] = [0]
    //dynamicFill[states[i]] = [0,0,0,0,0,0,0,0,0,0,0,0]
  }

  //computation cycles two var
  for(let i = 0; i < data2.length; i++) {
    if (data2[i].inpatient_beds_utilization > 0) {
      lineplotUtil.push(startLine)
    } else {
      lineplotUtil.push(0)
    }

    if (data2[i].percent_of_inpatients_with_covid > 0) {
      lineplotCovid.push(startLine)
    } else {
      lineplotCovid.push(0)
    }

    startLine = startLine + increment2

    if(data2[i].inpatient_beds_utilization > 0) {
      stateFill[data2[i].state] += 1 
      stateHosp[data2[i].state].push(data2[i].inpatient_beds_utilization)
    } 
    if (data2[i].percent_of_inpatients_with_covid > 0) {
      stateCovid[data2[i].state] += 1 
    }

    stateTotal[data2[i].state] += 1
    
    var d1 = new Date(data2[i].date)
    var d2 = new Date("01/01/2021")

    if (d2 > d1) {
      if (data2[i].percent_of_inpatients_with_covid > 0) {
        data2020.push(data2[i].percent_of_inpatients_with_covid)
      }
    } else {
      if (data2[i].percent_of_inpatients_with_covid > 0) {
        data2021.push(data2[i].percent_of_inpatients_with_covid)
      }
    }
    

  }
  //var dataFill = data2.filter(record => record.date < cutoff)

  //remove the idle zero at the front. 
  for(let i = 0; i < states.length; i++) {
    stateHosp[states[i]].shift();
  }

  var stateWidth = workingArea / states.length
  var stateBar = [0]
  var fillPercent = [0]
  var fillCovid = [0]
  var stateMin = [0]
  var stateMax = [0]

  const stateX = scaleBand()
    .domain(states)
    .range([margin, diagramWidth - margin])

  const yearX = scaleLinear()
    .domain([0,1])
    .range([50, 950])

  //produce final percentages
  for(let i = 0; i < states.length; i++) {
    fillPercent[i] = (stateFill[states[i]] / stateTotal[states[i]])
    fillCovid[i] = (stateCovid[states[i]] / stateTotal[states[i]])
    stateBar[i] = margin + (stateWidth * (i))

    stateMin[i] = Number(d3.min(stateHosp[states[i]]))
    stateMax[i] = Number(d3.max(stateHosp[states[i]]))
  }

  //data by year

  //console.log(data2020)
  //console.log(stateMin)

  function filterMonth(item) {
    if(item.date_formatted == "Mar 2021") {
      return true
    }
    return false
  }

  const [dynamicDate, setDate] = useState("Mar 2021")

  console.log(dynamicDate)

  //viz 3, heatmapping it
  const dateHeight = workingHeight / 31
  var dataFill = data_tag.filter(record => record.date_formatted == String(dynamicDate))
  var finalHeat = [[0]]

  dataFill.forEach((row, i) => {
    let tempStore = [0]
    tempStore[0] = margin + (dateHeight * row.day) //date location
    tempStore[1] = margin + (stateWidth * row.statecode) //state location
    tempStore[2] = row.inpatient_beds_utilization //density

    finalHeat.push(tempStore)

  });

  const dayY = scaleBand()
    .domain(dayNames)
    .range([margin, diagramHeight - margin])

  const rangeColor = ["20%", "40%", "60%", "80%", "100%"]

  const rangeColorX = scaleBand()
  .domain(rangeColor)
  .range([0,150])


  finalHeat.shift();

  console.log(finalHeat)
{/*

dataFill.forEach((row, i) => {
    let tempStore = []
    dateLocY =
    stateLocX = 
  });



  for(let i = 0; i < data2.length; i++) {
    if (data[i].inpatient_beds_utilization > 0) {
      lineplotUtil.push(startLine)
    } else {
      lineplotUtil.push(0)
    }

    startLine = startLine + increment2
  }

  data2.forEach((_row: any, i: number) => {

    if (data[i].inpatient_beds_utilization > 0) {
      lineplotUtil.push(startLine)
    } else {
      lineplotUtil.push(0)
    }

    startLine = startLine + increment2

  })
*/}


 //console.log(plotLine)
//<path fill="none" stroke="black" strokeWidth={1} d="M 60 300 L 120 350 L 200 60 L 940 150"/>

{/*

    var minFare = d3.min(titanic, (passenger) => {
    return passenger.Fare;
  });

  var maxFare = d3.max(titanic, (passenger) => {
    return passenger.Fare;
  });

  const titanicChartWidth = 300;

  const fareScale = scaleLinear()
    .domain([minFare, maxFare])
    .range([0,200])



  //code content

  <h2>Titanic Dataset</h2>
      <div>
        <p>The titanic dataset contains {titanic.length} entries, each relating to a passenger.</p>
        <p>The lowest fare is {minFare} and the highest is {maxFare}</p>


        <svg width={titanicChartWidth} height={200} style={{border: "1px solid black"}}>
          {titanic.map((passenger, i) => {
            return <circle key={i} r={5} cx={fareScale(passenger.Fare + 20)} cy={20} style={{ fill:"none", stroke:"steelblue"}}></circle>;
          })}
          <AxisBottom strokeWidth={1} top={30-20} left={20} scale={fareScale} numTicks={3}/>

        </svg> 
        <svg width={1000} height={200} style={{border: "1px solid black"}}>
          {titanic.map((passenger, i) => {
              return <line key={i}
              x1={passenger.Fare + 100}
              y1={50}
              x2={passenger.Fare + 100}
              y2={100}
              strokeWidth={0.3}
              style={{ fill:"none", stroke:"rgba(0,0,0,0.1)"}}></line>;
            })}
        </svg>

        <svg width={1000} height={200} style={{border: "1px solid black"}}>
          {titanic.map((passenger, i) => {
            return <circle key={i} r={5} cx={passenger.Fare + 20} cy={Math.random() * (200 - 20) + 40} style={{ fill:"none", stroke:"steelblue"}}></circle>;
          })}
          <AxisBottom strokeWidth={1} top={30-20} left={20} scale={fareScale} numTicks={3}/>

        </svg> 
        
          
      </div>


*/}



//Draw order is always top to bottom in an SVG. {`rgba(0,0,0,${data[2]})`}

//when checking, anything that isnt in the list will have a location of -1.

  return (
    <div className="App">
      

      <h2>Assignment 3: Interactivity</h2>

      <p>
        The choice of using a heatmap for the visualization was intended to provide a more logical,
        and digestible way to manage and look through the very dense and detailed hospitalization
        data in the US in more visual formats. Thus, the over 30,000 rows of data have been broken down
        by state and day, with the user being allowed to select different months throughout the pandemic to
        view how the hospital utilization figures have varied over days and weeks for each state. The 
        heatmap has been kept monochromatic in the interests of keeping the visualization maximized in use
        of data ink, and since no significant encoding is intended using color, the chart instead focuses
        on monochrome data with emphasis on key, or differential in opacity to make contrasts more visible
        to the user. 
      </p>
      <p>
        In terms of the development process, I spent the most time in two zones; the data processing and 
        manipulation, and in the testing and decisions on the visualization medium. The most time by far
        was used in the data processing and manipulation. Since the data is so multi-dimensional and rich,
        it was rapidly discovered that my intended visualizations far exceeded the capacity for JS to handle. 
        Thus, after consultation and exploration, most of the data was analyzed using external software, and
        pre-coded to allow for more ready use in visualization without adding to client-side strain. There
        was also significant consideration spent towards considering how best to visualize this data at-a-glance,
        since such a wide spectrum of numbers would be overfitted by using simpler measures like pie charts or 
        histogram binning. Thus, more visual features like heatmaps and line charts were considered and used. 
      </p>
      <svg width={diagramWidth} height={diagramHeight} style={{border: "1px solid black"}}>

        {finalHeat.map((data, i) => {
                return <rect
                 x={data[1]}
                 y={data[0]}
                width= {stateWidth}
                height= {dateHeight} 
                fill={`rgba(0,0,0,${data[2]})`}></rect>

            })}

        <rect x="750" y="30" width="30" height="15" fill="rgba(0,0,0,0.2)"></rect>
        <rect x="780" y="30" width="30" height="15" fill="rgba(0,0,0,0.4)"></rect>
        <rect x="810" y="30" width="30" height="15" fill="rgba(0,0,0,0.6)"></rect>
        <rect x="840" y="30" width="30" height="15" fill="rgba(0,0,0,0.8)"></rect>
        <rect x="870" y="30" width="30" height="15" fill="rgba(0,0,0,1)"></rect>

      <text x="400" y="40" fontSize={16}>
          Hospital Utilization %, {dynamicDate}
        </text>

        <text x="-400" y="25" transform="rotate(-90)" fontSize={14}>
            Day of Month
          </text>

        <text x="80" y="490" fontSize={14}>
          State
        </text>

        <text x="800" y="20" fontSize={14}>
          Legend
        </text>
        <AxisBottom strokeWidth={1} top={45} left={750} scale={rangeColorX} tickValues={rangeColor}/>


        <AxisLeft strokeWidth={1} left={margin + 17} top={11} scale={dayY} tickValues={dayNames} />
        <AxisBottom strokeWidth={1} top={diagramHeight - margin + 12} left={16} scale={stateX} tickValues={states}/>
      </svg>

      <p>Select a month to display hospital utilization data.</p>


      <div>
        {months.map((month, i) => {
          return (
            <button style={{ marginRight:25, marginBottom:10 }} onClick={() => setDate(month)}>{month}</button>
          )
        })}
      </div>

      <br></br>
      {/*

      <div>
        {months.map((month, i) => {
          return (
            <>
              <input
                key={i}
                type="radio"
                id={month}
                name={month}
                checked={selectedCities.indexOf(city) > -1}
                onChange={() => {
                  if (selectedCities.indexOf(city) === -1) {
                    setSelectedCities(selectedCities.slice(0).push(city));
                  } else {
                    setSelectedCities(
                      selectedCities.slice(0).filter((_city) => {
                        return _city !== city;
                      })
                    );
                  }
                }}
              />
              <label style={{ marginRight: 15 }}>{month}</label>
            </>
          );
        })}
      </div>

      */}



      <h2>Assignment 2: Data Exploration</h2>
      <p>Below are some visualizations intended to scan the breadth of the data, and ensure
        there is some scope to understanding it.
        My intended questions of the dataset revolve around two major themes; data Integrity
        and Hospital Utilization. My focus on data integrity revolved around the idea that if
        I were to do any more complex, state-by-state analysis, I would need to know how complete
        my dataset is. Knowing that there can be inconsistencies in the dataset, I wanted to make 
        sure there was enough quality data to work off. Next, the areas of focus were also very
        important, which were the figures around hospital utilization in general and by COVID 
        patients. This scoping would allow me to see and understand what kinds of impacts COVID
        had over time and by state, and allow me to zero in on any strange outliers for further
        investigation.  
      </p>

      <h3>Illustration 2-1: Overall Data Gaps</h3>
      <h4>Fig 2-1-1: Data Integrity, Hospital Utilization</h4>
      <svg width={diagramWidth} height={diagramHeight / 4} style={{border: "1px solid black"}}>

      <AxisBottom strokeWidth={1} top={95} left={0} scale={dateX} tickValues={months}/>

          {lineplotUtil.map((utilization, i) => {
              if (utilization > 0){
                return <line key={i}
                x1={utilization}
                y1={30}
                x2={utilization}
                y2={(diagramHeight / 4) - 30}
                strokeWidth={0.1}
                style={{ fill:"none", stroke:"rgba(0,0,0,0.2)"}}></line>
              } 

            })}

      </svg>

      <h4>Fig 2-1-2: Data Integrity, COVID Utilization</h4>
      <svg width={diagramWidth} height={diagramHeight / 4} style={{border: "1px solid black"}}>

      <AxisBottom strokeWidth={1} top={95} left={0} scale={dateX} tickValues={months}/>

          {lineplotCovid.map((utilization, i) => {
              if (utilization > 0){
                return <line key={i}
                x1={utilization}
                y1={30}
                x2={utilization}
                y2={(diagramHeight / 4) - 30}
                strokeWidth={0.1}
                style={{ fill:"none", stroke:"rgba(0,0,0,0.2)"}}></line>
              } 

            })}
      </svg>

      <p>
        With this first visualization, the hope is to identify if there are major areas in the 
        data where data is missing or otherwise void. It is clear that in both cases, most of 
        the missing information is concentrated near the start of the dataset and pandemic in
        general, but more missing data is present for the COVID utilization, which is important
        to know for further visualizations. 
      </p>

      <h3>Illustration 2-2: State Data Integrity</h3>
      <h4>Fig 2-2-1: State Data Integrity, Hospital Utilization</h4>
      <svg width={diagramWidth} height={diagramHeight} style={{border: "1px solid black"}}>
        {fillPercent.map((fill, i) => {
                if (fill > 0){
                  return <line key={i}
                  x1={stateBar[i]}
                  y1={500 - (fill * 400)}
                  x2={stateBar[i]}
                  y2={450}
                  strokeWidth={10}
                  style={{ fill:"none", stroke:"rgba(0,0,0.2,0.3)"}}></line>
                } 

              })}

            <line
            x1={margin -5}
            y1={100}
            x2={diagramWidth - margin - 10}
            y2={100}
            strokeWidth={0.3}
            style={{ fill:"none", stroke:"rgba(0,0,0,0.75)"}}></line>

            <text x="55" y="95" fontSize={12}>
              100% Data
            </text>

      <AxisBottom strokeWidth={1} top={diagramHeight - margin + 10} left={-9} scale={stateX} tickValues={states}/>
      </svg>

      <h4>Fig 2-2-2: State Data Integrity, COVID Percentages</h4>
      <svg width={diagramWidth} height={diagramHeight} style={{border: "1px solid black"}}>
        {fillCovid.map((fill, i) => {
                if (fill > 0){
                  return <line key={i}
                  x1={stateBar[i]}
                  y1={500 - (fill * 400)}
                  x2={stateBar[i]}
                  y2={450}
                  strokeWidth={10}
                  style={{ fill:"none", stroke:"rgba(0,0,0.2,0.3)"}}></line>
                } 

              })}

            <line
            x1={margin -5}
            y1={100}
            x2={diagramWidth - margin - 10}
            y2={100}
            strokeWidth={0.3}
            style={{ fill:"none", stroke:"rgba(0,0,0,0.75)"}}></line>

            <text x="55" y="95" fontSize={12}>
              100% Data
            </text>

      <AxisBottom strokeWidth={1} top={diagramHeight - margin + 10} left={-9} scale={stateX} tickValues={states}/>
      </svg>

      <p>
        In this next set of visualizations, the intent is to break down the larger dataset into 
        individual state level segments, so it can be seen how good each individual state is in
        reporting COVID and hospital data. It can be seen across the board that in terms of 
        hospital utilization, reporting rates are significantly better than COVID report rates. 
        There also does appear to be some consistency between both, with some states simply having 
        worse reporting structures than others, which would be important to track for future analysis.
      </p>


      <h3>Illustration 2-3: State Hospital Utilization Min/Max</h3>
      <svg width={diagramWidth} height={diagramHeight} style={{border: "1px solid black"}}>
        {stateMin.map((fill, i) => {
                if (fill > 0){
                  return <line key={i}
                  x1={stateBar[i]}
                  y1={500 - (stateMax[i] * 340) - 60}
                  x2={stateBar[i]}
                  y2={500 - (fill * 340) - 60}
                  strokeWidth={10}
                  style={{ fill:"none", stroke:"rgba(0,0,0.2,0.3)"}}></line>
                } 

              })}

            <line
            x1={margin -5}
            y1={100}
            x2={diagramWidth - margin - 10}
            y2={100}
            strokeWidth={0.3}
            style={{ fill:"none", stroke:"rgba(0,0,0,0.75)"}}></line>

            <text x="55" y="95" fontSize={12}>
              100% Capacity
            </text>

      <AxisBottom strokeWidth={1} top={diagramHeight - margin + 10} left={-9} scale={stateX} tickValues={states}/>
      </svg>
      
      <p>
        This chart is intended to plot the range of data for the states, and see how the hospital
        utilization for each state has ranged from minimum to maximum
        and to identify any outliers. From the outset, its
        very clear that there are a few interesting cases in the dataset; 5 states have at some 
        point reported that hospital utilization exceeded 100%, even to an extreme amount in the
        case of Louisiana, which went way past 100% utilization to a startling 122%. These are 
        interesting cases to note for future analysis. 
      </p>


      <h3>Illustration 2-4: Covid Hospital Occupancy by Year</h3>
      <h4>Fig 2-4-1: Covid Hospital Occupancy Percent, 2020</h4>
      <svg width={diagramWidth} height={diagramHeight / 4} style={{border: "1px solid black"}}>

        {data2020.map((utilization, i) => {
                return <line key={i}
                x1={(utilization * 900) + 50}
                y1={30}
                x2={(utilization * 900) + 50}
                y2={(diagramHeight / 4) - 30}
                strokeWidth={0.1}
                style={{ fill:"none", stroke:"rgba(0,0,0,0.1)"}}></line>
            })}
        <AxisBottom strokeWidth={1} top={95} left={0} scale={yearX} numTicks={10}/>
      </svg>


      <h4>Fig 2-4-1: Covid Hospital Occupancy Percent, 2021</h4>
      <svg width={diagramWidth} height={diagramHeight / 4} style={{border: "1px solid black"}}>

        {data2021.map((utilization, i) => {
                return <line key={i}
                x1={(utilization * 900) + 50}
                y1={30}
                x2={(utilization * 900) + 50}
                y2={(diagramHeight / 4) - 30}
                strokeWidth={0.1}
                style={{ fill:"none", stroke:"rgba(0,0,0,0.1)"}}></line>
            })}
        <AxisBottom strokeWidth={1} top={95} left={0} scale={yearX} numTicks={10}/>
      </svg>

      <p>
        These plots are intended to illustrate the range of percentage occupancies of 
        hospital beds by COVID patients in differing years. It is interesting that the 
        resulting graph shows firstly, the lack of reporting data in 2020 that is affecting
        the results. Besides this, it is apparent that the concentrations are similar for
        both years, but appears to be slightly lower for 2021, with hospitalizations 
        going down from COVID cases, possibly due to changes in variants or additional 
        measures preventing worse cases from emerging.
      </p>


      {/*


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
      */}


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
