(function() {
  'use strict';

    angular
        .module('authtest')
        .config(routeConfig);

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/snippets', {
                templateUrl: 'app/snippet/snippet.html',
                controller: 'SnippetController',
                controllerAs: 'snippet',
                secure: true
            })
            .when('/', {
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .when('/login', {
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'login'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

})();
