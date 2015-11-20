(function() {
    'use strict';

    angular
        .module('authtest')
        .service('Token', TokenService);

    /* @ngInject */
    function TokenService($http, Auth, Env) {

        /**
        * Ensures that our app has the token stored in its session storage
        * @param  {Json} data Json response from server
        */
        var onSuccess = function(data) {
            Auth.setToken(data.token);
        };

        var service = {
            obtain: obtain,
            facebook: facebook,
            refresh: refresh
        };
        return service;

        ////////////////

        /**
         * Obtain an auth token from the server based on the passed credentials.
         * @param  {string} username
         * @param  {string} password
         * @return {$promise}           Promise for resolving from http response
         */
        function obtain(username, password) {
          Auth.clearToken();
          return $http.post(Env.api + '/token/obtain/', {'username': username, 'password': password}).success(onSuccess);
        }

        /**
         * Requests an authorisation token given an access token from facebook
         * @param  {string} accessToken Access token from facebook
         * @return {$promise}           Promise for resolving from http response
         */
        function facebook(accessToken) {
          Auth.clearToken();
          return $http.post(Env.api + '/token/obtain-fb/', {'facebook_access_token': accessToken}).success(onSuccess);
        }

        /**
         * Checks whether the token is due to expire within the passed-in number of [seconds]
         * @param  {int} seconds The number of seconds we want to see whether token expires within
         * @return {$promise}    Promise for resolving from http response
         */
        function refresh(seconds) {
          var t = Auth.getToken();
          if (t && (!seconds || Auth.expiresWithin(seconds))) {
            return $http.post(Env.api + '/token/refresh/', {token:t}).success(onSuccess);
          }
        }

    }

})();

