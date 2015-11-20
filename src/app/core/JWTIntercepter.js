(function() {
    'use strict';

    angular
        .module('authtest')
        .service('JWTInterceptor', JWTInterceptorService);

    /* @ngInject */
    function JWTInterceptorService($q, $location, Auth, Env) {

        var service = {
            request: request,
            responseError: responseError
        };
        return service;

        ////////////////

        function request(config) {
            if (config.url.indexOf(Env.api) >= 0) {
                config.headers = config.headers || {};
                var token = Auth.getToken();
                if (token) {
                    config.headers.Authorization = 'JWT ' + token;
                }
            }
            return config;
        }

        function responseError(rejection) {
            if (Auth.isAuthenticated() && rejection.config.url.indexOf(Env.api)) {
                switch (rejection.status) {
                    case 401:
                        Auth.endSession();
                        Auth.setLoginPath(rejection.config.url);
                        // TODO: Show "you need to login (maybe again)" message
                        $location.url('/login');
                        break;
                    case 403:
                        // TODO: Show "you can't access this bit" message
                        break;
                }
            }
            return $q.reject(rejection);
        }

    }

})();
