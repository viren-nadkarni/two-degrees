/**
 * CustomerRestService
 * @class CustomerRestService
 * @constructor
 * @param configService Configuration service
 * @param restServiceProxy REST proxyService service
 */
var CustomerRestService = function(configService, restServiceProxy ) {
    this.configService = configService;
	this.restServiceProxy = restServiceProxy;

};


CustomerRestService.prototype = {
    
    //
    /**
     * get contract
     * @method getCustomerList
     * @param onSuccess
     * @param onError
     */
    getContract : function(onSuccess ,onError) {
		var url = this.configService.siteUrl+"contract";
    	//var url = 'http://localhost:8080/Bluemix/data/data_1.json';
        return this.restServiceProxy.get(url ,{ 
            onSuccess : onSuccess,
            onError : onError,
            on400 : onError,
            on404 : onError
        });
    },
    
    /**
     * get customers transactions
     * @method getCustomerList
     * @param onSuccess
     * @param onError
     */
    getCustomerTransactions : function(id,onSuccess ,onError) {
		var url = this.configService.siteUrl+"/logs/transactions/"+id;
        return this.restServiceProxy.get(url ,{ 
            onSuccess : onSuccess,
            onError : onError,
            on400 : onError,
            on404 : onError
        });
    },
    
    
    /**
     * get customers stats
     * @method getCustomerList
     * @param onSuccess
     * @param onError
     */
    getCustomerStats : function(id,onSuccess ,onError) {
		var url = this.configService.siteUrl+"/stats/"+id;
        return this.restServiceProxy.get(url ,{ 
            onSuccess : onSuccess,
            onError : onError,
            on400 : onError,
            on404 : onError
        });
    },
    
}

   