app.factory('configService', function () {
    return new Configuration();
});

app.factory('restServiceProxy', function (configService, $http) {
    return new RestServiceProxy(configService, $http);
});

app.factory('remoteService', function (configService, restServiceProxy, $http) {    
        return new RemoteRestService(configService, restServiceProxy , $http);    
});
