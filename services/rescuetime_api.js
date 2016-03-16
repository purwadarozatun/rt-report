var httpget = require('./httpget.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

//init global options
var options = {
    host: 'http://www.rescuetime.com'
};


var getLeaderboardData = async(function(req)
{   
    options['path'] = '/anapi/daily_summary_feed?' +
                    'key=' + req.code  
    return await(httpget.getJson(options))

});


var secondToTime = function (secs){
     var hours = Math.floor(secs / (60 * 60));
   
     var divisor_for_minutes = secs % (60 * 60);
     var minutes = Math.floor(divisor_for_minutes / 60);
            
     var obj = {
        "h": hours,
        "m": minutes
     };
     return obj
}


var calculateDetail = function name(selectedResult) {
    var spendTime = 0;
    var prodPoint = 0;
    selectedResult.forEach(function(selected) {
         spendTime += (selected.total_hours * 3600)
         prodPoint += selected.productivity_pulse
    })
    return {spendTime : spendTime , prodAve : prodPoint / selectedResult.length}
}

exports.getBasicData = async(function(request)
{
    var key = request.query.key;
    var restrict_kind = request.query.restrict_kind;
    var restrict_begin = request.query.restrict_begin;
    var restrict_end = request.query.restrict_end;
    
    options['path'] = '/anapi/data?' +
                    'key=' + key + 
                    '&perspective=rank' +
                    '&restrict_kind=' + restrict_kind +
                    '&restrict_begin=' + restrict_begin +
                    '&restrict_end=' + restrict_end +
                    '&format=json';
                    
    var result= await(httpget.getJson(options))
    return JSON.parse(result)
});

exports.calculateLeaderboard = async(function (date , peopledata , onResult) {
   
    var returnedData  = new Array();
    
    
    await(peopledata.forEach(function(entry, index) {
        
        var result = await(getLeaderboardData({code : entry.code}))
        result = JSON.parse(result)
        var selectedResult  = await(result.filter(function(o){return o.date.indexOf(date) > -1}));
                
        var detail = await(calculateDetail(selectedResult))
        if(detail.prodAve){
            await(returnedData.push({
                        code :entry.code,
                        name : entry.name ,
                        prodAve :detail.prodAve,
                        totalWaktuDetik :detail.spendTime ? detail.spendTime : 0 ,
                        totalWaktu :  detail.spendTime ? secondToTime(detail.spendTime) :  0,
                        rataRataWaktu :  detail.spendTime ?  secondToTime(detail.spendTime  / selectedResult.length) : 0
            }))
        }
    }));
    
    onResult(returnedData)
    
    
})

