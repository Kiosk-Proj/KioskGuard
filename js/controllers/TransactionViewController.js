app.controller('TransactionViewController', ['$scope', '$mdpTimePicker', 'Server', '$timeout', function($scope, $mdpTimePicker, Server, $timeout) {
    $scope.log = [];
    Server.getTransactions().then(function(transactions) {
        $timeout(function() {$scope.log = transactions;});
    });

    $scope.filter = {
        kiosks: [true,true,true,true,true,true],
        start: {
            date: new Date(0),
            time: new Date(0)
        }, end: {
            date: new Date(),
            time: new Date()
        }
    };
    function process(filter) {
        // console.log(filter.start.date);
        var opt = {};
        opt.kiosks = filter.kiosks.map(function(i,j) {
            if (i) return j;
            else return null;
        }).filter(function(i) {
            return i !== null;
        });
        filter.start.date.setHours(0, 0, 0);
        filter.end.date.setHours(0, 0, 0);
        opt.start = new Date(filter.start.date.valueOf());
        opt.start.setTime(opt.start.getTime() + filter.start.time.getHours()*60*60*1000 + filter.start.time.getMinutes()*60*1000 + filter.start.time.getSeconds()*1000);
        opt.start = opt.start.toISOString();
        opt.end = new Date(filter.end.date.valueOf());
        opt.end.setTime(opt.end.getTime() + filter.end.time.getHours()*60*60*1000 + filter.end.time.getMinutes()*60*1000 + filter.end.time.getSeconds()*1000);
        opt.end = opt.end.toISOString();
        if ('name' in filter) {
            opt.name = filter.name;
        }
        if ('id' in filter) {
            opt.id = filter.id;
        }
        if ('valid' in filter && filter.valid !== null) {
            opt.valid = filter.valid ? 1 : 0;
        }
        return opt;
    }
    $scope.submit = function() {
        var options = process($scope.filter);
        Server.getTransactions(options).then(function(transactions) {
            $timeout(function() {$scope.log = transactions;});
        });
    }
}]);