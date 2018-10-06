app.controller('StudentViewController', ['$scope', 'Server', '$timeout', '$mdDialog', function($scope, Server, $timeout, $mdDialog) {
    var students = [];
    $scope.students = students;
    Server.listStudents().then(function(retrievedStudents) {
        $timeout(function() {
            students = retrievedStudents;
            $scope.students = retrievedStudents;
        });
    });
    $scope.filter = {
        id: null,
        grade: null,
        out: null,
        privilege: null
    };
    $scope.filterFunctions = {
        id: function(query) {
            return function(student) {
                console.log(query == null ? null : (query.match(/^\d+$/) ? student.id == query : student.name == query));
                return query === null || query == '' || (query.match(/^\d+$/) ? student.id == query : student.name == query);
            }
        },
        grade: function(query) {
            return function(student) {
                return query === null || query == ''  || student.grade == query;
            }
        },
        out: function(query) {
            return function(student) {
                return query === null || !student.in == query;
            }
        },
        privilege: function(query) {
            return function(student) {
                return query === null || student.seniorPriv == query;
            }
        }
    }
    $scope.showMoreInfo = function(student) {
        $mdDialog.show({
            templateUrl: '/tmpl/profile.html',
            controller: 'ProfileController',
            locals: {
                student: student
            },
            fullscreen: true
        });
    };
    $scope.checkForSubmit = function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $scope.submit();
        }
    };
    $scope.submit = function() {
        var filteredStudents = students.slice();
        for (var criterion in $scope.filter) {
            filteredStudents = filteredStudents.filter($scope.filterFunctions[criterion]($scope.filter[criterion]));
            // console.log($scope.filter[criterion]);
            // students.map(i=>console.log(i.out));
        }
        $timeout(function() {
            $scope.students = filteredStudents;
        });
    }
}]);