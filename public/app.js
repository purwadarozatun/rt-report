// app.js
var routerApp = angular.module('routerApp', [ 'ui.router' , "highcharts-ng" ,'ui.bootstrap','angular-loading-bar', 'ngAnimate']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: '/pages/partial-home.html',
            controller: function ($scope  , $http , $filter) {
                
                var orderBy = $filter('orderBy');
                $scope.format = 'dd-MM-yyyy'
                $scope.params={
                    startDate:null, 
                    endDate:null
                }
                $scope.datePicker = {
                    popupFrom  : {
                        opened : false,
                        maxDate : new Date(),
                    },
                    popupTo  : {
                        opened : false,
                        maxDate : new Date(),
                        minDate : new Date(),
                    }
                }
                $scope.openDatePicker = function(name) {
                    if(name == 'from'){
                        $scope.datePicker.popupFrom.opened = true;
                    }else if(name == 'to'){
                        $scope.datePicker.popupTo.minDate = $scope.params.startDate;
                        $scope.datePicker.popupTo.opened = true;
                    }
                };

                $scope.labels = ['Very Productive','Productive','Neutral','Very Distracting','Distracting']
                      
                    
                $scope.data;
                $scope.tableData;
                $scope.chartConfig;
                $scope.peoples;
               
                $http({
                        method: 'get',
                        url: '/people'
                     }).then(function(data){
                        if(data.status == 200){
                            $scope.peoples = data.data;
                            $scope.peoples = orderBy($scope.peoples, "name", false);
                            $scope.people = $scope.peoples[0].code;
                            getData()
                        }else{
                            alert("Server Error")
                        }
                     });
                
                
                
                
                $scope.getData = function () {
                    getData()
                }
                
                var createQuery = function (startDate , endDate ,restrictKind ){
                     var req = {
                        method: 'get',
                        url: '/rt_data?key='+ $scope.people  +'&restrict_begin='+startDate+'&restrict_end='+endDate+'&restrict_kind=' +restrictKind,
                    }
                    return req
                   
                }
                $scope.totalTime
                
                var getTotalTime = function () {
                    return $scope.totalTime
                } 
                
                var getData = function () {
                    var startDate = $scope.params.startDate ? moment($scope.params.startDate).format('YYYY/MM/DD') : "";
                    var endDate = $scope.params.endDate ? moment($scope.params.endDate).format('YYYY/MM/DD') : "";
                    
                    
                    $http(createQuery(startDate , endDate , 'productivity')).then(function(data){
                        
                        var datas = new Array();
                        var totalTime = 0;
                        var rows = data.data.rows

                        for(var i in rows){
                            var name = $scope.labels[rows[i][0] - 1]
                            var time = rows[i][1] 
                            datas.push({name:name, y:time});
                            totalTime += rows[i][1]
                           
                        }
                        $scope.totalTime = totalTime
                        var chartConfig = {
                            
                            options: {
                                //This is the Main Highcharts chart config. Any Highchart options are valid here.
                                //will be overriden by values specified below.
                                chart: {type: 'column'},
                                title: {text: 'Productivity'},
                                xAxis: {type: 'category'},
                                yAxis: {title: {text: 'Total percent'}},
                                legend: {enabled: false},
                                
                                plotOptions: {
                                    series: {
                                        borderWidth: 0,
                                        dataLabels: {
                                            enabled: true,
                                            formatter:function() {
                                                            
                                                var pcnt = (this.y / getTotalTime()) * 100;
                                                return Highcharts.numberFormat(pcnt) + '%'
                                            }
                                        }
                                    }
                                },
                                tooltip: {
                                    formatter: function(){
                                        var seconds = this.y;
                                        var numhours = Math.floor(seconds / 3600);
                                        var numminutes = Math.floor((seconds % 3600) / 60);
                                        var string = numhours + " hours " + numminutes + " minutes ";

                                        return '<span style="color:{point.color}"><b>'+ string + '</b><br/>';
                                    }
                                }

                            },
                            
                            series: [{
                                name: 'Brands',
                                colorByPoint: true,
                                data: datas
                            }]
                         };
                         $scope.chartConfig = chartConfig
                    });
                    
                    $http(createQuery(startDate , endDate , 'activity')).then(function(data){
                        $scope.tableData = data;
                        
                    });
                   
                    
                    
                }
            }
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('leaderboard', {
            url: '/leaderboard',
            templateUrl: '/pages/partial-leaderboard.html',
            controller: function ($scope  , $http , $filter) {
                
                var orderBy = $filter('orderBy');
                $scope.format = 'dd-MM-yyyy'
               
                $scope.tableData;
                $scope.months = [
                    {key : "01" , name : "Januari" },
                    {key : "02" , name : "February" },
                    {key : "03" , name : "Maret" },
                    {key : "04" , name : "April" },
                    {key : "05" , name : "Mei" },
                    {key : "06" , name : "Juni" },
                    {key : "07" , name : "Juli" },
                    {key : "08" , name : "Agustus" },
                    {key : "09" , name : "September" },
                    {key : "10" , name : "Oktober" },
                    {key : "11" , name : "November" },
                    {key : "12" , name : "Desember" }
                ];
                
                
                $scope.years;
                var years = new Array();
                for(var i = 2016 ; i <= Number(moment().format('YYYY')) ; i ++){
                    years.push(i)
                }
                $scope.years = years
                
                
                $scope.month = moment().format('MM')
                $scope.year = moment().format('YYYY')
                var getData = function () {
                     $http({
                        method: 'get',
                        url: '/rt_leaderboard?selectedMonth=' + $scope.year + "-"+ $scope.month 
                     }).then(function(data){
                        if(data.status == 200){
                            $scope.tableData = data.data
                            $scope.tableData = orderBy($scope.tableData, "prodAve", true);
                        }else{
                            alert("Server Error")
                        }
                     });
                }
                getData()
                $scope.getData = function () {
                    getData()
                }
            }
        });
              
});