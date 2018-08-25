app.directive('transactionLogView', function() {
    return {
        restrict: 'E',
        scope: {
            log: '='
        },
        templateUrl: '/tmpl/transaction-log-view.html'
    }
})