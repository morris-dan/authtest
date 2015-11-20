angular
    .module('authtest.env', [])
    .constant('Env', {
        'version':'0.0.3',
        'frontend':'http://localhost:3000',
        'api':'http://localhost:8000',
        'admin':'http://localhost:8001',
        'GoogleAnalyticsAccount':'UA-54133550-3'
    })
;
