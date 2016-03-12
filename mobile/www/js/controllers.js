angular.module('starter.controllers', ['chart.js'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $ionicPopup) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    
   $scope.lastMonthUtilization=180;
   $scope.pricePerKwh = 5;
   $scope.master = 95;
   $scope.lastMonth = "February";
   $scope.thisMonth = "March";
   $scope.Math = window.Math;
   
   // Form data for the login modal
   $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
    

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

.controller('SplashCtrl',function($scope, $ionicModal, $ionicPopup, $location, $http){
    
  localStorage.setItem('isGoalSet', true);
   $scope.lastMonthUtilization=180;
   $scope.pricePerKwh = 5;
   $scope.master = $scope.lastMonthUtilization * 95/100;
   $scope.defaultPowerConsumption = ($scope.lastMonthUtilization - $scope.master) * 5; 
    $scope.defaultCoin = ($scope.lastMonthUtilization - $scope.master) ; 
   //$('#my-goal-green-coins').html(($scope.lastMonthUtilization - $scope.master) * 5);
   $scope.lastMonth = "February";
   $scope.thisMonth = "March";
   $scope.Math = window.Math;
    
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/my-goal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.myGoalModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeMyGoal = function() {
    $scope.myGoalModal.hide();
  };

  // Open the login modal
  $scope.myGoal = function() {  

        $(".knob").knob({
            /*change : function (value) {
                //console.log("change : " + value);
            },
            release : function (value) {
                console.log("release : " + value);
            },
            cancel : function () {
                console.log("cancel : " + this.value);
            },*/
            draw : function () {
            },
            'change' : function (v) {
                //console.log(v); 
                $('#my-goal-green-coins').html(($scope.lastMonthUtilization - Math.floor(v)) * 5);
                $('#my-goal-kwh-commitment').html(Math.floor(v));
            },
            'release' : function (v) { 
                console.log(v); 
            }



    }); 
    $scope.myGoalModal.show();
  };
  
  $scope.setGoal = function() {
    console.log(localStorage.getItem('setGoal'));
      
    if(localStorage.getItem('setGoal') == '0') {
        localStorage.setItem('setGoal', '1');
        var myGoalCommitment = parseFloat($("#my-goal-kwh-commitment").html());
        //var tmp_percentage_committed = $("#tmp_percentage_committed").attr('value');
        var tmp_percentage_committed = 100 - Math.floor((myGoalCommitment / $scope.lastMonthUtilization)*100);

      var data = {
           "targetUsage": myGoalCommitment,
           "targetDate": "2016-3-1"
        };
      
      $http.post('http://104.155.219.214:8080/goal/0x6015fb43e26226d80edc1c209ccd99ce2493497b', data, 
            {headers: {
                "Content-Type": "application/json"
            }})
          .then(function(response) {

                console.log(response);
                localStorage.setItem('setGoal', '0');
                $scope.goalCommittedSuccess = "You have pledged to utilise "+myGoalCommitment+" KWH which is "+tmp_percentage_committed+" % less than your utilization last year this month!";
                console.log($scope.goalCommittedSuccess);
                
                
//                if(!$scope.alertPopup) {
//                   $scope.alertPopup = $ionicPopup.alert({
//                     title: 'Your goal for March is set!',
//                     template: 'You have pledged to utilize '+tmp_percentage_committed+'% power as compared to last month Great going!'
//                   });
//                   $scope.alertPopup.then(function(res) {
//                     $scope.closeMyGoal();
//                     $location.url('/app/power');
//                     $scope.alertPopup = null;
//                   });
//                }
            }, function(response) {
                console.log(response);
            });
    } else {
        console.log("error");
    }
    

  };
    
    
    
})

.controller('PowerCtrl',function($scope, $interval){
       
    
	$( "#myBar" ).animate({
                   "width": "+=50%"
                }, {
                    duration: 2000,
                    complete: function() {
                      $("#label").text("60%");
                    }
                });
    $( "#myProgress i").animate({
                   "left": "+=52%"
                }, {
                    duration: 2000
                });
				
				
    /***** google graph *****/
    
    var namespace = '/test'; // change to an empty string to use the global namespace
		var ip = '10.244.25.64:8080'
    var socket = io.connect('http://'+ip+ namespace);
    
    var items = [];
    socket.on('my response', function(item) {
        //console.log(item);
        items.push(item);
        if (items.length > 40) {
          items.shift();
        }

        $scope.chart = {
          data: items,
          max: 30
        };

        //$scope.gaugeValue = item.value;
        $scope.currentPower = item.value;
        //console.log(item);
        $scope.$apply();
        //$('#log').append('<br>' + $('<div/>').text('Received #' + msg.number).html());
    });
      
    // event handler for new connections
    socket.on('connect', function() {
        console.log("connected!")
        socket.emit('my event', {data: 'I\'m connected!'});
    });
    $scope.series= ['Power'];
    
    /*
    
    
    var items = [];
    
    webSocket.subscribe(function (item) {
      console.log(item);
      items.push(item);
      
      if (items.length > 40) {
        items.shift();
      }

      $scope.chart = {
        data: items,
        max: 30
      };

      //$scope.gaugeValue = item.value;
        $scope.currentPower = item.value;
        console.log(item);
      $scope.$apply();
    });
    */
	
	
}).controller("PowerMonthCtrl",function($scope,$http, $interval){
	
	$scope.month = new Date();	
	
	$scope.previousMonth = function(){
		$scope.disable = '';
		
		

		if(!$scope.wait){
			$scope.wait = true;
			$scope.disable = '';
			//$scope.disabled = true;
			if($scope.month.getDate() == new Date().getMonth()){
				$scope.disable = 'disabled';
			}else{
				$scope.month.setMonth($scope.month.getMonth()-1);
				$scope.refreshGraph();
			}
				setTimeout(function() {
					$scope.wait = false;
				}, 1000);
			}	
			
	}
	
	$scope.nextMonth = function(){
			
		if(!$scope.wait){
			$scope.wait = true;
			$scope.disable = '';
			//$scope.disabled = true;
			if($scope.month.getMonth() == new Date().getMonth()){
				$scope.disable = 'disabled';
			}else{
				$scope.month.setMonth($scope.month.getMonth()+1);
				$scope.refreshGraph();
			}
				setTimeout(function() {
					$scope.wait = false;
				}, 1000);
			}
	}
	$scope.refreshGraph = function(){
		//d3.select("$chart").remove();
		//$( "#chart" ).html('');
		$scope.loadMonthGraph();
	}
	
	$scope.loadMonthGraph = function(){
		/*$scope.graph = {};		
		$scope.disable = 'disabled';
		
		
		$scope.graph.data = [
		//Awake
		[6, 12, 18, 24, 30, 36,42,48,54,60,66,72,78,84,90,96,102,108,114,120,126,132,138,144,150,156,162,168,174,180,186],
		//Asleep
		[0.5, 1, 2, 2.5, 4, 4.5,6,8.2,8.6,10.4,10.7,11,12,15,15.5,16,17,17.5,18.6,19.4,20,20.8,21.6,22,23.1,23.9,24.6,25.3,26.2,27.1,27.9]
	  ];
	  
		$scope.graph.labels = ['1',  '5', '10','15','20','25','31'];
		$scope.graph.series = ['Expected', 'Usage'];
		$scope.graph.options = {pointDot : false,
								pointDotRadius : 2,
								pointDotStrokeWidth : 2,
								showTooltips: false,
								pointHitDetectionRadius : 20,
								datasetStrokeWidth : 4,
								datasetFill : false,
								scaleShowHorizontalLines: true,
								scaleShowVerticalLines: true};
		$scope.graph.colours = [{
    strokeColor: '#ff5526'
}];*/
	
	
	
var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
		var lineChartData = {
			labels : ['1','2','3','4' ,'5','6','7','8','9' ,'10', '11','12','13','14','15','16','17','18','19' ,'20', '21','22','23','24','25','26','27','28','29' ,'30'],
			datasets : [
				{
					label: "Baseline",
					fillColor : "rgba(220,220,220,0.2)",
					strokeColor : "#ee6e73",
					datasetStrokeWidth : 4,
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					datasetFill : false,
					pointHighlightStroke : "rgba(220,220,220,1)",
					data : [6, 12, 18, 24, 30, 36,42,48,54,60,66,72,78,84,90,96,102,108,114,120,126,132,138,144,150,156,162,168,174,180,186]
				},
				{
					label: "Actuals",
					fillColor : "rgba(151,187,205,0.2)",
					strokeColor : "#1E88E5",
					datasetStrokeWidth : 4,
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					datasetFill : false,
					pointHighlightStroke : "rgba(151,187,205,1)",
					data : [6, 16, 20, 25, 31, 34,38,43,50,54,56,64,75]
				}
			]
		}
		var ctx = document.getElementById("lineGraph").getContext("2d");
		window.myLine = new Chart(ctx).Line(lineChartData, {
			responsive: false,
			labelsFilter: function (value, index) {
				return (index + 1) % 5 !== 0;
			},
			bezierCurve: false,
			pointDot : false,
			showTooltips: false,
			datasetStrokeWidth : 3,
			datasetFill : false
		});
		
	//$scope.loadMonthGraph();
	}
	$scope.loadMonthGraph();
	
}).controller("PowerDayCtrl",function($scope, $interval,$http){
	
	
	$scope.date = new Date();
	
	
	
	$scope.previousDay = function(){
		
		$scope.disable = '';
		$scope.resetVar = false;
		console.log($scope.setPrev);
		
		/*
		if($scope.stopProcessing==true){
			$scope.date.setDate($scope.date.getDate()+1);
			$scope.setPrev = false;
			$scope.resetVar = true;
			setTimeout(function() {
				$scope.stopProcessing = false;
			}, 1000);
			return;
		}
		*/
		console.log($scope.wait);
		if(!$scope.wait){
			$scope.wait = true;
			$scope.setPrev = true;
			$scope.date.setDate($scope.date.getDate()-1);
			$scope.refreshGraph();		
			setTimeout(function() {
				$scope.wait = false;
			}, 1000);
		} 
		
	}
	
	$scope.nextDay = function(){
		
		if(!$scope.wait){
			$scope.wait = true;
			$scope.disable = '';
			//$scope.disabled = true;
			if($scope.date.getDate() == new Date().getDate()){
				$scope.disable = 'disabled';
			}else{
				$scope.date.setDate($scope.date.getDate()+1);			
				$scope.refreshGraph();	
			}
			setTimeout(function() {
					$scope.wait = false;
			}, 1000);
		}
	}
	$scope.refreshGraph = function(day){
		//console.log('tesse');
		//d3.select("$chart").remove();
		$( "#chart" ).html('');
		$scope.generateDayGraph();
	}

	
	$scope.generateDayGraph = function() {
		var screenWidth = window.innerWidth;
		$http.get("data/hourlyData.json")
		.then(function(response) {
				var data = response.data;
				//console.log(response.data.daily_values[day].hourly_values);
		});
		
		var margin = {
				left: 20,
				top: 20,
				right: 20,
				bottom: 20
			},
			width = Math.min(screenWidth, 300) - margin.left - margin.right,
			height = Math.min(screenWidth, 300) - margin.top - margin.bottom;

		radius = Math.min(width, height) / 2,
			innerRadius = 0.3 * radius;
		var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom))
			.append("g").attr("class", "wrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");


		////////////////////////////////////////////////////////////// 
		///////////////////// Data &  Scales ///////////////////////// 
		////////////////////////////////////////////////////////////// 

		//Some random data
		var donutData = [{
			name: "Antelope",
			value: 30,
			color: "#2c7bb6"
		}, {
			name: "Bear",
			value: 40,
			color: "#2c7bb7"
		}, {
			name: "Cheetah",
			value: 68,
			color: "#2c7bb8"
		}, {
			name: "Dolphin",
			value: 30,
			color: "#2c7hk9"
		}, {
			name: "Elephant",
			value: 42,
			color: "#2c7gr6"
		}, {
			name: "Flamingo",
			value: 53,
			color: "#2c7bf6"
		}, {
			name: "Giraffe",
			value: 62,
			color: "#2c7bg6"
		}, {
			name: "Other",
			value: 65,
			color: "#2c7hb6"
		}, {
			name: "Bear",
			value: 49,
			color: "#2c7bb7"
		}, {
			name: "Cheetah",
			value: 56,
			color: "#2c7bb8"
		}, {
			name: "Dolphin",
			value: 65,
			color: "#2c7hk9"
		}, {
			name: "Elephant",
			value: 59,
			color: "#2c7gr6"
		}, {
			name: "Flamingo",
			value: 49,
			color: "#2c7bf6"
		}, {
			name: "Giraffe",
			value: 62,
			color: "#2c7bg6"
		}, {
			name: "Cheetah",
			value: 68,
			color: "#2c7bb8"
		}, {
			name: "Dolphin",
			value: 30,
			color: "#2c7hk9"
		}, {
			name: "Elephant",
			value: 42,
			color: "#2c7gr6"
		}, {
			name: "Flamingo",
			value: 53,
			color: "#2c7bf6"
		}, {
			name: "Giraffe",
			value: 62,
			color: "#2c7bg6"
		}, {
			name: "Other",
			value: 65,
			color: "#2c7hb6"
		}, {
			name: "Bear",
			value: 49,
			color: "#2c7bb7"
		}, {
			name: "Cheetah",
			value: 56,
			color: "#2c7bb8"
		}, {
			name: "Dolphin",
			value: 65,
			color: "#2c7hk9"
		}, {
			name: "Elephant",
			value: 59,
			color: "#2c7gr6"
		}, {
			name: "Flamingo",
			value: 49,
			color: "#2c7bf6"
		}, {
			name: "Giraffe",
			value: 62,
			color: "#2c7bg6"
		}];

		//Create a color scale
		var colorScale = d3.scale.linear()
			.domain([1, 3.5, 6])
			.range(["#2c7bb6", "#ffffbf", "#d7191c"])
			.interpolate(d3.interpolateHcl);
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([0, 0])
			.html(function(d) {
				return d.data.name + ": <span style='color:orangered'>" + d.data.value + "</span>";
			});
		//Create an arc function   
		var arc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(function(d) {
				return (radius - innerRadius) * (d.data.value / 100.0) + innerRadius;
			});
		/*	.innerRadius(width*0.75/2) 
			.outerRadius(width*0.75/2 + 30);*/

		//Turn the pie chart 90 degrees counter clockwise, so it starts at the left	
		var pie = d3.layout.pie()
			.startAngle(-90 * Math.PI / 180)
			.endAngle(-90 * Math.PI / 180 + 2 * Math.PI)
			.value(function(d) {
				return d.value;
			}).padAngle(.01)
		.sort(null);
		svg.call(tip);
		////////////////////////////////////////////////////////////// 
		//////////////////// Create Donut Chart ////////////////////// 
		////////////////////////////////////////////////////////////// 

		//Create the donut slices and also the invisible arcs for the text 
		svg.selectAll(".donutArcs")
			.data(pie(donutData))

		.enter().append("path")
			.attr("class", "donutArcs")
			.attr("d", arc)
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			.style("fill", function(d, i) {
				return '#fff';

			})
			.transition().duration(800)

		.style("fill", function(d, i) {
				return "#ee6e73";
			})
			.each(function(d, i) {
				//Search pattern for everything between the start and the first capital L
				var firstArcSection = /(^.+?)L/;

				//Grab everything up to the first Line statement
				var newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];
				//Replace all the comma's so that IE can handle it
				newArc = newArc.replace(/,/g, " ");

				//If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
				//flip the end and start position
				if (d.endAngle > 90 * Math.PI / 180) {
					var startLoc = /M(.*?)A/, //Everything between the first capital M and first capital A
						middleLoc = /A(.*?)0 0 1/, //Everything between the first capital A and 0 0 1
						endLoc = /0 0 1 (.*?)$/; //Everything between the first 0 0 1 and the end of the string (denoted by $)
					//Flip the direction of the arc by switching the start en end point (and sweep flag)
					//of those elements that are below the horizontal line
					var newStart = endLoc.exec(newArc)[1];
					var newEnd = startLoc.exec(newArc)[1];
					var middleSec = middleLoc.exec(newArc)[1];

					//Build up the new arc notation, set the sweep-flag to 0
					newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
				} //if

				//Create a new invisible arc that the text can flow along
				svg.append("path")
					.attr("class", "hiddenDonutArcs")
					.attr("id", "donutArc" + i)
					.attr("d", newArc)
					.style("fill", "none");
			});



		////////////////////////////////////////////////////////////
		//////////////////////// Set-up ////////////////////////////
		////////////////////////////////////////////////////////////

		var screenWidth = window.innerWidth;




		////////////////////////////////////////////////////////////
		//////////////////// Scales & Data /////////////////////////
		////////////////////////////////////////////////////////////

		//The start date number and end date number of the months in a year
		var monthData = [ {
			month: "12 AM",
			startDateID: 120,
			endDateID: 150
		}, {
			month: "3 AM",
			startDateID: 151,
			endDateID: 180
		}, {
			month: "6 AM",
			startDateID: 181,
			endDateID: 211
		}, {
			month: "9 AM",
			startDateID: 212,
			endDateID: 242
		},{
			month: "12 PM ",
			startDateID: 0,
			endDateID: 30
		}, {
			month: "3 PM",
			startDateID: 31,
			endDateID: 58
		}, {
			month: "6 PM",
			startDateID: 59,
			endDateID: 89
		}, {
			month: "9 PM",
			startDateID: 90,
			endDateID: 119
		}];
		radius = Math.min(width, height) / 2,
			innerRadius = 0.3 * radius;
		//Creates a function that makes SVG paths in the shape of arcs with the specified inner and outer radius 
		var arc = d3.svg.arc()
			.innerRadius(innerRadius + 80)
			.outerRadius(innerRadius + 80 + 16);

		//Creates function that will turn the month data into start and end angles
		var pie = d3.layout.pie()
			.value(function(d) {
				return d.endDateID - d.startDateID;
			})
			.padAngle(.0)
			.sort(null);

		////////////////////////////////////////////////////////////
		//////////////////// Create the Slices /////////////////////
		////////////////////////////////////////////////////////////

		//Draw the arcs themselves
		svg.selectAll(".monthArc")
			.data(pie(monthData))
			.enter().append("path")
			.attr("class", "monthArc")
			.attr("id", function(d, i) {
				return "monthArc_" + i;
			})
			.transition().duration(2000)
			.style("fill", function(d, i) {
				return '#fff';

			})
			.transition()
			.attr("d", arc).style("fill", function(d, i) {
				return "#F4F4F4";
				// return d.data.color
				/*if(i === 7) return "#CCCCCC"; //Other
				else return colorScale(i); */
			});

		//Append the month names within the arcs
		svg.selectAll(".monthText")
			.data(monthData)
			.enter().append("text")
			.attr("class", "monthText")
			.attr("x", 30) //Move the text from the start angle of the arc
			.attr("dy", 13) //Move the text down
			.append("textPath")
			.attr("xlink:href", function(d, i) {
				return "#monthArc_" + i;
			})
			.text(function(d) {
				return d.month;
			});


		svg.append("svg:text")
			.attr("class", "usage-score-desc")
			.attr("dy", "2em")
			.style('color', 'white').transition()
			.style('color', 'white')
			.attr("text-anchor", "middle") // text-align: right
			.text('kWh');
		/*svg.append("svg:text")
			.attr("class", "usage-score-desc")
			.attr("dy", "1.5em")
			.attr("text-anchor", "middle") // text-align: right
			.text('Total Usage');*/


		var start_val = 0,
			duration = 4000,
			end_val = [14];


		svg.selectAll(".txt")
			.data(end_val)
			.enter()
			.append("text")
			.text(start_val)
			.attr("class", "usage-score")
			.attr("x", -17)
			.attr("y", 10)
			.transition()
			.duration(3000)
			.tween("text", function(d) {
				var i = d3.interpolate(this.textContent, d),
					prec = (d + "").split("."),
					round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

				return function(t) {
					this.textContent = Math.round(i(t) * round) / round;
				};
			});
	}

	$scope.generateDayGraph(0);
}).controller("PowerYearCtrl",function($scope, $interval, $http){
	
			var download = $('.download'),
			meter = $('.meter');

		$('.button-download').on('click', function(e) {
		  download.toggleClass('is-active');
		  
		  setTimeout(function() {
			meter.toggleClass('is-done');
		  }, 1000);
		  
		  e.preventDefault();
		});

		$('#reset').on('click', function() {
		  download.removeClass('is-active');
		  meter.removeClass('is-done');
		});

   
	
	
	$scope.date = new Date();
	
	
	
	/*$scope.previousDay = function(){
		console.log('asdasd');
		$scope.disable = '';
		$scope.prevSet = false;
		$scope.date.setDate($scope.date.getDate());
		$scope.refreshGraph();		
	}
	
	$scope.nextDay = function(){
		$scope.disable = '';
		//$scope.disabled = true;
		if($scope.date.getDate() == new Date().getDate()){
			$scope.disable = 'disabled';
		}else{
			$scope.date.setDate($scope.date.getDate()+1);			
		}
	}
	$scope.refreshGraph = function(){
		console.log('test');
		$scope.date.setDate($scope.date.getDate()-1);
		//d3.select("$chart").remove();
		$( "#chart" ).html('');
		$scope.generateDayGraph();
	}*/
	$scope.commitDayEnd = function(){
		var data = {
           "quantity": Math.floor((Math.random() * 6) + 1),
           "date": "2016-3-1"
        };
		$http.post('http://104.155.219.214:8080/usage/0x6015fb43e26226d80edc1c209ccd99ce2493497b', data, 
            {headers: {
                "Content-Type": "application/json"
            }})
		.then(function(response) {
				var data = response.data;
				console.log(response.data);
		});
		
	}
});

    

    
    




