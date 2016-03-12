/**
 * The DashboardController controller manages the reports.
 *
 * @class DashboardController
 * @constructor
 * @param $scope {angular}
 */
app.controller('DashboardController', ['$scope', '$rootScope','$http','remoteService','$location'
       	                           	,function($scope, $rootScope ,$http,  remoteService,$location) {
  $.blockUI({ 
            message: 'Please Wait ...',
            css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
            }
            
  }); 
                                     
                                        
		var data = {
"states":{
	"IN-AN":1,
	"IN-AP":2,
	"IN-AR":3,
	"IN-AS":4,
	"IN-BR":5,
	"IN-CH":6,
	"IN-CT":7,
	"IN-DN":8,
	"IN-DD":9,
	"IN-DL":1,
	"IN-GA":2,
	"IN-GJ":3,
	"IN-HR":4,
	"IN-HP":5,
	"IN-JK":6,
	"IN-JH":7,
	"IN-KA":8,
	"IN-KL":9,
    "IN-LD":1,
	"IN-MP":2,
	"IN-MH":3,
	"IN-MN":4,
    "IN-ML":5,
	"IN-MZ":6,
	"IN-NL":7,
	"IN-OR":8,
	"IN-PY":9,
	"IN-PB":1,
	"IN-RJ":2,
	"IN-SK":3,
	"IN-TN":4,
	"IN-TR":5,
	"IN-UP":6,
	"IN-UT":7,
	"IN-WB":8
}
};
data.usageStats = {
	"cords":[  
         [  
            15.299326,
            74.123996
         ],
		 [  
            28.613939,
            77.209021
         ]],
	 "names":["Goa","Delhi"],
	 "population":[4828838,1234567],
	 "appusers":[7.0 , 2.0]
	}
	
	var statesValues = jvm.values.apply({}, jvm.values(data.states));
	var statePopValues = Array.prototype.concat.apply([], jvm.values(data.usageStats.population));
	var stateAppUsersValues = Array.prototype.concat.apply([], jvm.values(data.usageStats.appusers));
	
		$('#dashboard-map-india').vectorMap({
                                map: 'in_mill_en', 
                                backgroundColor: '#fff',                                      
                                regionsSelectable: false,
								markers: data.usageStats.coords,
                                regionStyle: {selected: {fill: '#33414E'},
                                                initial: {fill: '#95b75d'}},
                                onRegionClick: function(event, code){
                                   // $("#vector_usa_map_value").val(jvm_usm.getSelectedRegions().toString()); 

        								   
                                },
								series: {
            markers: [{
              attribute: 'fill',
              scale: ['#FEE5D9', '#A50F15'],
              values: data.usageStats.appusers,
              min: jvm.min(stateAppUsersValues),
              max: jvm.max(stateAppUsersValues)
            },{
              attribute: 'r',
              scale: [5, 20],
              values: data.usageStats.population,
              min: jvm.min(statePopValues),
              max: jvm.max(statePopValues)
            }],
            regions: [{
              scale: ['#F6CC93', '#FE970A'],
              attribute: 'fill',
              values: data.states,
              min: 0,
              max: 10
            }]
          },
								
                                });
                                        
    $http({
        method: 'GET',
        url: 'http://104.197.9.200/users'
        }).then(function successCallback(response) {
           // console.log(response);
            $scope.customerData = response.data.users;
            $.unblockUI(); 
        }, function errorCallback(response) {
            $scope.customerData = {};
        });                                   
                                        

   
	


}]);