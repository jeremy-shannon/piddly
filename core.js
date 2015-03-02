// public/core.js

var app = angular.module('jeremyApp', []);

app.controller('MainCtrl', function($scope, $http, $interval, $timeout) {
    $scope.theNumber      = 0;   // player score
    $scope.listLength     = 10;  // number of scores to show
    $scope.currentScore   = 0;   // for showing current score in list of scores
    $scope.currentRank    = 0;   // for showing current rank in list of scores
    $scope.currentName    = '';  // for showing current name in list of scores
    var numberOfDigits    = 8;   // number of digits that scores have
    var spinsPerDigit     = 50;  // number of times a digit "spins" before stopping
    var digitSpinDuration = 2;  // number of milliseconds that a single "spin" lasts
    var nextDigitWait     = 300;  // number of milliseconds to wait before "spinning" the next digit
    var alertState        = false;  // flag for "no saving a score of zero" alert


    $scope.showAlert = function() {
        return alertState;
    };

    $scope.getNumber = function() {
        // gets a random number; displays it digit by digit, similiar to a slot machine
        var storedNumber, digit;
        storedNumber = 0;  // the number so far, i.e. the less significant digits are stored
        digit = 0;  // the current digit being "spun"

        for(i=0;i<numberOfDigits;i++) {
            (function(index){
                // the function above allows the current value of i to be passed to the timeout function, otherwise future values of i (all of them = to numberOfDigits) will be passed
                $timeout(function(){
                    $interval(function(){
                        console.log(index);  // debug
                        digit = Math.floor(10*Math.random());  // get a digit 0-9
                        digit = (digit * Math.pow(10,(-(numberOfDigits-1) + index))).toFixed(numberOfDigits-1);  // send it to the place of the digit being spun
                        digit = (1*digit + 1*storedNumber).toFixed(numberOfDigits-1);  // add already-spun less-significant digits before displaying to screen
                        $scope.theNumber = digit;  // display to screen
                    }, digitSpinDuration, spinsPerDigit);
                    storedNumber = digit;
                },nextDigitWait*index);
                // wait X ms before spinning the next digit
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
            // don't save a score of 0
            alertState = true;
        } else {
            $scope.currentRank = 1;
            $scope.currentName = $scope.yourName;
            $scope.currentScore = $scope.theNumber;
            // add score to the list
            $http.post('/api/scores', {name : $scope.yourName, score : $scope.theNumber})
                .success(function(data) {
                    $scope.scores = data;
                    // determine current rank based on score
                    for (item in data) {
                        if (data[item].score > $scope.currentScore) {
                                $scope.currentRank++;
                        }
                    }
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            // reset score to zero
            $scope.theNumber = 0;
        }
    };
});

