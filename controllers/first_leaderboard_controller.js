var cron = require('node-schedule');
var moment = require('moment');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var rescurtimeApi = require('../services/rescuetime_api.js');
var db = require('../services/db.js');
var people = require('../model/people.js');


module.exports = async (function () {
    var dates = ["2016-02"];
    await(dates.forEach(function (date) {
            var result = await(rescurtimeApi.calculateLeaderboard(date , people()))
            await(db().delete(("/leaderboard/" + date)));
            await(db().push("/leaderboard/" + date, result, true));
            await(console.log("Finished get data for " + date + " !"))
            
    }))
});