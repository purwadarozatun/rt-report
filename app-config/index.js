var config = require('../config.json')
module.exports = function(mode) {
    
    if(( typeof config != 'undefined') ){
        return config[mode || process.argv[2] || 'production'] || config;
    }else{
        console.log("Please Fill Config File");
    }
}