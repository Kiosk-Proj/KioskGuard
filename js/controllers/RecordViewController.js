app.controller('RecordViewController', ['$scope', function($scope) {
    $scope.currentPage = { //defaults
        name: 'transactions',
        url: '/tmpl/transactions.html'
    };
}]);