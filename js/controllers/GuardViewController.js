app.controller('GuardViewController', ['$scope', '$mdDialog', function($scope, $mdDialog) {
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
    $scope.showMoreInfo = function() {
        $mdDialog.show({
            templateUrl: '/tmpl/profile.html',
            controller: 'ProfileController',
            locals: {
                id: 11992
            },
            fullscreen: true
        })
    };
}]);