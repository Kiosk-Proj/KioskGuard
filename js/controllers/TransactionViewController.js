app.controller('TransactionViewController', ['$scope', '$mdpTimePicker', function($scope) {
    $scope.transactions = Array.apply(null, {length: 100}).map(Number.call, Number);
}]);