app.controller('GuardViewController', ['$scope', function($scope) {
    $scope.activeKiosks = ['Sally1', 'Sally2', 'Joe1', 'Joe2', 'Bob1', 'Bob2'];
    $scope.isWide = function() {
        return $scope.activeKiosks.length <= 3;
    };
}]);