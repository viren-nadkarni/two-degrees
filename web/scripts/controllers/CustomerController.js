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
                                        
                           
    /*customerService.getCustomerList(function(httpcode,data){
        console.log(status);
    },function(httpcode,data){
        console.error(httpcode);
    });
    
    0	January
    1	February
    2	March
    3	April
    4	May
    5	June
    6	July
    7	August
    8	September
    9	October
    10	November
    11	December

    */
                                        
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
    /*customerService.getCustomer($scope.customerId,function(httpcode,data){
          
        $scope.customer = data[0];
        $scope.customerTransactionsMonths = [];
        $scope.monthValues = {};
        $scope.monthValues = [];
        console.log(data[0].transactions.energy);
        angular.forEach(data[0].transactions.energy, function(record, rkey) {
            
            var monthYear = monthNames[record.month] + ' ' + record.year;
            
            $scope.customerTransactionsMonths.push({
                "usage" : record.usage,
                "monthYear" : monthYear
            });
            
            angular.forEach(record.daily_values, function(value, key) {
                
                $scope.monthValues.push(record.daily_values);

            });
        });
        //console.log($scope.monthValues);
        
        $.unblockUI(); 
    },function(httpcode,data){
        
    });*/
                                        
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
        //console.log($scope.transactions);
    },function(httpcode,data){
       // console.error(httpcode);
        $.unblockUI();
        $scope.showMessage('info',SERVER_FAILURE);
        
    });
                                        
    customerService.getContract(function(httpcode,data){
     //   console.log(data);
     //   console.log("zZZZ")
     //   console.log(data.contractBytecode.Carboncoin.info.source);
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
                                        
// rewardPanel, chartPanel  profilePanel
//    $("#profilePanel").height(maxHeight);
//    $("#chartPanel").height(maxHeight);
//    $("#rewardPanel").height(maxHeight);
                                        
  maxHeight = 0;
                                        
//contractPanel, committmentPanel, currentEarningPanel                
                                        
maxHeight = $("#contractPanel").height();                  

var committmentPanelHeight = $("#committmentPanel").height();
var currentEarningPanelHeight = $("#currentEarningPanel").height();
  if(maxHeight<committmentPanelHeight){
      maxHeight = committmentPanelHeight;
  }
  
 if(maxHeight<currentEarningPanelHeight){
      maxHeight = currentEarningPanelHeight;
  }    
  
    //$("#contractPanel").height(maxHeight);
    //$("#committmentPanel").height(maxHeight);
    //$("#currentEarningPanel").height(maxHeight);

}]);
	
	

	

	
