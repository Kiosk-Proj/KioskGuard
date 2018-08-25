app.controller('TransactionViewController', ['$scope', '$mdpTimePicker', 'Server', function($scope, $mdpTimePicker, Server) {
    $scope.log = [];
    Server.getTransactions().then(function(transactions) {
        $scope.log = transactions;
        console.log($scope.log);
    })
}]);