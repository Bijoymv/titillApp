angular.module('starter.controllers', [])

.controller('SignInCtrl', function($http, $scope, $rootScope, LoginService, $ionicPopup, $state, $ionicLoading, LocalStorage, geoLocation, geoLocationService, $cordovaGeolocation) {
    $scope.data = {};
    LocalStorage.removeItem('userTypes');
    ionic.Platform.ready(function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
            });

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

            var posOptions = {
                maximumAge: 3000, timeout: 5000, enableHighAccuracy: true
            };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                console.log("positions",lat,long);
                geoLocationService.getCity(lat,long).success(function (json) {
                    console.log("getCity success",json);
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
                            if(city == "bengaluru" || city == "Bengaluru" || city == "Bangalore Urban" || city == "bangalore urban") {
                                console.log("Bangalore");
                                $rootScope.geoCityName = "Bangalore";
                            }
                        }

                    }else{
                        console.log("Error in getting the city name");
                    }

                    $ionicLoading.hide();
                }).error(function (data) {
                    console.log("getCity error",data);
                    $ionicLoading.hide();
                });

            }, function(err) {
                // error
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Not able to get the current location!',
                    template: 'Please allow location',
                    buttons: [
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            });

            var loginDetails = LocalStorage.getObject('loginDetails');
            if(loginDetails.username){
                console.log("Reached SignInCtrl",loginDetails.username);
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

                    $state.go('tab.dash');
                }

                if (data.data.Error) {
                    console.log("Inside ERROR message",data.data.Error[0]);
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

.controller('PWdRecoveryCtrl', function($http, $scope, $rootScope, LoginService, $ionicPopup, $state, $ionicLoading) {

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
        if($rootScope.cityNames){
            if($rootScope.geoCityName!== null){
                $scope.cityId = parseInt($rootScope.cityNames[$rootScope.geoCityName]);
                console.log("Reached DashCtrl $scope.cityId loop::::::",$scope.cityId);
            } else {
                $scope.cityId = 232; // Bangalore ID
            }
        } else{
            $scope.cityId = 232; // Bangalore ID
        }
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

        $scope.getListing = function(city_id,type_id,type_name){
            $rootScope.selectedTypeName = type_name;
            $rootScope.selectedTypeId = type_id;
            console.log("selectedTypeName::",type_name);
            var params = {cityId:city_id,typeCode:type_id};
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


        $scope.cityName = $rootScope.geoCityName;
        $scope.typeNameSel =  $rootScope.selectedTypeName;
        $scope.items = [];
        var count = {upperLimit:50, lowerLimit:0};

        var getUserList = function() {
            console.log("Inside getUserList");
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });
            SearchService.getUserList($stateParams,count).success(function (data) {
                var userList = [];
                console.log("getUserList",data);
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

        getUserList();

        $scope.loadMore = function() {
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });
            $scope.moredata = false;
                console.log("InsideloadMore");
                count.lowerLimit = count.upperLimit;
                count.upperLimit = count.upperLimit + 40;

                SearchService.getNewUsers($stateParams,count).then(function(items){
                    console.log("getNewUsers is called");
                    $ionicLoading.hide();
                    var userList = [];
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

        $scope.search = function () {
         console.log("search is called");
        };
    })

.controller('SearchDetailCtrl', function($scope, $stateParams, SearchService, $ionicLoading) {
        var getUserImage = function() {
            var baseURL = "http://demo.titill.com/";
            SearchService.getSearchImage($stateParams.userId).success(function (data) {
                if(data.data.usermedia[0] && data.data.usermedia[0].data && data.data.usermedia[0].data!== null) {
                    if(data.data.usermedia[0].data[1] && data.data.usermedia[0].data[1].mediapath){
                        $scope.bannerImage =  baseURL+data.data.usermedia[0].data[1].mediapath;
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
                console.log("searchDetails not details avilable",data);
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


    })

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };

});
