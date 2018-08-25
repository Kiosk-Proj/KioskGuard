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
    $rootScope.$on('live:message', function(event, data) {
        data = JSON.parse(data);
        console.log(data.log.kiosk);
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