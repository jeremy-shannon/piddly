var express = require('express');
var cool = require('cool-ascii-faces');
var app = express();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var path = require('path');


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


var mySchema = new mongoose.Schema({
  myname: String
});

var myNames = mongoose.model('Test',mySchema, 'test');

app.get('/', function(req, res) {
    var theName = '';
    myNames.findOne({}).exec(function(err,result) {
        if (!err) {
 /*           console.log('hey');
            console.log(result);
            theName = result.myname;
            console.log(theName);
            var outputString = '';
            var times = process.env.TIMES * 2 || 5
            for (i=0; i < times; i++) {
                outputString += theName + '<br>';
                outputString += cool() + '<br>';
            }*/
            res.sendFile(path.join(__dirname + '/index.html'));
        }
    });
});

app.get('/core.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/core.js'));
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
