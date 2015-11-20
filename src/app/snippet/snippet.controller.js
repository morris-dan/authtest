(function() {
    'use strict';

    angular
        .module('authtest')
        .controller('SnippetController', SnippetController);

    /* @ngInject */
    function SnippetController($log, Snippet) {

        var vm = this;
        vm.title = 'SnippetController';

        $log.log('SnippetController()');

        vm.snippets = [];

        activate();

        ////////////////
        ///
        function snippetSuccess(response) {
            $log.log('snippetSuccess', response, vm.snippets);
        }

        function snippetFail(response) {
            $log.log('snippetFail', response);
        }

        function activate() {
            vm.snippets = Snippet.query({}, snippetSuccess, snippetFail);
        }

    }
})();
