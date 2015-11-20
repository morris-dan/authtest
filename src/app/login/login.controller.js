(function() {
    'use strict';

    angular
        .module('authtest')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController(Auth, Token, $location, $log) {

        var vm = this;
        vm.title = 'LoginController';

        $log.log('LoginController()');

        vm.login = login;
        vm.username = 'auxilio';
        vm.password = 'darkroom';

        activate();

        ////////////////

        function activate() {
        }

        function loginSuccess() {

            $log.log('loginSuccess');

            $location.url(Auth.getLoginPath());

        }

        function loginFailure() {
            $log.log('loginFailure');
        }

        function login() {
            $log.log('logging in %o %o', vm.username, vm.password);

            Token
              .obtain(vm.username, vm.password)
              .then(loginSuccess, loginFailure);
        }

    }
})();
