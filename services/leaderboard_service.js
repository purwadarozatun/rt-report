var config = require('../app-config')();

var async = require('asyncawait/async');
var await = require('asyncawait/await');

var db = require('../services/db.js');
var rescurtimeApi = require('../services/rescuetime_api.js');
var people = require("../model/people.js")();

exports.calculateLeaderboard = function (date) {
        rescurtimeApi.calculateLeaderboard(date , people , function (result) {
            await(db().delete(("/leaderboard/" + date)));
            await(db().push("/leaderboard/" + date, result, true));
            console.log("Finished get data for " + date + " !")
        })
}