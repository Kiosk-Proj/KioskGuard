app.directive('transactionLogView', function() {
    return {
        restrict: 'E',
        scope: {
            log: '=',
            infoEnabled: '='
        },
        templateUrl: '/tmpl/transaction-log-view.html'
    }
})