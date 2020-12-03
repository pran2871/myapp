import React from "react";
import ReactDOM from "react-dom";
import Chart from "react-google-charts";
// Ref : https://developers.google.com/chart/interactive/docs/gallery/histogram


const data =[
    ['x', 'Student Performance'],
    ["26-11-2020 16:51:21", 0],
    ["26-11-2020 16:51:21", 10],
    
  ];
const options1 = {
  title: "Company Performance",
  curveType: "function",
  legend: { position: "bottom" }
};

const options = 
    { 
      title: "Student Score vs Time",
        hAxis: {
          title: 'Date',
          
        },
        vAxis: {
          title: 'Score',
          maxValue:8,
        },
      }

class Contact extends React.Component {
  render() {
    return (
      <div className="App">
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />

{/* <Chart
  width={'600px'}
  height={'400px'}
  chartType="LineChart"
  loader={<div>Loading Chart</div>}
  data={data}
  options={options}
  rootProps={{ 'data-testid': '1' }}
/> */}
      </div>
    );
  }
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Contact />, rootElement);

export default Contact;