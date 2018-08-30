app.controller('GuardViewController', ['$scope', '$mdDialog', '$rootScope', 'Server', '$timeout', function($scope, $mdDialog, $rootScope, Server, $timeout) {
    $scope.activeKiosks = ['Sally1', 'Sally2', 'Joe1', 'Joe2', 'Bob1', 'Bob2'];
    $scope.sallyActive = true;
    $scope.joeActive = true;
    $scope.bobActive = true;
    $scope.calculateActiveKiosks = function() {
        $scope.activeKiosks = [];
        if ($scope.sallyActive) {
            $scope.activeKiosks.push('Sally1', 'Sally2');
        }
        if ($scope.joeActive) {
            $scope.activeKiosks.push('Joe1', 'Joe2');
        }
        if ($scope.bobActive) {
            $scope.activeKiosks.push('Bob1', 'Bob2');
        }
    };
    $scope.isWide = function() {
        return $scope.activeKiosks.length <= 3;
    };
    $scope.showMoreInfo = function(student) {
        $mdDialog.show({
            templateUrl: '/tmpl/profile.html',
            controller: 'ProfileController',
            locals: {
                student: student
            },
            fullscreen: true
        })
    };
    $scope.feeds = {
        'Sally1': [],
        'Sally2': [],
        'Joe1': [],
        'Joe2': [],
        'Bob1': [],
        'Bob2': []
    };
    Server.connectSocket();
    var then = new Date();
    then.setTime(then.getTime() - 60*2*1000);
    console.log(then);
    Server.getTransactions({
        start: then.toISOString()
    }).then(function(transactions) {
        return $timeout(function() {
            console.log(transactions);
            angular.forEach(transactions, function(log) {
                $scope.feeds[kioskNames[log.log.kiosk]].push(log);
            });
        });
    });
    var log = [];
    for (var i = 0; i < 1000; i++) {
        log.push({student: {"name":"Claire Yan","path":"YanClaire.jpg","grade":"11","id":"12000","seniorPriv":true,"in":false}, log: {"id":12000,"transaction":0,"date":"2018-08-27T21:01:15Z","kiosk":1,"valid":true}});
    }
    console.log('len', log.length);
    $timeout(function() {$scope.feeds['Sally1'] = log;});
    $rootScope.$on('live:message', function(event, data) {
        data = JSON.parse(data);
        console.log(data.log.kiosk);
        if (!data.log.valid) {
            new Audio('error.mp3').play();
        }
        $timeout(function(){$scope.feeds[kioskNames[data.log.kiosk]].unshift(data);});
    });
    $scope.setFlag = function(transaction, valid) { //this is what happens when you use double negatives, javi
        transaction.flagLoading = true;
        Server.flagTransaction(transaction.log.transaction, valid).then(function() {
            transaction.log.valid = valid;
        }).finally(function() {
            $timeout(function() {transaction.flagLoading = false;});
        });
    };
}]);