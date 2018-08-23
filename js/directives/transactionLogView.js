app.directive('transactionLogView', function() {
    return {
        restrict: 'E',
        scope: {
            feed: '='
        },
        templateUrl: '/tmpl/transaction-log-view.html'
    }
})