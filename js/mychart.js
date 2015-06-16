<!--

window.onload = function () {
	var dps = [];
	var chart = new CanvasJS.Chart("chartContainer",{
		title :{
			text: "Wykres procentowy aktualnej gęstości życia"
		},			
		data: [{
			type: "area",
			dataPoints: dps 
		}],
		axisY: {
			title: "komórek żywych",
			titleFontSize: 16,
			titleFontWeight: "bold",
			valueFormatString: "#' %'",
			lineColor: "#33842a",
			gridColor: "#33842a",
			tickColor: "black",
			labelFontFamily: "Calibri",
			labelFontColor: "black"
		},
		axisX: {
			title: "numer iteracji",
			titleFontSize: 16,
			titleFontWeight: "bold",
			labelAngle: 30,
			lineThickness: 1,
			lineColor: "#33842a",
			tickColor: "black",
			labelFontFamily: "Calibri",
			labelFontColor: "black"
		}
	});

	var xVal = 0.00;
	var yVal = 100.00;	
	var updateInterval = 50;
	var dataLength = 200;

	var updateChart = function (count) {
		count = count || 1;
		for (var j = 0; j < count; j++) {
			var alive = document.getElementById('alive').value;
			yVal = Math.abs(alive);
			dps.push({
				x: xVal - dataLength,
				y: yVal
			});
			xVal++;
		};
		if (dps.length > dataLength) dps.shift();				
		chart.render();		
	};
	updateChart(dataLength); 
	setInterval(function(){updateChart()}, updateInterval); 
}

-->
