// public/core.js

var app = angular.module('jeremyApp', []);

app.controller('MainCtrl', function($scope, $http, $interval, $timeout) {
    $scope.theNumber = 0;
    $scope.rowClass = '';
    $scope.listLength = 20;
    var alertState = false;
    $scope.currentScore = 0;
    $scope.currentRank = 0;
    $scope.currenName = '';
    var numberOfDigits = 8;

    $scope.showAlert = function() {
        return alertState;
    };

    $scope.getNumber = function() {
        var storedNumber, digit;
        storedNumber = 0;
        digit = 0;

        // for(j=0;j<99;j++) {
        //     $timeout(function(){
        //         digit = Math.floor(10*Math.random());
        //         digit = (digit * Math.pow(10,(-2))).toFixed(2);
        //         $scope.theNumber = digit ;
        //     },j);
        // }

        // $timeout(function(){
        //     storedNumber = digit*1;
        //     console.log(storedNumber);
        // },100);

        // for(j=0;j<99;j++) {
        //     $timeout(function(){
        //         digit = Math.floor(10*Math.random());
        //         digit = (digit * Math.pow(10,(-1)));
        //         digit = (digit*1 + storedNumber).toFixed(2);
        //         $scope.theNumber = digit;
        //     },j+100);
        // }


        for(i=0;i<numberOfDigits;i++) {
            (function(index){
                $timeout(function(){
                    $interval(function(){
                        console.log(index);
                        digit = Math.floor(10*Math.random());
                        digit = (digit * Math.pow(10,(-(numberOfDigits-1) + index))).toFixed(numberOfDigits-1);
                        digit = (1*digit + 1*storedNumber).toFixed(numberOfDigits-1);
                        $scope.theNumber = digit;
                    }, 1, 33);
                    storedNumber = digit;
                },160*index);
            })(i);
        }

        alertState = false;
    };


    // when landing on the page, get all scores and show them
    $http.get('/api/scores')
        .success(function(data) {
            $scope.scores = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.saveScore = function() {
        if ($scope.theNumber === 0) {
            alertState = true;
        } else {
            $scope.currentRank = 1;
            $scope.currentName = $scope.yourName;
            $scope.currentScore = $scope.theNumber;
            $http.post('/api/scores', {name : $scope.yourName, score : $scope.theNumber})
                .success(function(data) {
                    $scope.scores = data;
                    for (item in data) {
                        if (data[item].score > $scope.currentScore) {
                                $scope.currentRank++;
                        }
                    }
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            $scope.theNumber = 0;
        }
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


