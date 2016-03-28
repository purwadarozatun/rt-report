var config = require('../app-config')();

var async = require('asyncawait/async');
var await = require('asyncawait/await');

var db = require('../services/db.js');
var rescuertimeApi = require('../services/rescuetime_api.js');
var people = require("../model/people.js")();

exports.getRawData = function () {
        await(rescuertimeApi.getRawData( people));
}