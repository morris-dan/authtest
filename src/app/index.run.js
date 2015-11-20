(function() {
  'use strict';

  angular
    .module('authtest')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, Auth, $location, $log) {

    $log.debug('runBlock end');

    $rootScope.$on('$routeChangeStart', function(event, nextRoute) { // , currentRoute) {

        if (nextRoute.secure && !Auth.isAuthenticated()) {
            event.preventDefault();
            $log.log('routeChangeStart', $location.url());
            Auth.setLoginPath($location.url());
            $location.url('/login');
        }

    });


  }

})();
