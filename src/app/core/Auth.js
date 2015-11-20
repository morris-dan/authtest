(function() {
    'use strict';

    angular
        .module('authtest')
        .service('Auth', AuthService);

    /* @ngInject */
    function AuthService($sessionStorage, jwtHelper, moment) {

        // Auth state/session functions

        var storage = $sessionStorage;

        var service = {
            clearToken: clearToken,
            setToken: setToken,
            getToken: getToken,
            getExpiry: getExpiry,
            expiresWithin: expiresWithin,
            isAuthenticated: isAuthenticated,
            getLoginPath: getLoginPath,
            setLoginPath: setLoginPath,
            endSession: endSession
        };
        return service;

        ////////////////

        function clearToken() {
            delete storage.token;
        }
        function setToken(token) {
            storage.token = token;
        }
        function getToken() {
            var t = storage.token;
            if (t && jwtHelper.isTokenExpired(t)) {
                this.clearToken();
            } else {
                return t;
            }
        }
        function getExpiry() {
            var t = storage.token;
            if (t) {
                return jwtHelper.getTokenExpirationDate(t);
            }
        }
        function expiresWithin(seconds) {
            return this.getExpiry() < moment().add(seconds, 'seconds');
        }
        function isAuthenticated() {
            var token = this.getToken();
            return token !== null && token !== undefined;
        }
        function getLoginPath() {
            var path = storage.authLoginPath || '/';
            delete storage.authLoginPath;
            return path;
        }
        function setLoginPath(path) {
          storage.authLoginPath = path;
        }
        function endSession() {
          storage.$reset();
        }

    }

})();

