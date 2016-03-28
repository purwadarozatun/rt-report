var cron = require('node-schedule');
var moment = require('moment');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var leaderboardService = require("../services/leaderboard_service.js");
var rawdataService = require("../services/rawdata_service.js");

var getRawDataCron = function () {
        var rule = new cron.RecurrenceRule();
        rule.dayOfWeek = [0, new cron.Range(0, 4)];
        rule.hour = 3;
        rule.minute = 10;
        cron.scheduleJob(rule, function(){
            await(rawdataService.getRawData());
        });
    }
    var calculateLeaderboardCron = function () {
        var rule = new cron.RecurrenceRule();
        rule.dayOfWeek = [0, new cron.Range(0, 4)];
        rule.hour = 5;
        rule.minute = 10;
        cron.scheduleJob(rule, function(){
            console.log('Get data! Started At' + new Date());
            var date = moment(new Date()).format("YYYY-MM");
            await(leaderboardService.calculateLeaderboard(date));
        });
    }

module.exports = async(function () {
    getRawDataCron();
    calculateLeaderboardCron();
})