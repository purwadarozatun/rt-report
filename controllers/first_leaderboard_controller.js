var cron = require('node-schedule');
var moment = require('moment');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var rescurtimeApi = require('../services/rescuetime_api.js');
var db = require('../services/db.js');
var people = require('../model/people.js');


module.exports = async (function (active , dates) {
    if(active){
        dates.forEach(function (date) {
                rescurtimeApi.calculateLeaderboard(date , people() , function (result) {
                    await(db().delete(("/leaderboard/" + date)));
                    await(db().push("/leaderboard/" + date, result, true));
                    console.log("Finished get data for " + date + " !")
                })
                
        })
    }
});