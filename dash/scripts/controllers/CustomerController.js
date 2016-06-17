'use strict';

/**
 * The CustomerController controller manages the customer.
 *
 * @class CustomerController
 * @constructor
 * @param $scope {angular}
 */
app.controller('CustomerController', ['$scope','$http', '$rootScope','customerService','$location','$routeParams'
       	                           	,function($scope,$http, $rootScope ,customerService,$location,$routeParams) {
                                        
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
                                   
    var monthNames = {
         1	: "January",
         2	: "February",
         3	: "March",
         4  : "April",
         5	: "May",
         6	: "June",
         7	: "July",
         8	: "August",
         9	: "September",
         10	: "October",
         11	: "November",
         12	: "December"
    };                                    
    
    $scope.customerId =  $routeParams.customerId;                                     
                                        
    customerService.getCustomerStats($scope.customerId,function(httpcode,data){
        $scope.greencoinBalance = data.carboncoinBalance;
        $scope.lifetimeUsage = data.lifetimeUsage;
        
    },function(httpcode,data){
        //console.error(httpcode);
        $.unblockUI();
        $scope.showMessage('info',SERVER_FAILURE);
        
    });
                                        
    customerService.getCustomerTransactions($scope.customerId,function(httpcode,data){
        $scope.transactions = data.transactions;
    },function(httpcode,data){
        $.unblockUI();
        $scope.showMessage('info',SERVER_FAILURE);
        
    });
                                        
    customerService.getContract(function(httpcode,data){
        $scope.contract = data;
        $.unblockUI();
    },function(httpcode,data){
        $.unblockUI();
        $scope.showMessage('info',SERVER_FAILURE);
    });                                    
                                        
                                    
   
                                        
                                           
  $scope.pieLabels = ["Current Usage", "Ideal Usage", "Goal Window"];
  $scope.pieData = [300, 500, 100];        
        
        
  $scope.barLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  $scope.barSeries = ['Series A', 'Series B'];

  $scope.barData = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
                                        
  var maxHeight = 0;
  maxHeight = $("#profilePanel").height();
  
  var chartPanelHeight = $("#chartPanel").height();
  var rewardPanelHeight = $("#rewardPanel").height();
  if(maxHeight<chartPanelHeight){
      maxHeight = chartPanelHeight;
  }
  
 if(maxHeight<rewardPanelHeight){
      maxHeight = rewardPanelHeight;
  }                                        
                                        

  maxHeight = 0;
                                                    
                                        
maxHeight = $("#contractPanel").height();                  

var committmentPanelHeight = $("#committmentPanel").height();
var currentEarningPanelHeight = $("#currentEarningPanel").height();
  if(maxHeight<committmentPanelHeight){
      maxHeight = committmentPanelHeight;
  }
  
 if(maxHeight<currentEarningPanelHeight){
      maxHeight = currentEarningPanelHeight;
  }    
  

}]);
	
	

	

	
