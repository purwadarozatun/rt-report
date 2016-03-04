// app.js
var routerApp = angular.module('routerApp', [ 'ui.router' , "highcharts-ng" ,'ui.bootstrap']);

routerApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: '/pages/partial-home.html',
            controller: function ($scope  , $http) {
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
                $scope.peoples = [
                    
                            {code:'B63YS_f6OiMyG6V4fFgF7TUjkbyewTGaw3rBgQ5_',name:'Nanda Nandya Putra'},
                            {code:'B63CX0sPwRh2PVeNWrBiWZ7_6I982HdmBBMpZb9j',name:'Rayhan Firdaus'},
                            {code:'B636jGAwOH67x2RWd8CwKiVDurTXSDEKUsJyRjAo',name:'Bayu Hendra Winata'},                          
                            {code:'B63LZd3NZXPNRPKIWez7uvOMeZ7YgRIyVfSIahXv',name:'Lambang Prabawa'},
                            {code:'B63e_KwY6zyAQtOZoBuSnYqZ7qECBvxJQiruBY8X',name:'Nurrohman'},
                            {code:'B63RWdCOjkgUIX0W5rVCxsn3IkJ1lIgtKt_qoXcC',name:'Yoga Hanggara'},
                            {code:'B63OWwz1pUm0JwAe6jJslQp8lF40aMQiIlNJT5JB',name:'Tama'},
                            {code:'B63fvvuCdH56ObFDjxlB6kRKHVh6ZRoWCFO8uiMa',name:'Aldy Ginanjar'},
                            {code:'B63x70TcgZVi9oOLXkMiL0KBI5Oo0Aaz7ZLLhbCs',name:'Ramadani'},
                            {code:'B63wXKOz1nSfvxmVdYCcpIogUw3eJdRsB1VGqR4A',name:'Ricky Andika'},
                            {code:'B63UhuTlUwYyFYeK64Qvn7bFrHOn3w59HSxBSwg4',name:'Purwa Darozatun Akbar'},
                            {code:'B63lGvNohTp80Cv0ZZpqzXHeGNoSyiLfpHWKqAII',name:'Sohib Abdul karim'},
                            {code:'B630Ldeo8B3cSyozdxnuN6jwNyIRXNinm0TPTEfM',name:'Akmal Fuady'},
                            {code:'B63fNdbZua35Q1FL3t3sOat1CAqULTaSoJ2Y6uhL',name:'Yandi Fitriyanto'},
                            {code:'B634PIKFPyR3nezm4Zx_shOLjDmAFDVLOyZNCBbr',name:'Iqbal Saputra'},
                            {code:'B63iAwgCF6huhWSHPsQuVY92NNwWWig1_pI9mKVn',name:'M. Raihan Iqbal'},
                            {code:'B63Z_YoW2qHYcCO_dKbz3Y7PbLhlFVkz4Y3AcPQY',name:'Asep Dadang Supriadi'},
                            {code:'B63lK7LqaZXCZ6X4aBO4r0o0IsMOGCBso7CKyFzO',name:'Muhtarudin S'},
                            {code:'B63uTKiyDNlXYTGUbRWhBwyKUIZwDQ1HqranwA00',name:'Rudi Dwi Apriyanto'},
                            {code:'B636zif71MUdRIg0xzBUmAJC9RxeKjDjCo6q2KtW',name:'Roger Bayu'},
                            {code:'B63JYvtqei1Q22hLx5lVzDKjW1WsRNC0_7nL9gJU',name:'Indah Nur K'},
                            {code:'B63jvOw7icBJomqhgSJ17y0a_TaiEGdPw0CaeLYK',name:'Novia Al Fitri'},
                            {code:'B63ibezIbVIpWoeUm3PM1IAzMEovKyF8qXsGZchY',name:'M. Fiqri Muthohar'},
                       
                ]
                
                $scope.people = $scope.peoples[0].code;
                
                $scope.getData = function () {
                    getData()
                }
                
                var createQuery = function (startDate , endDate ,restrictKind ){
                     var req = {
                        method: 'get',
                        url: 'http://10.1.14.189/rt_data?key='+ $scope.people  +'&restrict_begin='+startDate+'&restrict_end='+endDate+'&restrict_kind=' +restrictKind,
                    }
                    return req
                   
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
                            datas.push({name:name, y:rows[i][1]});

                           totalTime +=rows[i][1]
                        }
                        
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
                                                var pcnt = (this.y / totalTime) * 100;
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
                getData();
                
            }
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            url: '/about',
            templateUrl: '/pages/partial-about.html'     
        });
              
});