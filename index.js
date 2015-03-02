var express = require('express');
var cool = require('cool-ascii-faces');
var app = express();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)


app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
console.log(process.env.MONGOLAB_URI);
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/HelloMongoose';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
      console.log ('Succeeded connected to: ' + uristring);
  }
});
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


var scoresSchema = new mongoose.Schema({
  name: String,
  score: Number
});

var scoresList = mongoose.model('ScoreList',scoresSchema, 'scoreList');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// get all scores
app.get('/api/scores', function(req, res) {

    // use mongoose to get all scores in the database
    scoresList.find({}).sort('-score').exec(function(err, scores) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(scores); // return all scores in JSON format
    });
});

// create score and send back all scores after creation
app.post('/api/scores', function(req, res) {

    // create a score, information comes from AJAX request from Angular
    scoresList.create({
        name : req.body.name,
        score : req.body.score,
        done : false
    }, function(err, score) {
        if (err)
            res.send(err);

        // get and return all the scores after you create another
        scoresList.find({}).sort('-score').exec(function(err, scores) {
            if (err)
                res.send(err)
            res.json(scores);
        });
    });

});

app.get('/core.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/core.js'));
});

app.get('/app.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/app.css'));
});

app.get('/WebBackground.jpg', function(req, res) {
    res.sendFile(path.join(__dirname + '/WebBackground.jpg'));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
