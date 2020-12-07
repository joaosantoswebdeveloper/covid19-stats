/*
https://www.chartjs.org/docs/latest/configuration/legend.html
*/
import {Line} from 'react-chartjs-2';
var numeral = require('numeral');


export default function GaphPlot(getHistoricalData) {

	const optionsChart = {
		legend: {
		  display: false
		},
		elements: {
		  point: {
			radius: 0
		  }
		},
		maintainAspectRatio: false,
		tooltips: {
		  mode: "index",
		  intersect: false,
		  callbacks: {
			label: function (tooltipItem, data){
			  return numeral( tooltipItem.value ).format("+0,0");
			}
		  }
		},
		scales: {
		  xAxes: [
			{
			  type: "time",
			  time: {
				parser: "MM/DD/YY",
				tooltipFormat: "ll",
			  }
			}
		  ],
		  yAxes: [
			{
			  gridLines: {
				display: false,
			  },
			  ticks: {
				callback: function(value, index, values){
				  return numeral(value).format("0a");
				},
			  },
			},
		  ],
		},
	  };


    const graphData = getDataChart(getHistoricalData);
	//console.log("graphData", graphData);
	
	return (<Line data={graphData} options={optionsChart} />);
}

function getDataChart({data}) {
		
	//console.log("(getDataChart) historical", data);

	const xAxis = data.map( (element) => {
		return element[0];
	});
	//console.log(",xAxis", xAxis);

	const yAxis = data.map( (element) => {
		return element[1];
	});
	//console.log(",yAxis", yAxis);
	const yAxisDiference = yAxis.map( (element, index) => {
		
		if(index>0){
			return numeral(element - yAxis[index-1]).format('0.0');;	
		}
		else{
			return [];
		}
	});
	yAxisDiference.splice(0, 1);
	//console.log(",yAxisDiference", yAxisDiference);

	return {
		labels: xAxis,
		datasets: [
			{
				backgroundColor: 'rgba(204,16,52,0.5)',
				borderColor: '#cc1034',
				data: yAxisDiference
			}
		]
	}

}
	
	