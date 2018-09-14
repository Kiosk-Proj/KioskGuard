app.service('Server', ['$rootScope', '$http', '$timeout', '$browser', function($rootScope, $http, $timeout, $browser) {

    var self = this;
    this._ws = null;

    var dataParser = function(res) {
        return res.data;
    };
    function url(endpoint, protocol) {
        if (endpoint[0] === '/') endpoint = endpoint.substring(1);
        return protocol + '://IP_HERE:55622/' + endpoint;
    }

    function httpurl(endpoint) {
        return url(endpoint, 'http');
    }

    this.listStudents = function() {
        // console.log('listing...', httpurl('/students'));
        return $http.get(httpurl('/students')).then(dataParser);
    };

    this.getStudent = function(id) {
        return $http.get(httpurl('/students?id=' + id)).then(dataParser);
    };
    this.getStudentsOut = function() {
        return $http.get(httpurl('/students/out')).then(dataParser);
    };
    this.isStudentOut = function(id) {
        return $http.get(httpurl('/student/out?id=' + id)).then(dataParser);
    };
    this.getTransactions = function(opt) {
        opt = opt || {};
        // var props = ['start', 'end', 'kiosks', 'id', 'name', 'valid'];
        // var data = props.map(function(i) {
        //     return i in opt && opt[i] !== null ? [i, encodeURIComponent(opt[i])] : null;
        // }).filter(function(i) {
        //     return i !== null;
        // });
        var data = [];
        angular.forEach(opt, function(val, param) {
            if (val !== null) data.push([param, encodeURIComponent(val)]);
        });
        var query = data.map(function(i) {
            return i.join('=');
        }).join('&');
        console.log(httpurl('/transactions' + (query.length !== 0 ? '?' : '') + query));
        return $http.get(httpurl('/transactions' + (query.length !== 0 ? '?' : '') + query)).then(dataParser).then(function(data) {
            return studentCacheMap.then(function(students) {
                return data.map(function(i) {
                    return {
                        student: students[i.id],
                        log: i
                    };
                });
            })
        });
    };
    this.flagTransaction = function(transactionID, valid) {
        return $http.get(httpurl('/tablet/flag?id=' + transactionID + '&flagged=' + (valid?1:0))).then(dataParser);
    };
    this.getAvatarURL = function(id) {
        return $http.get(httpurl('/img?id=' + id)).then(dataParser).then(function(url) {
            return '/avatars/' + url;
        })
    };
    this.connectSocket = function() {
        self._ws = new WebSocket(url('/socket/websocket', 'ws'));
        self._ws.addEventListener('open', self._connectHandler);
        self._ws.addEventListener('close', self._disconnectHandler);

        return new Promise(function(resolve, reject) {
            var timeout = $timeout(function() {
                self._ws.close();
                self._ws = null;
                reject();
            }, 5000, false);
            var response = function() {
                $timeout.cancel(timeout);
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

    this._disconnectHandler = function() {
        $rootScope.$broadcast('live:connection', true);
    };

    this._connectHandler = function() {
        $rootScope.$broadcast('live:connection', false);
    };

    this._messageHandler = function(event) {
        console.log(event.data);
        $rootScope.$broadcast('live:message', event.data);
    };

    var studentCacheList = this.listStudents();
    var studentCacheMap = studentCacheList.then(function(data) {
        return data.reduce(function(acc, curr) {
            acc[curr.id] = curr;
            return acc;
        }, []);
    });

    this.getStudentListCache = function() {
        return studentCacheList;
    };
    this.getStudentMapCache = function() {
        return studentCacheMap;
    };
}]);

