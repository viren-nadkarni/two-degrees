var RestServiceProxy = function(configService , $http) {
    siteUrl = configService.siteUrl;
    
    
    var self = this;
    var http = $http;
	getHttpObject = function(){
		return $http;
	}
    errorCodesAwareOptions = function(options) {
        originalOnError = options.onError;
        options.onError = function(code, data) {
            if(code === 503) {
                self.status.get('', {onSuccess: function(code,data){
                    if(code === 200 && data.isMaintenance === true) {
                        window.location.reload();
                        return options;
                    }
                }});
            }
            if (code === 400 && options.on400) {
                return options.on400(code, data);
            }
            if (code === 401 && options.on401) {
                return options.on401(code, data);
            }
            if ((code === 0 || code === 500) && options.on500) {
                return options.on500(code, data);
            }
            if (code !== 0 && originalOnError) {
                return originalOnError(code, data);
            }
        };
        return options;
    };
};

/**
 * Service for proxying all remote rest calls
 * @Class RestServiceProxy
 */
RestServiceProxy.prototype = {
        get : function(endpoint, options ) {
				var http = getHttpObject();
				return http.get(endpoint).then(function (data) {
						return options.onSuccess(data.status,data.data);
				});
		},

        post : function(endpoint, options) {
			var http = getHttpObject();
				return http.post(endpoint,options).then(function (data) {
					//console.log(data);
					return options.onSuccess(data.status,data.data);
					//return data;
				});
        },

        del : function(endpoint, options) {
            
        },

        put : function(endpoint, options) {
            
        }

};