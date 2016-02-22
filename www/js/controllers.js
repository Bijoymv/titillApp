angular.module('starter.controllers', [])

.controller('SignInCtrl', function($http, $scope, $rootScope,$ionicHistory, LoginService, $ionicPopup, $state, $ionicLoading, LocalStorage, geoLocation, geoLocationService, $cordovaGeolocation) {
    $scope.data = {};

    console.log("Entered the sign in controller");
    ionic.Platform.ready(function() {

            var getCities = function (){
                LoginService.getCities().success(function (data) {
                    var cityNames = new Array();
                    if (data.data.city_names[0].data) {
                        for(var i=0; i< data.data.city_names[0].data.length; i++){
                            cityNames[data.data.city_names[0].data[i].name]=data.data.city_names[0].data[i].id;
                        }
                    }
                    $rootScope.cityNames = cityNames;
                    console.log("CityNames:::",$rootScope.cityNames);
                }).error(function (data) {
                    console.log("error in fetching city names",data);
                    $rootScope.cityNames = [];
                });
            };

            if(!$rootScope.cityNames){
                getCities();
            }

        var getGeoCity = function() {

            console.log("Inside getGeoCity");
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
            });
            var posOptions = {
                maximumAge: 3000, timeout: 5000, enableHighAccuracy: true
            };
            //default City
            $rootScope.geoCityName = "Chennai";
            // error, default latitude and longitude for chennai
            $rootScope.lat = 13.0524;
            $rootScope.long = 80.2508;

            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                $rootScope.lat = lat;
                $rootScope.long = long;
                console.log("positions", lat, long);
                geoLocationService.getCity(lat, long).success(function (json) {
                    console.log("getCity success", json);
                    $rootScope.geoCityName = null;
                    if (json.data.status == "OK") {
                        var result = json.data.results[0];
                        var city = "";
                        var state = "";
                        for (var i = 0, len = result.address_components.length; i < len; i++) {
                            var ac = result.address_components[i];
                            if (ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.long_name;
                            if (ac.types.indexOf("administrative_area_level_2") >= 0) city = ac.long_name;
                        }
                        if (state !== '') {
                            console.log("You are in " + city + ", " + state + "!");
                            $rootScope.geoCityName = city;
                            if (city == "bengaluru" || city == "Bengaluru" || city == "Bangalore Urban" || city == "bangalore urban") {
                                console.log("Bangalore");
                                $rootScope.geoCityName = "Bangalore";
                            }
                        }

                        LocalStorage.setObject('geoCity', {
                            geoCityName: $rootScope.geoCityName,
                            lat: $rootScope.lat,
                            long: $rootScope.long
                        });

                    } else {
                        console.log("Error in getting the city name");
                    }

                    $ionicLoading.hide();
                }).error(function (data) {
                    console.log("getCity error", data);
                    $ionicLoading.hide();
                });

            }, function (err) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Not able to get the current location!',
                    template: 'Please check internet connection or allow location',
                    buttons: [
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            });
        };

        var cityDetails = LocalStorage.getObject('geoCity');
        if(cityDetails.geoCityName){
            console.log("----- geoCityName",cityDetails.geoCityName);
            $rootScope.lat = cityDetails.lat;
            $rootScope.long = cityDetails.long;
            $rootScope.geoCityName = cityDetails.geoCityName;
        } else {

            getGeoCity();
            console.log("----Reached geoCityName & nothing saved in local Storage");
        }

            var loginDetails = LocalStorage.getObject('loginDetails');
            if(loginDetails.username){
                console.log("Reached SignInCtrl",loginDetails.username);
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('tab.dash');
            } else{
                console.log("Reached SignInCtrl & nothing saved in local Storage");
            }
        });

    $scope.login = function () {
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });

            LoginService.loginUser($scope.data.username, $scope.data.password).success(function (data) {
                console.log("Inside loginuser",data);
                $ionicLoading.hide();
                if (data.data.Login) {
                    LocalStorage.setObject('loginDetails', {
                        username: data.Login.data.username,
                        user_typecode: data.Login.data.user_typecode,
                        userid: data.Login.data.userid
                    });

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('tab.dash');
                }

                if (data.data.Error) {
                    console.log("Inside ERROR message",data.data.Error[0]);
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('tab.dash');
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: data.data.Error[0].message,
                        buttons: [
                            {
                                text: '<b>OK</b>',
                                type: 'button-assertive'
                            }
                        ]
                    });
                }

            }).error(function (data) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('tab.dash');
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!',
                    buttons: [
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            });
    };

})

.controller('PWdRecoveryCtrl', function($http, $scope, $rootScope, LoginService, $ionicPopup, $state, $ionicLoading, $ionicHistory) {

        $scope.getPwd = function(val) {
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });
            LoginService.getUserPwd(val).success(function(data) {
                var responseData = data.data;
                $ionicLoading.hide();
                if(responseData.Error){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: responseData.Error[0].message,
                        buttons: [
                            {
                                text: '<b>OK</b>',
                                type: 'button-assertive'
                            }
                        ]
                    });

                }else{
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success',
                        template: 'Password is sent to your email address. Please check the email to get the details.',
                        buttons: [
                            {
                                text: '<b>OK</b>',
                                type: 'button-assertive'
                            }
                        ]
                    });

                }

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('signin');
            }).error(function(data) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Email Address not found!',
                    template: 'Please check your email!',
                    buttons: [
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            });
        }


    })

.controller('DashCtrl', function($scope, UserService, $ionicPopup, $state, $ionicLoading, LocalStorage, $rootScope) {

        $scope.userType = null;
        $scope.images = null;
        $scope.cityName = $rootScope.geoCityName;
        console.log("Dash ---",$rootScope.geoCityName);
        if($rootScope.cityNames){
            if($rootScope.geoCityName!== null){
                $scope.cityId = parseInt($rootScope.cityNames[$rootScope.geoCityName]);
                //$scope.cityId = 232; //Bangalore ID
                console.log("Reached DashCtrl $scope.cityId loop::::::",$scope.cityId);
            } else {
                $scope.cityId = 483; // Chennai ID
            }
        } else{
            $scope.cityId = 483; // Chennai ID
        }
        $rootScope.cityId =  $scope.cityId;

       var getUserType = function() {
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });
           var imagesVal = ["img/petOwners.svg",
               "img/petCares.svg",
               "img/petStores.svg",
               "img/petClubs.svg",
               "img/petCommunities.svg",
               "img/petEvents.svg",
               "img/petCharity.svg",
               "img/petBreeders.svg",
               "img/petEducation.svg",
               "img/petFriendlyHotels.svg",
               "img/petGrooming.svg",
               "img/PetTrainers.svg",
               "img/petSpecialServices.svg",
               "img/petVetsClinic.svg"
           ];

           var images = new Array();

           for(var i=1; i<15; i++){
               images[i]= imagesVal[i-1];
           }
           UserService.getUserType().success(function(data) {
                var userType = data.data.usertype[0].data;
                $scope.userType = userType;

                for(var i=0;i<$scope.userType.length;i++){
                    $scope.userType[i].img = images[parseInt($scope.userType[i].type_id)];
                }

                LocalStorage.setObject('userTypes', {
                    userType: $scope.userType
                });

                $ionicLoading.hide();

            }).error(function(data) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Data not available!',
                    template: 'Can you check if internet is connected?',
                    buttons: [
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            });
        };

        var userTypes = LocalStorage.getObject('userTypes');
        if (userTypes.userType === undefined) {
            getUserType();
        } else{
            $scope.userType = userTypes.userType;
        }

        $scope.getListing = function(type_id,type_name){
            $rootScope.selectedTypeName = type_name;
            $rootScope.selectedTypeId = type_id;
            console.log("inside getListing ::::selectedTypeName::",type_name);
            var params = {typeCode:type_id};
            $state.go("tab.search",params);
        };

})

.controller('SearchCtrl', function($scope, SearchService, $stateParams, $ionicPopup, $state, $ionicLoading, $rootScope) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To lisiten for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        var count,cityArray;
        console.log("Reached search controller");
        $scope.cityName     =   $rootScope.geoCityName;
        $scope.typeNameSel  =   $rootScope.selectedTypeName;
        $scope.cityId       =   $rootScope.cityId;
        $scope.typeCode     =   $stateParams.typeCode;
        $scope.items        =   [];
        $scope.searchVal    =   $rootScope.cityNames;

        console.log("city names available::::",$rootScope.cityNames);
        count       = {upperLimit:10, lowerLimit:0};
        cityArray   = [];

        Object.keys($rootScope.cityNames).forEach(function(key,index) {
            // key: the name of the object key
            // index: the ordinal position of the key within the object
            cityArray.push({id: $rootScope.cityNames[key], text: key, checked: false, icon: null});
        });

        // for select box directive
        $scope.countries                =   cityArray;
        $scope.countries_text_single    =   'Choose different city';
        $scope.countries_text_multiple  =   'Choose countries';
        $scope.val                      =   {single: null, multiple: null};




        //default scenario
        if(!$stateParams.typeCode){
                $scope.typeCode     =   'pca';
                $scope.typeNameSel  =   'Pet Care';
        }

        $scope.getUserList = function() {
            var params,userList;
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });

            params = {cityId:$scope.cityId,typeCode:$scope.typeCode};

            SearchService.getUserList(params,count).success(function (data) {
                console.log("getUserList",data);
                userList = [];

                if (data.data["Search Result"] && data.data["Search Result"][0]) {
                    userList = data.data["Search Result"][0].data;
                    $scope.items = userList;
                }

                if (userList.length > 0) {
                    $scope.userData = true;
                } else {
                    $scope.userData = false;
                }
                $ionicLoading.hide();

            }).error(function (data) {
                $scope.userData = false;
                $ionicLoading.hide();
            });
        };


        $scope.loadMore = function() {
            var params,userList;
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });
            $scope.moredata = false;

            console.log("InsideloadMore");
            params              =   { cityId:$scope.cityId, typeCode:$scope.typeCode };
            count.lowerLimit    =   count.upperLimit;
            count.upperLimit    =   count.upperLimit + 5;

            SearchService.getNewUsers(params,count).then(function(items){
                console.log("getNewUsers is called");
                $ionicLoading.hide();
                userList = [];
                if (items.data["Search Result"] && items.data["Search Result"][0]) {
                    userList = items.data["Search Result"][0].data;
                    console.log("userlist inside loadmore",userList.length);
                    if(userList.length > 0){
                        $scope.moredata = false;
                    } else{
                        $scope.moredata = true;
                    }
                    $scope.items = $scope.items.concat(userList);

                } else{
                    console.log("no data!!!!");
                    $scope.moredata = true;
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if($scope.items.length > 0) {
                    $scope.userData = true;
                }else{
                    $scope.userData = false;
                }
            });
        };

        $scope.callbackFunctionInController = function(item){
           console.log("----inside callbackFunctionInController---",item);
        };
    })

.controller('SearchDetailCtrl', function($scope, $stateParams, SearchService, $ionicLoading, $state, geoLocationService, $rootScope) {
        var getUserImage = function() {
            var baseURL = "http://demo.titill.com/";
            SearchService.getSearchImage($stateParams.userId).success(function (data) {
                if(data.data.usermedia[0] && data.data.usermedia[0].data && data.data.usermedia[0].data!== null) {
                    var len = data.data.usermedia[0].data.length;
                    var val = data.data.usermedia[0].data[len -1];
                    if(val && val.category ==='cover' && val.default ==='1' && val.mediapath){
                        $scope.bannerImage =  baseURL+val.mediapath;
                    }else{
                        $scope.bannerImage =  "img/bannerimage-default.jpg";
                    }
                } else{
                   $scope.bannerImage =  "img/bannerimage-default.jpg";
                }
            }).error(function (data) {
                console.log("getUserImage error",data);
                $scope.bannerImage =  "img/bannerimage-default.jpg";
            });
        };

        getUserImage();

        var getSearchList = function() {
            console.log("Inside getSearchList");
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });

            SearchService.getSearchDetails($stateParams).success(function (data) {
                var searchDetails = [];
                console.log("searchDetails",data.data.userpage[0].data[0]);
                $scope.searchDetails = data.data.userpage[0].data[0];
                $ionicLoading.hide();

            }).error(function (data) {
                console.log("searchDetails not details available",data);
                $ionicLoading.hide();
            });
        };
        getSearchList();


        var getViews = function() {
            console.log("Inside getViews");
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });

            SearchService.getViews($stateParams.userId).success(function (data) {
                //console.log("getViews",data.pageview.data.length);
                if(data.data && data.data.pageview[0] && data.data.pageview[0].data && data.data.pageview[0].data.length > 0){
                    $scope.pageViews = data.data.pageview[0].data.length;
                } else{
                    $scope.pageViews = 0;
                }

                $ionicLoading.hide();

            }).error(function (data) {

                $scope.pageViews = 0;
                console.log("getViews not details available",data);
                $ionicLoading.hide();
            });
        };

        getViews();


        var getLikes = function() {
            console.log("Inside getLikes");
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });

            SearchService.getLikes($stateParams.userId).success(function (data) {
                //console.log("getViews",data.pageview.data.length);
                if(data.data && data.data.pagelike[0] && data.data.pagelike[0].data && data.data.pagelike[0].data.length > 0){
                    $scope.pageLikes = data.data.pagelike[0].data.length;
                } else{
                    $scope.pageLikes = 0;
                }

                $ionicLoading.hide();

            }).error(function (data) {

                $scope.pageLikes = 0;
                console.log("pageLikes not  available",data);
                $ionicLoading.hide();
            });
        };

        getLikes();


        var getRating = function() {
            console.log("Inside pageRate");
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });

            SearchService.getRating($stateParams.userId).success(function (data) {
                var totalRating = 0, ratingLength, number;
                if(data.data && data.data.pagerating[0] && data.data.pagerating[0].data && data.data.pagerating[0].data.length > 0){
                   ratingLength = data.data.pagerating[0].data.length;
                    if(ratingLength > 1){
                        for(var i=0; i<=ratingLength-1; i++){
                            totalRating = totalRating + parseFloat(data.data.pagerating[0].data[i].rate_count);
                        }
                    }
                    number = totalRating / ratingLength;
                    $scope.pageRate = number.toFixed(1);

                } else{
                    $scope.pageRate = 0;
                }

                $ionicLoading.hide();

            }).error(function (data) {

                $scope.pageRate = 0;
                console.log("pageRate not  available",data);
                $ionicLoading.hide();
            });
        };

        getRating();


        var getFollowers = function() {
            console.log("Inside Followers");
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });

            SearchService.getFollowers($stateParams.userId).success(function (data) {
                if(data.data && data.data.pagefollowers[0] && data.data.pagefollowers[0].data && data.data.pagefollowers[0].data.length > 0){
                    $scope.pagefollower = data.data.pagefollowers[0].data.length;
                } else{
                    $scope.pagefollower = 0;
                }

                $ionicLoading.hide();

            }).error(function (data) {

                $scope.pagefollower = 0;
                console.log("pageRate not  available",data);
                $ionicLoading.hide();
            });
        };

        getFollowers();

        var onSuccessCall = function(){console.log("call is successfull");}
        var onErrorCall = function(){console.log("call got an error");}

        $scope.callPhone = function(number){
            window.plugins.CallNumber.callNumber(onSuccessCall, onErrorCall, number, true);
        };



        $scope.navigate = function(){
            console.log("inside navigate");

            var getDirection = function(){
                $rootScope.directionLat = null;
                $rootScope.directionLong = null;
                if($scope.searchDetails.page_loc_area !== ''){
                    var addr = $scope.searchDetails.page_loc_area;
                    addr = addr.replace(/,/g, '+');
                    addr = addr.replace(/ /g, '');
                    addr = addr+"+"+$rootScope.geoCityName;
                    geoLocationService.getDirection(addr).success(function (json) {
                        console.log("Direction success",json);

                        if (json.data.status == "OK") {
                            var lat = json.data.results[0].geometry.location.lat;
                            var long = json.data.results[0].geometry.location.lng;

                            $rootScope.directionLat = lat;
                            $rootScope.directionLong = long;

                            console.log(" $rootScope.directionLat", lat, $rootScope.directionLat);
                            console.log(" $rootScope.directionLong", long, $rootScope.directionLong);

                            $state.go("map");

                        }else{
                            console.log("Error in getting the direction");
                        }

                    }).error(function (data) {
                        console.log("Error error direction",data);
                    });
                } else{
                   console.log("No destination to go")
                }


            };
            getDirection();

        };
    })

.controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })

.directive('map', function() {
    return {
        restrict: 'A',
        link:function(scope, element, attrs){

            var zValue = scope.$eval(attrs.zoom);
            var lat = scope.$eval(attrs.lat);
            var lng = scope.$eval(attrs.lng);
            var directionLong = scope.$eval(attrs.dirlo);
            var directionLat = scope.$eval(attrs.dirla);

            console.log("directionLong", directionLong);
            console.log("directionLat", directionLat);

            var myLatlng = new google.maps.LatLng(lat,lng),
                mapOptions = {
                    zoom: zValue,
                    center: myLatlng
                },
                map = new google.maps.Map(element[0],mapOptions);


            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();

            var myLocation = new google.maps.LatLng(lat,lng);

            var destination = new google.maps.LatLng(directionLat, directionLong);


            var request = {
                origin : myLocation,
                destination : destination,
                travelMode : google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });

            directionsDisplay.setMap(map);

        }
    };
})

.directive('ionSearchBar', function($timeout, $q) {
        return {
            restrict: 'E',
            replace: true,
            scope: { search: '=?filter' },
            link: function(scope, element, attrs) {
                scope.placeholder = attrs.placeholder || '';
                scope.search = {value: '', focus: false};
                if (attrs.class) {
                    element.addClass(attrs.class);
                }

                // We need the actual input field to detect focus and blur
                var inputElement = element.find('input')[0];

                var airlines = [
                    {"name":"Lao Central Airlines ","id":1},
                    {"id":2,"name":"TAG"},
                    {"id":3,"name":"Air Baltic"},
                    {"name":"Dana Airlines","id":4}
                ];

                airlines = airlines.sort(function(a, b) {

                    var airlineA = a.name.toLowerCase();
                    var airlineB = b.name.toLowerCase();

                    if(airlineA > airlineB) return 1;
                    if(airlineA < airlineB) return -1;
                    return 0;
                });

                var searchAirlines = function(searchFilter) {

                    console.log('Searching airlines for ' + searchFilter);

                    var deferred = $q.defer();

                    var matches = airlines.filter( function(airline) {
                        if(airline.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1 ) return true;
                    });

                    $timeout( function(){

                        deferred.resolve( matches );

                    }, 100);

                    return deferred.promise;

                };






                // This function is triggered when the user presses the `Cancel` button
                scope.cancelSearch = function() {
                    // Manually trigger blur
                    inputElement.blur();
                    scope.search.value = '';
                };

                scope.search = function(){
                    scope.search = { "airlines" : [], "value" : '' };
                    console.log(scope.search.value);
                    searchAirlines(scope.search.value).then(

                            function (matches) {
                                scope.search.airlines = matches;
                                console.log("Inside Search ",matches);
                            }
                        );


                };

                // When the user focuses the search bar
                angular.element(inputElement).bind('focus', function () {
                    // We store the focus status in the model to show/hide the Cancel button
                    scope.search.focus = 1;
                    // Add a class to indicate focus to the search bar and the content area
                    element.addClass('search-bar-focused');
                    angular.element(document.querySelector('.has-search-bar')).addClass('search-bar-focused');
                    // We need to call `$digest()` because we manually changed the model
                    scope.$digest();
                });
                // When the user leaves the search bar
                angular.element(inputElement).bind('blur', function() {
                    scope.search.focus = 0;
                    element.removeClass('search-bar-focused');
                    angular.element(document.querySelector('.has-search-bar')).removeClass('search-bar-focused');
                });
            },
            template: '<div class="search-bar bar bar-header item-input-inset">' +
                '<label class="item-input-wrapper">' +
                '<i class="icon ion-ios-search placeholder-icon"></i>' +
                '<input type="search" placeholder="" ng-model="search.value" data="" ng-change="search()">' +
                '</label>' +
                '<button class="button button-clear button-assertive" ng-show="search.focus" ng-click="cancelSearch()">' +
                'Cancel' +
                '</button>' +
                '</div>'

        };
    })

.controller('MapCtrl', function($scope,$rootScope) {
        $scope.lat = $rootScope.lat;
        $scope.long = $rootScope.long;
        $scope.directionLong = $rootScope.directionLong;
        $scope.directionLat = $rootScope.directionLat;
        console.log("in map controller $scope.directionLong",$scope.directionLong);
        console.log("in map controller $scope.directionLat",$scope.directionLat);
})

.controller('SignOutCtrl', function($scope, $rootScope, LocalStorage, $state, $ionicHistory) {
        console.log("Entered in SignOutCtrl");

        LocalStorage.removeItem('userTypes');
        LocalStorage.removeItem('geoCity');

        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('signin');
})

.directive('fancySelect',
    [
        '$ionicModal','SearchService',
        function($ionicModal, SearchService, $state) {
            return {
                /* Only use as <fancy-select> tag */
                restrict : 'E',

                /* Our template */
                templateUrl: 'fancy-select.html',

                /* Attributes to set */
                scope: {
                    'items'        : '=', /* Items list is mandatory */
                    'text'         : '=', /* Displayed text is mandatory */
                    'typeCode'     : '=', /* typeCode is mandatory */
                    'value'        : '=', /* Selected value binding is mandatory */
                    'callback'     : '&mySaveCallback'
                },

                controller: function($scope, $rootScope, $state){
                    console.log("rootscope ::::::;",$rootScope.geoCityName);

                },

                link: function (scope, element, attrs) {

                    console.log("inside link");

                    /* Default values */
                    scope.multiSelect   = attrs.multiSelect === 'true' ? true : false;
                    scope.allowEmpty    = attrs.allowEmpty === 'false' ? false : true;

                    /* Header used in ion-header-bar */
                    scope.headerText    = attrs.headerText || '';

                    /* Text displayed on label */
                    // scope.text          = attrs.text || '';
                    scope.defaultText   = scope.text || '';

                    /* Notes in the right side of the label */
                    scope.noteText      = attrs.noteText || '';
                    scope.noteImg       = attrs.noteImg || '';
                    scope.noteImgClass  = attrs.noteImgClass || '';

                    /* Optionnal callback function */
                    // scope.callback = attrs.callback || null;

                    /* Instanciate ionic modal view and set params */

                    /* Some additionnal notes here :
                     *
                     * In previous version of the directive,
                     * we were using attrs.parentSelector
                     * to open the modal box within a selector.
                     *
                     * This is handy in particular when opening
                     * the "fancy select" from the right pane of
                     * a side view.
                     *
                     * But the problem is that I had to edit ionic.bundle.js
                     * and the modal component each time ionic team
                     * make an update of the FW.
                     *
                     * Also, seems that animations do not work
                     * anymore.
                     *
                     */



                    $ionicModal.fromTemplateUrl(
                        'fancy-select-items.html',
                        {'scope': scope}
                    ).then(function(modal) {
                            scope.modal = modal;
                            console.log("inside fromTemplateUrl");
                        });

                    /* Validate selection from header bar */
                    scope.validate = function (event) {
                        console.log("inside validate");
                        // Construct selected values and selected text
                        if (scope.multiSelect == true) {

                            // Clear values
                            scope.value = '';
                            scope.text = '';

                            // Loop on items
                            jQuery.each(scope.items, function (index, item) {
                                if (item.checked) {
                                    scope.value = scope.value + item.id+';';
                                    scope.text = scope.text + item.text+', ';
                                }
                            });

                            // Remove trailing comma
                            scope.value = scope.value.substr(0,scope.value.length - 1);
                            scope.text = scope.text.substr(0,scope.text.length - 2);
                        }

                        // Select first value if not nullable
                        if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null ) {
                            if (scope.allowEmpty == false) {
                                scope.value = scope.items[0].id;
                                scope.text = scope.items[0].text;

                                // Check for multi select
                                scope.items[0].checked = true;
                                console.log("inside validate undefined");
                            } else {
                                scope.text = scope.defaultText;
                                console.log("inside validate defaultText");
                            }
                        }

                        // Hide modal
                        scope.hideItems();

                        // Hide modal
                        scope.getSearch = function(str){
                            console.log("inside search", str)
                        };

                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            console.log("inside callback");
                            scope.callback (scope.value);
                        }
                    };

                    /* Show list */
                    scope.showItems = function (event) {
                        console.log("inside showItems");

                        event.preventDefault();
                        scope.modal.show();
                    };

                    /* Hide list */
                    scope.hideItems = function () {
                        console.log("inside hideItems");
                        scope.modal.hide();
                    };

                    /* Destroy modal */
                    scope.$on('$destroy', function() {
                        console.log("inside $destroy");
                        scope.modal.remove();
                    });

                    /* Validate single with data */
                    scope.validateSingle = function (item) {
                        console.log("inside validateSingle",item);
                        // Set selected text
                        scope.text = item.text;

                        // Set selected value
                        scope.value = item.id;


                        console.log("inside validateSingle----",item);

                        // Hide items
                        scope.hideItems();



                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            console.log("inside Execute callback");
                            //var params = {typeCode:type_id};
                           // $state.go("tab.search",params);
                            scope.callback ({id: scope.value,text:scope.text});
                        }
                    }
                }
            };
        }
    ]
);



