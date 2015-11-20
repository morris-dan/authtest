(function() {
    'use strict';

    angular
        .module('authtest')
        .factory('Snippet', Snippet);

    /* @ngInject */
    function Snippet($resource, Env) {

        return $resource(Env.api + '/snippets/', {}, {
            get: {
                  method: 'GET',
                  isArray: true
                }
        });

        ////////////////

    }
})();
