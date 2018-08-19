app.service('Server', ['$rootScope', '$http', '$timeout', function($rootScope, $http, $timeout) {

    var self = this;
    this._ws = null;

    function url(endpoint, protocol) {
        if (endpoint[0] === '/') endpoint = endpoint.substring(1);
        return protocol + '://javi.is.a.god/' + endpoint;
    }

    function httpurl(endpoint) {
        return url(endpoint, 'http');
    }

    this.listStudents = function() {
        return $http(httpurl('/students'));
    };
    this.getStudent = function(id) {
        return $http(httpurl('/students?id=' + id));
    };
    this.getStudentsOut = function() {
        return $http(httpurl('/students/out'));
    };
    this.isStudentOut = function(id) {
        return $http(httpurl('/students/out?id=' + id));
    };
    this.getTransactions = function(opt) {
        var props = ['start', 'end', 'kiosk', 'student'];
        var data = props.map(function(i) {
            return i in opt ? [i, opt[i]] : null;
        }).filter(function(i) {
            return i !== null;
        });
        var query = data.map(function(i) {
            return i.join('=');
        }).join('&');
        return $http(httpurl('/transactions' + (query.length !== 0 ? '?' : '') + query));
    };
    this.getAvatarURL = function(id) {
        if (id !== undefined) {
            return httpurl('/img');
        }
        return httpurl('/img?id=' + id);
    };

    this.connectSocket = function() {
        self._ws = new WebSocket(url('/live', 'ws'));

        return new Promise(function(resolve, reject) {
            var timeout = $timeout(function() {
                self._ws.close();
                self._ws = null;
                reject();
            }, 5000, false);
            var response = function() {
                timeout.cancel();
                self._ws.removeEventListener('open', response);
                self._ws.addEventListener('message', self._messageHandler);
                resolve();
            };
            self._ws.addEventListener('open', response);
        });
    };

    this.closeSocket = function() {
        self._ws.removeEventListener('message', self._messageHandler);
        return new Promise(function(resolve, reject) {
            var response = function() {
                self._ws.removeEventListener('close', response);
                self._ws = null;
                resolve();
            };
            self._ws.addEventListener('close', response);
            self._ws.close();

        });
    };

    this._messageHandler = function(event) {
        $rootScope.$broadcast('live:message', event.data);
    }
}]);