var cron = require('node-schedule');
var moment = require('moment');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var rescurtimeApi = require('../services/rescuetime_api.js');
var db = require('../services/db.js');
var people = require('../model/people.js');


module.exports = async(function () {
    var rule = new cron.RecurrenceRule();
    rule.dayOfWeek = [0, new cron.Range(0, 4)];
    rule.hour = 3;
    rule.minute = 10;
    cron.scheduleJob(rule, function(){
        console.log('Get data! Started At' + new Date());
        var date = moment(new Date()).format("YYYY-MM");
        rescurtimeApi.calculateLeaderboard(date , people() , function (result) {
                    await(db().delete(("/leaderboard/" + date)));
                    await(db().push("/leaderboard/" + date, result, true));
                    console.log("Finished get data for " + date + " !")
                })
    });
    
    
})