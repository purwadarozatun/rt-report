var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var httpget = require('./httpget.js');
var peopledata = require('./peoples.json');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(express.static('public'));
app.use("/resource" , express.static('bower_components'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//init global options
var options = {
    host: 'www.rescuetime.com',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

//all request here : 
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "index.htm" );
})

app.get('/rt_data', function(req, res){
   var key = req.query.key;
   var restrict_kind = req.query.restrict_kind;
   var restrict_begin = req.query.restrict_begin;
   var restrict_end = req.query.restrict_end;
   
   options['path'] = '/anapi/data?' +
                'key=' + key + 
                '&perspective=rank' +
                '&restrict_kind=' + restrict_kind +
                '&restrict_begin=' + restrict_begin +
                '&restrict_end=' + restrict_end +
                '&format=json';
   
   httpget.getJSON(options, function(statusCode, result){
       res.send(result);
   });   
})

app.get('/peoples', function(req, res){
})
//end request

var server = app.listen(80, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Rescue Time Report app listening at http://%s:%s", host, port)
})