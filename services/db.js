var JsonDB = require('node-json-db');

module.exports = function () {
    var db = new JsonDB("database", true, false);
    return db
}