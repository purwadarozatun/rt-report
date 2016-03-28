var JsonDB = require('node-json-db');
var config = require('../app-config')();

module.exports = function () {
    var db = new JsonDB(config.database, true, false);
    return db
}