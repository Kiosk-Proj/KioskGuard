app.controller('TransactionFeedController', ['$scope', 'Server', '$timeout', function($scope, Server, $timeout) {

    // $scope.transactions = Array.apply(null, {length: 100}).map(Number.call, Number);
    $scope.setFlag = function(transaction, valid) { //this is what happens when you use double negatives, javi
        transaction.flagLoading = true;
        Server.flagTransaction(transaction.log.transaction, valid).then(function() {
           transaction.log.valid = valid;
        }).finally(function() {
            $timeout(function() {transaction.flagLoading = false;});
        });
    };
    $scope.kioskNames = kioskNames;
}]);