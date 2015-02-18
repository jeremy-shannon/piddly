// public/core.js

var app = angular.module('jeremyApp', []);

app.controller('MainCtrl', function($scope, $http) {
    $scope.theNumber = 0;

    $scope.getNumber = function() {
        $scope.theNumber = 10 * Math.random();
    };


    // when landing on the page, get all scores and show them
    $http.get('/api/scores')
        .success(function(data) {
            $scope.scores = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.saveScore = function() {
        $http.post('/api/scores', {name : $scope.yourName, score : $scope.theNumber})
            .success(function(data) {
                $scope.scores = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        $scope.theNumber = 0;
    };
});


/*
angular.module('jeremyApp', [])
    .controller('mainController',['$scope', function($scope) {
        $scope.theNumber = '0';
       $scope.getNumber = function() {
            $scope.theNumber = 10 * Math.random();
        };
    }]);

    // when landing on the page, get all todos and show them
    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    */


