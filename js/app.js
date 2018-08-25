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
    }).filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });

kioskNames = ['Sally1', 'Sally2', 'Joe1', 'Joe2', 'Bob1', 'Bob2'];