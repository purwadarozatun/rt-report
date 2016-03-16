var cron = require('node-schedule');
var moment = require('moment');

var rescurtimeApi = require('../services/rescuetime_api.js');
var db = require('../services/db.js');
var people = require('../model/people.js');


module.exports = function () {
    var rule = new cron.RecurrenceRule();
    rule.dayOfWeek = [0, new cron.Range(0, 4)];
    rule.hour = 1;
    rule.minute = 0;
    cron.scheduleJob(rule, function(){
        console.log('Get data!');
        var date = moment(new Date()).format("YYYY-DD");
        rescurtimeApi.calculateLeaderboard(date , people , function (result) {
            db.delete(("/leaderboard/" + date));
            db.push("/leaderboard/" + date, result, true);
            console.log("Finished get data for " + date + " !")
        });
    });
    
    
}