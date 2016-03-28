var cron = require('node-schedule');
var moment = require('moment');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var leaderboardService = require("../services/leaderboard_service.js")
var rawdataService = require("../services/rawdata_service.js");

module.exports = function () {
    return {
        calculateLeaderboard : async (function (  dates) {
                dates.forEach(function (date) {
                    await(rawdataService.getRawData());
                    await(leaderboardService.calculateLeaderboard(date));
                })
        })
    }
};