app.service('Server', ['$http', function($http) {
    function url(endpoint) {
        if (endpoint[0] == '/') endpoint = endpoint.substring(1);
        return 'https://javi.is.a.god/' + endpoint;
    }

    this.listStudents = function() {
        return $http(url('/students'));
    };
    this.getStudent = function(id) {
        return $http(url('/students?id=' + id));
    };
    this.getStudentsOut = function() {
        return $http(url('/students/out'));
    };
    this.isStudentOut = function(id) {
        return $http(url('/students/out?id=' + id));
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
        return $http(url('/transactions' + (query.length !== 0 ? '?' : '') + query));
    };
    this.getAvatarURL = function(id) {
        if (id !== undefined) {
            return url('/img');
        }
        return url('/img?id=' + id);
    }
}]);