(function() {
    'use strict';

    angular
        .module('authtest')
        .config(config);

    /** @ngInject */
    function config($logProvider, $resourceProvider, $httpProvider) {

        // Enable log
        $logProvider.debugEnabled(true);

        // Handle token authentication
        $httpProvider.interceptors.push('JWTInterceptor');

        // Setup resource handling wrt the REST API
        $resourceProvider.defaults.stripTrailingSlashes = false;
        $resourceProvider.defaults.actions = {
            'get':    {method:'GET'},
            'create': {method:'POST'},
            'update': {method:'PUT', isArray:false},
            'query':  {method:'GET', isArray:true},
            'delete': {method:'DELETE'}
        };
    }

})();
