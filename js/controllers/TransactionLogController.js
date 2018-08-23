app.controller('TransactionFeedController', ['$scope', function($scope) {

    $scope.transactions = Array.apply(null, {length: 100}).map(Number.call, Number);
}]);