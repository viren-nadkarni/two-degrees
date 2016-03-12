/**
 * RemoteRestService
 * @class RemoteRestService
 * @constructor
 * @param configService Configuration service
 * @param restServiceProxy REST proxyService service
 */
var RemoteRestService = function(configService, restServiceProxy ) {
    this.customerListUrl = 'http://localhost:8080/api/v1/customers/';
	this.restServiceProxy = restServiceProxy;
	function onSuccess(){
	}
};
/**
 * Handles all customer management related API calls using REST based ajax APIs
 * @Class RemoteRestService
 */

RemoteRestService.prototype = {

    /**
     * get customers profiles
     * @method getCustomerList
     * @param onSuccess
     * @param onError
     */
    getCustomerList : function(onSuccess ,onError) {
		var url = this.customerListUrl;
    	var url = 'http://localhost:8080/Bluemix/data/data_1.json';
        return this.restServiceProxy.get(url ,{ 
            onSuccess : onSuccess,
            onError : onError,
            on400 : onError
        });
    },
	
}

   