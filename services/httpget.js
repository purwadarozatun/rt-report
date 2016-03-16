var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request');
var Promise = require('promise');

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJson = async(function(options)
{   
  var quote;
  return new Promise(function(resolve, reject) {
    var requestData = options.host + options.path
    request(requestData ,   function(error, response, body) {
      quote =  body
      resolve(quote);
    });
  });
});