var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cron = require('node-schedule');
var JsonDB = require('node-json-db');
var moment = require('moment')

var rescurtimeApi = require('./services/rescuetime_api.js');
var peopledata = require('./people.json');
var database = require('./database.json');

var db = new JsonDB("database", true, false);

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


app.get('/rt_data', function(req, res){
    rescurtimeApi.getBasicData(req , function (code , result) {
        res.send(result)
    });
})

app.get('/rt_leaderboard', function(req, res){
    var date = req.query.selectedMonth ? req.query.selectedMonth : "2016-03";
    var data = db.getData("/leaderboard/" + date)
    res.send(data)
})

app.get('/people', function(req, res){
    res.send(peopledata);
})


//end request

var rule = new cron.RecurrenceRule();
rule.dayOfWeek = [0, new cron.Range(0, 4)];
rule.hour = 1;
rule.minute = 0;

cron.scheduleJob(rule, function(){
    console.log('Get data!');
    var date = moment(new Date()).format("YYYY-DD");
    rescurtimeApi.calculateLeaderboard(date , peopledata , function (result) {
        db.push("/leaderboard/" + date, result, true);
        console.log("Finished get data for " + date + " !")
    });
});


var dates = ["2016-02"];
dates.forEach(function (date) {
    
        rescurtimeApi.calculateLeaderboard(date , peopledata , function (result) {
            db.delete(("/leaderboard/" + date));
            db.push("/leaderboard/" + date, result, true);
            console.log("Finished get data for " + date + " !")
        });
        
})

var server = app.listen(9000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Rescue Time Report app listening at http://%s:%s", host, port)
})