app.controller('ProfileController', ['$scope', '$mdDialog', 'Server', 'student', function($scope, $mdDialog, Server, student) {
    $scope.cancel = $mdDialog.cancel;
    $scope.student = student;
    console.log(student);
    $scope.log = [];
    Server.getTransactions({
        student: student.id
    }).then(function(transactions) {
        $scope.log = transactions;
        console.log($scope.log);
    })
}]);