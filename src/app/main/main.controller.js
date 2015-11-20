(function() {
    'use strict';

    angular
        .module('authtest')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($log) {
        var vm = this;

        $log.log('MainController()');

        activate();

        function activate() {
          // do stuff here
        }

    }

})();
