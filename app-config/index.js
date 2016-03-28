var config = require('../config.json')
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'production'] || config.local;
}