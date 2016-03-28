var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment')
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var rescurtimeApi = require('./services/rescuetime_api.js');
var peopledata = require('./model/people.js')();
var db = require('./services/db.js');
var config = require('./app-config')();
var leaderboardController = require("./controllers/leaderboard_controller.js")()
var cronController = require("./controllers/cron_controller.js")


cronController();
leaderboardController.calculateLeaderboard(['2016-03']);

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('public'));
app.use("/resource" , express.static('bower_components'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//all request here : 
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "index.htm" );
})

app.get('/rt_data', async(function(req, res){
    res.send(await(rescurtimeApi.getBasicData(req )));
}))

app.get('/rt_leaderboard', function(req, res){
    var date = req.query.selectedMonth ? req.query.selectedMonth : "2016-03";
    var data = db().getData("/leaderboard/" + date)
    res.send(data)
})

app.get('/people', function(req, res){
    res.send(peopledata);
})



var server = app.listen(config.port, function () {
  var port = server.address().port
  console.log("Rescue Time Report app listening at Port " +  port)
})
