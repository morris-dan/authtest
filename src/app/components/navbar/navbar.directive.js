(function() {
  'use strict';

  angular
    .module('authtest')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController(moment, $log, $window, Auth) {
      var vm = this;
      vm.Auth = Auth;

      vm.logout = logout;

      vm.creationDate = 1444609918490;

      // "vm.creation" is avaible by directive option "bindToController: true"
      $log.log(vm, vm.creationDate);
      vm.relativeDate = moment(vm.creationDate); //.fromNow();

      function logout() {
        $log.log('navbar.logout');
        // clear the entire session
        Auth.endSession();
        // hard navigation here, to effectively exit our SPA
        $window.location.reload();
      }

    }

  }

})();
