var app = angular.module('KioskGuard', ['ngMaterial', 'md.time.picker'])
    .factory('preventTemplateCache', function($injector) {
        return {
            'request': function(config) {
                if (config.url.indexOf('tmpl') !== -1) {
                    config.url = config.url + '?t=' + Date.now();
                }
                return config;
            }
        }
    })
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('preventTemplateCache');
    });