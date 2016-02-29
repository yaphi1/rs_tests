/************************************************************************
the CSS to prepend
*************************************************************************/

var clockstyle = ''
+'<style>'
+'#clockholder{'
+'	background: #1f1f1f;'
+'	padding: 10px;'
+'	text-align: center;'
//+'	display: none;'
+'}'

+'.saleends{'
+'	color: #e5b93b;'
+'	font-size: 14px;'
+'	font-style: italic;'
+'	padding-right: 5px;'
+'}'

+'#clock{'
+'	position: relative;'
+'	background: #444;'
+'	color: #e5b93b;'
+'	font-size: 0px;'
+'	display: inline-block;'
+'	border-radius: 2px;'
+'	border: 1px solid #000;'
+'	border-bottom: 1px solid #222;'
+'	box-shadow: 0px -35px 25px -15px rgba(22,22,22,0.5) inset;'
+'}'

+'#clock .clockdiv{'
+'	font-size: 10px;'
+'	display: inline-block;'
+'	border-right: 1px solid #111;'
+'	border-left: 1px solid #333;'
+'	padding: 4px 12px;'
+'	font-weight: bold;'
+'}'
+'#clock .clockdiv-last{'
+'	border-right: 0px;'
+'}'

+'.timenumber{'
+'	font-size: 15px;'
+'}'

+'.clockshadow{'
+'	position: absolute;'
+'	left: 0px;'
+'	bottom: 0px;'
+'	width: 100%;'
+'	height: 55%;'
+'	background: rgba(33,33,33,0.3);'
+'}'
+'</style>'
+'';


/***********************************************************************
the HTML to prepend
*************************************************************************/

var clockhtml = ''
+'<div id="clockholder">'
+'	<span class="saleends">Sale Ends</span>'
+'	<div id="clock">'
+'		<div class="clockdiv"><span class="timenumber" id="clockhours">12</span> hrs</div>'
+'		<div class="clockdiv"><span class="timenumber" id="clockminutes">45</span> min</div>'
+'		<div class="clockdiv clockdiv-last"><span class="timenumber" id="clockseconds">53</span> sec</div>'
+'		<div class="clockshadow"></div>'
+'	</div>'
+'</div>'
+'';




/***********************************************************************
the clock script
*************************************************************************/

// clock schedule is in this format: [[startDate,endDate],[startDate,endDate], [startDate,endDate]]
var clockSchedule = [
	["18 Nov 2014 17:30:00 -0500", "19 Nov 2014 20:30:00 -0500"] // example day 1
	,["30 Nov 2014 17:30:00 -0500", "30 Nov 2014 17:30:00 -0500"] // example day 2
];


// loop through schedule to check if the current date requires a clock
for(var i=0; i<clockSchedule.length; i++){
	var startDateLocal = new Date( new Date(clockSchedule[i][0]).toUTCString() ); // convert EST to UTC to user's local time
	var endDateLocal = new Date( new Date(clockSchedule[i][1]).toUTCString() ); // convert EST to UTC to user's local time

	// if the current date falls between one of the start dates and end dates on the schedule, then run the clock
	if(new Date()>startDateLocal && new Date()<endDateLocal){
		$('body').prepend(clockstyle+clockhtml);
		runClock(endDateLocal);
	}
}

function runClock(enddateLocal){
	var yb = { id : function(str){return document.getElementById(str)} };

	yb.id('clockholder').style.display = 'block'; // show the clock

	function setClock(){
		var timeleft = new Date( enddateLocal - (new Date()) ); // remaining time is end time minus current time

		// update the values in the clock
		yb.id('clockseconds').innerHTML = timeleft.getSeconds();
		yb.id('clockminutes').innerHTML = timeleft.getMinutes();
		yb.id('clockhours').innerHTML = Math.floor(timeleft/1000/60/60);
		
		if(Math.floor(timeleft/1000)<=0){
			clearInterval(clockinterval); // when time runs out, stop clock
			yb.id('clockholder').style.display = 'none'; // hide the clock
		}
	}

	setClock(); // start the clock
	var clockinterval = setInterval(setClock,1000); // keep the clock running
}

