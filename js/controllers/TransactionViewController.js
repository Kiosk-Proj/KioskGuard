app.controller('TransactionViewController', ['$scope', '$mdpTimePicker', 'Server', '$timeout', function($scope, $mdpTimePicker, Server, $timeout) {
    var log = [];
    // for (var i = 0; i < 144000; i++) {
    //     log.push({student: {"name":"Claire Yan","path":"YanClaire.jpg","grade":"11","id":"12000","seniorPriv":true,"in":false}, log: {"id":12000,"transaction":0,"date":"2018-08-27T21:01:15Z","kiosk":1,"valid":true}});
    // }
    // console.log('len', log.length);
    $scope.log = log;
    Server.getTransactions().then(function(transactions) {
        console.log('len', transactions.length);
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
            opt.valid = filter.valid;
        }
        if ('violations' in filter) {
            opt.violations = filter.violations;
        }
        return opt;
    }
    $scope.submit = function() {
        var options = process($scope.filter);
        Server.getTransactions(options).then(function(transactions) {
            $timeout(function() {$scope.log = transactions;});
        });
    };

    $scope.download = function(data) {
        var key = ['NAME', 'ID', 'TIME', 'VALID', 'KIOSK'];
        var rows = [];
        rows.push(key.join(','));
        for (let i = 0; i < data.length; i++) {
            var log = data[i];
            var entry = [log.student.name, log.student.id, log.log.date.toISOString(), log.log.valid, kioskNames[log.log.kiosk]];
            rows.push(entry.join(','));
        }
        var csv = encodeURIComponent(rows.join('\n'));
        var link = document.createElement('a');
        link.href = 'data:text/csv,' + csv;
        link.style.visibility = 'hidden';
        document.querySelector('body').appendChild(link);
        link.click();
    };

    $scope.checkForSubmit = function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $scope.submit();
        }
    }
}]);