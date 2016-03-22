angular.module('starter.controllers', [])

.controller('SignInCtrl', function($http,UserService, $scope, $rootScope,$ionicHistory, LoginService, $ionicPopup, $state, $ionicLoading, LocalStorage) {
    $scope.data = {};
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring Data!'
        });
    console.log("Entered the sign in controller");
    ionic.Platform.ready(function() {

            var loginDetails = LocalStorage.getObject('loginDetails');
            if(loginDetails.username){
                console.log("Reached SignInCtrl",loginDetails.username);
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $ionicLoading.hide();
                $state.go('tab.dash');
            } else{
                $ionicLoading.hide();
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
                if (data.data.Login && data.data.Login[0].data[0]) {
                    LocalStorage.setObject('loginDetails', {
                        username: data.data.Login[0].data[0].username,
                        user_typecode: data.data.Login[0].data[0].user_typecode,
                        userid: data.data.Login[0].data[0].userid
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
                    //$state.go('tab.dash');
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
                //$state.go('tab.dash');
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

.controller('SignUpCtrl', function($http,UserService, $scope, $rootScope,$ionicHistory, LoginService, $ionicPopup, $state, $ionicLoading){
        $scope.data = {};

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring Data!'
        });
        UserService.getUserType().success(function(data) {
            var userType = data.data.usertype[0].data;
            $scope.userType = userType;
            $ionicLoading.hide();

        }).error(function(data) {
            $scope.userType = [];
            $ionicLoading.hide();
        });

        $scope.signUp = function(){

            console.log("inside signup",$scope.data);

            var email = $scope.data.pop_email;
            var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
            var errorString = "";
            var dob, date, dateOfBirth = $scope.data.pop_con_regdob;

            var pwd = $scope.data.pop_pwd;
            var confPwd = $scope.data.pop_con_pwd;
            var selectType = $scope.data.tit_select_box;
            var isChecked = $scope.data.isChecked;

            var _calculateAge = function(birthday) { // birthday is a date
                var ageDifMs = Date.now() - birthday.getTime();
                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                return Math.abs(ageDate.getUTCFullYear() - 1970);
            };

            if (!email || email == '' || !re.test(email))
            {
                errorString = errorString + '<br/>* Valid Email';
            }

            if(!pwd || pwd == '' ){
                errorString = errorString + '<br/>* Password';
            }

            if(pwd && pwd != '' && pwd !== confPwd ){
                errorString = errorString + '<br/>* Confirm password is not matching with password';
            }

            if(!dateOfBirth || dateOfBirth == ''){
                errorString = errorString + '<br/>* DOB';
            } else{
                date = new Date($scope.data.pop_con_regdob);
               var age =  _calculateAge(date);

                if(age < 13){
                    errorString = errorString + '<br/>* Age should be greater than 13';
                } else{
                    dob = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
                }
            }

            if(!selectType || selectType == ''){
                errorString = errorString + '<br/>* User Type';
            }

            if(!isChecked || isChecked == ''){
                errorString = errorString + '<br/>* Agree terms and conditions';
            }


            if(errorString == ''){
                $ionicLoading.show({
                    template: 'loading..',
                    animation: 'fade-in',
                    noBackdrop: false
                });
                LoginService.signUp($scope.data.pop_email, $scope.data.pop_pwd, $scope.data.pop_con_pwd,
                    dob, $scope.data.tit_select_box).success(function (data) {
                        console.log("Inside signup",data);
                        $ionicLoading.hide();
                        if (data.data.Signup && data.data.Signup[0].status == 'success') {
                            $ionicPopup.alert({
                                title: 'Success!',
                                template: data.data.Signup[0].message,
                                buttons: [
                                    {
                                        text: '<b>OK</b>',
                                        type: 'button-assertive'
                                    }
                                ]
                            });

                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('signin');
                        }

                        if (data.data.Error) {
                            console.log("Inside ERROR message",data.data.Error[0]);
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            // $state.go('tab.dash');
                            $ionicPopup.alert({
                                title: 'Sign up failed!',
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
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Signup failed!',
                            template: 'Please check details!',
                            buttons: [
                                {
                                    text: '<b>OK</b>',
                                    type: 'button-assertive'
                                }
                            ]
                        });
                    });
            } else{
                $ionicPopup.alert({
                    title: 'Please enter the mandatory fields',
                    template: errorString,
                    buttons: [
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            }

        };



    })

.controller('PWdRecoveryCtrl', function($http, $scope, $rootScope, LoginService, $ionicPopup, $state, $ionicLoading, $ionicHistory) {
        $scope.data = {};
        $scope.getPwd = function() {
            $ionicLoading.show({
                template: 'loading..',
                animation: 'fade-in',
                noBackdrop: false
            });
            LoginService.getUserPwd($scope.data.email).success(function(data) {
                var responseData = data.data;
                $ionicLoading.hide();
                if(responseData.Error[0].status === 'error'){
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
                        template: responseData.Error[0].message,
                        buttons: [
                            {
                                text: '<b>OK</b>',
                                type: 'button-assertive'
                            }
                        ]
                    });
                    $state.go('signin');
                }

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

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

.controller('DashCtrl', function($scope, $timeout,UserService,LoginService, $ionicPopup, $state, $ionicLoading, LocalStorage, $rootScope, $cordovaGeolocation, geoLocationService) {
        $scope.cityName = "";
        ionic.Platform.ready(function() {

           var getGeoCity = function() {
               var cityDetails = LocalStorage.getObject('geoCity');
               if(!cityDetails.default) {
                   $ionicLoading.show({
                       template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring Location!'
                   });
                   console.log("Inside getGeoCity");

                   var posOptions = {
                       maximumAge: 3000, timeout: 5000, enableHighAccuracy: true
                   };
                   //default City
                   $rootScope.geoCityName = "Chennai";
                   // error, default latitude and longitude for chennai
                   $rootScope.lat = 13.0524;
                   $rootScope.long = 80.2508;
                   $rootScope.default = false;
                   LocalStorage.removeItem('geoCity');
                   LocalStorage.setObject('geoCity', {
                       default: $rootScope.default,
                       lat:$rootScope.lat,
                       long:$rootScope.long,
                       geoCityName:$rootScope.geoCityName
                   });


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
                               $rootScope.default = true;

                               LocalStorage.removeItem('geoCity');
                               LocalStorage.setObject('geoCity', {
                                   default: $rootScope.default,
                                   lat:$rootScope.lat,
                                   long:$rootScope.long,
                                   geoCityName:$rootScope.geoCityName
                               });

                           } else {
                               console.log("Error in getting the city name");
                           }
                           $scope.cityName = $rootScope.geoCityName;

                           if ($rootScope.cityNames) {
                               $scope.cityId = parseInt($rootScope.cityNames[$rootScope.geoCityName]);
                               $rootScope.cityId = $scope.cityId;
                           } else {
                               $scope.cityId = 483;
                               $rootScope.cityId = $scope.cityId;
                           }
                           $ionicLoading.hide();
                       }).error(function (data) {
                           $scope.cityName = $rootScope.geoCityName;
                           if ($rootScope.cityNames) {
                               $scope.cityId = parseInt($rootScope.cityNames[$rootScope.geoCityName]);
                               $rootScope.cityId = $scope.cityId;
                           } else {
                               $scope.cityId = 483;
                               $rootScope.cityId = $scope.cityId;
                           }
                           console.log("getCity error", data);
                           $ionicLoading.hide();
                       });

                   }, function (err) {
                       $scope.cityName = $rootScope.geoCityName;
                       if ($rootScope.cityNames) {
                           $scope.cityId = parseInt($rootScope.cityNames[$rootScope.geoCityName]);
                           $rootScope.cityId = $scope.cityId;
                       } else {
                           $scope.cityId = 483;
                           $rootScope.cityId = $scope.cityId;
                       }
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
               }
               else{
                   $scope.lat = cityDetails.lat;
                   $scope.long = cityDetails.long;
                   $timeout(function() {
                       $scope.cityName = cityDetails.geoCityName;
                       $rootScope.geoCityName = cityDetails.geoCityName;
                   }, 500);

                   $rootScope.geoCityName = cityDetails.geoCityName;
                   console.log("cityNamesssss::::", $scope.cityName);
                   $scope.cityId = parseInt($rootScope.cityNames[cityDetails.geoCityName]);
                   $rootScope.cityId = $scope.cityId;
               }
           };

           var getCities = function (){
               $ionicLoading.show({
                   template: 'loading..',
                   animation: 'fade-in',
                   noBackdrop: false
               });
               LoginService.getCities().success(function (data) {
                   var cityNames = new Array();
                   if (data.data.city_names[0].data) {
                       for(var i=0; i< data.data.city_names[0].data.length; i++){
                           cityNames[data.data.city_names[0].data[i].name]=data.data.city_names[0].data[i].id;
                       }
                   }
                   $rootScope.cityNames = cityNames;
                   console.log("CityNames:::",$rootScope.cityNames);
                   $ionicLoading.hide();
                   getGeoCity();
               }).error(function (data) {
                   console.log("error in fetching city names",data);
                   $ionicLoading.hide();
                   $rootScope.cityNames = [];
                   getCities();
               });
           };

           if($rootScope.cityNames && $rootScope.cityNames.length > 0){
               getGeoCity();
           } else{
               getCities();
           }

            $scope.userType = null;
            $scope.images = null;

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

                   $rootScope.userType = $scope.userType;

                   /* LocalStorage.setObject('userTypes', {
                        userType: $scope.userType
                    });*/

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

            //var userTypes = LocalStorage.getObject('userTypes');
            if ($rootScope.userType  === undefined) {
                getUserType();
            } else{
                $scope.userType = $rootScope.userType;
            }

            $scope.getListing = function(type_id,type_name){
                $rootScope.selectedTypeName = type_name;
                $rootScope.selectedTypeId = type_id;
                console.log("inside getListing ::::selectedTypeName::",type_name);
                var params = {typeCode:type_id};
                $state.go("tab.search",params);
            };

    })
    })

.controller('SearchCtrl', function($scope, SearchService, LocalStorage,$stateParams, $ionicPopup, $state, $ionicLoading, $rootScope) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To lisiten for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        var count,cityArray;
        $scope.moredata = true;
        console.log("Reached search controller");
        var cityName= LocalStorage.getObject('geoCity').geoCityName;

        //default scenario
        if(!$stateParams.typeCode){
            $scope.typeCode     =   'pca';
            $scope.typeNameSel  =   'Pet Care';
        } else{
            $scope.typeCode     =   $stateParams.typeCode;
            $scope.typeNameSel  =   $rootScope.selectedTypeName;
        }

        $scope.cityName     =   cityName;
        console.log("cityName::::", cityName);

        $scope.cityId       =   $rootScope.cityId;

        console.log("typecode:::",$scope.typeCode);
        $scope.items        =   [];

        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring Data!'
        });

        SearchService.getCityDetails($scope.typeCode).success(function (data) {
            console.log("getCityDetails",data);
            var cityDetails = [];
            if (data.data["city_names"] && data.data["city_names"][0]) {
               var cityList = data.data["city_names"][0].data;
              for(var i=0;i<cityList.length;i++){
                  cityDetails[cityList[i].name] = cityList[i].id;
              }
            }
            $scope.searchVal = cityDetails;
            console.log("city names available::::",cityDetails);
            count       = {upperLimit:10, lowerLimit:0};
            cityArray   = [];

            Object.keys(cityDetails).forEach(function(key,index) {
                // key: the name of the object key
                // index: the ordinal position of the key within the object
                cityArray.push({id: cityDetails[key], text: key, checked: false, icon: null});
            });

            // for select box directive
            $scope.countries                =   cityArray;
            console.log("cityArray",cityArray);
            $scope.countries_text_single    =   'Choose different city';
            $scope.countries_text_multiple  =   'Choose countries';
            $scope.val                      =   {single: null, multiple: null};


            $ionicLoading.hide();

        }).error(function (data) {
            $scope.searchVal    =   $rootScope.cityNames;
            console.log("city names available::::",cityDetails);
            count       = {upperLimit:10, lowerLimit:0};
            cityArray   = [];
            cityArray = $scope.searchVal;
            Object.keys(cityDetails).forEach(function(key,index) {
                // key: the name of the object key
                // index: the ordinal position of the key within the object
                cityArray.push({id: cityDetails[key], text: key, checked: false, icon: null});
            });

            // for select box directive
            $scope.countries                =   cityArray;
            $scope.countries_text_single    =   'Choose different city';
            $scope.countries_text_multiple  =   'Choose countries';
            $scope.val                      =   {single: null, multiple: null};
            $ionicLoading.hide();
        });









         var getUserList = function(selectedItem) {
            var params,userList;
             $ionicLoading.show({
                 template: 'loading..',
                 animation: 'fade-in',
                 noBackdrop: false
             });
            if(selectedItem) {
                $scope.cityName     =   selectedItem.text;
                $scope.cityId       =   selectedItem.id;
                params = {cityId:selectedItem.id,typeCode:$scope.typeCode};
                count       = {upperLimit:10, lowerLimit:0};
            } else{
                params = {cityId:$scope.cityId,typeCode:$scope.typeCode};
                count       = {upperLimit:10, lowerLimit:0};
            }

            SearchService.getUserList(params,count).success(function (data) {
                console.log("getUserList",data);
                userList = [];
                $scope.items = userList;
                if (data.data["Search Result"] && data.data["Search Result"][0]) {
                    userList = data.data["Search Result"][0].data;
                    $scope.items = userList;
                    console.log("$scope.items",$scope.items);
                }

                if (userList.length > 0) {
                    $scope.userData = true;
                    $scope.moredata = true;
                } else {
                    $scope.userData = false;
                    $scope.moredata = false;
                }
                $ionicLoading.hide();

            }).error(function (data) {
                $scope.userData = false;
                $scope.moredata = false;
                $ionicLoading.hide();
            });
        };

        getUserList();


        $scope.loadMore = function() {
            var params,userList;

            if($scope.items.length > 0) {

                $scope.moredata = true;

                console.log("InsideloadMore");
                params = { cityId: $scope.cityId, typeCode: $scope.typeCode };
                count.lowerLimit = count.upperLimit;
                count.upperLimit = count.upperLimit + 5;
                $ionicLoading.show({
                    template: 'loading..',
                    animation: 'fade-in',
                    noBackdrop: false
                });
                SearchService.getNewUsers(params, count).then(function (items) {
                    console.log("getNewUsers is called");
                    $ionicLoading.hide();
                    userList = [];
                    if (items.data["Search Result"] && items.data["Search Result"][0]) {
                        userList = items.data["Search Result"][0].data;
                        console.log("userlist inside loadmore", userList.length);
                        if (userList.length > 0) {
                            $scope.moredata = true;
                        } else {
                            $scope.moredata = false;
                        }
                        $scope.items = $scope.items.concat(userList);
                        console.log("$scope.items", $scope.items);

                    } else {
                        console.log("no data!!!!");
                        $scope.moredata = false;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');


                });
            }else{
                $scope.moredata = false;
            }
        };

        $scope.callbackFunctionInController = function(item){
            getUserList(item);
        };
    })

.controller('SearchDetailCtrl', function($scope, LocalStorage, $stateParams, SearchService, $ionicLoading, $state, geoLocationService, $rootScope, $ionicPopup) {
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

        var onSuccessCall = function(){console.log("call is successfull");};
        var onErrorCall = function(){console.log("call got an error");};

        $scope.callPhone = function(number){
                var confirmPopup = $ionicPopup.confirm({
                    title: '',
                    template: '<ul><li class="ion-android-call" data-pack="android" data-tags="telephone">&nbsp;&nbsp;&nbsp;'+number+'</li></ul>',
                    okText: 'Call', // String (default: 'OK'). The text of the OK button.
                    okType: 'button-assertive' // String (default: 'button-positive'). The type of the OK button.
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        window.plugins.CallNumber.callNumber(onSuccessCall, onErrorCall, number, true);
                    } else {
                        console.log('Call cancelled');
                    }
                });
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
                    addr = addr+"+"+$stateParams.citySelected;
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

        $scope.claim = function(){
            var userDetails = LocalStorage.getObject('loginDetails');
            var params = {claim_pageid:$scope.searchDetails.page_entry_id, claim_useridid:userDetails.userid};
            $state.go("claim",params);
        };
    })

.controller('ClaimCtrl', function($scope, $stateParams, LoginService, $ionicLoading, $ionicHistory, $ionicPopup) {
     console.log("inside ClaimCtrl",$stateParams);
        $scope.data = {};
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
     $scope.submitClaim = function(){
         var email = $scope.data.claim_email;
         var name = $scope.data.claim_name;
         var mobile = $scope.data.claim_mobile;
         var details = $scope.data.claim_detail;
         var claim_pageid = $stateParams.claim_pageid;
         var claim_useridid = $stateParams.claim_useridid;

         var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
         var errorString = "";

         if (!name || name == '')
         {
             errorString = errorString + '<br/>* Valid Name';
         }

         if (!email || email == '' || !re.test(email))
         {
             errorString = errorString + '<br/>* Valid Email';
         }

         if (!mobile || mobile == '' || isNaN(mobile))
         {
             errorString = errorString + '<br/>* Valid Mobile';
         }

         if(errorString == ''){
             $ionicLoading.show({
                 template: 'loading..',
                 animation: 'fade-in',
                 noBackdrop: false
             });
             LoginService.claim(name, email, mobile,
                 details, claim_pageid, claim_useridid).success(function (data) {
                     console.log("Inside claim",data);
                     $ionicLoading.hide();

                     if (data.data.Error) {
                         console.log("Inside ERROR message",data.data.Error[0]);
                         /* $ionicHistory.nextViewOptions({
                          disableBack: true
                          });*/
                         // $state.go('tab.dash');
                         $ionicPopup.alert({
                             title: 'Error!',
                             template: data.data.Error[0].message,
                             buttons: [
                                 {
                                     text: '<b>OK</b>',
                                     type: 'button-assertive'
                                 }
                             ]
                         });
                     }
                     else if (data.status == 200) {
                         $ionicPopup.alert({
                             title: 'Success!',
                             template: "Your request sent to our support team successfully",
                             buttons: [
                                 {
                                     text: '<b>OK</b>',
                                     type: 'button-assertive'
                                 }
                             ]
                         });

                         $ionicHistory.nextViewOptions({
                             disableBack: true
                         });
                         $state.go('signin');
                     }



                 }).error(function (data) {
                     $ionicHistory.nextViewOptions({
                         disableBack: true
                     });
                     $ionicLoading.hide();
                     $ionicPopup.alert({
                         title: 'Error!',
                         template: 'Please try again!',
                         buttons: [
                             {
                                 text: '<b>OK</b>',
                                 type: 'button-assertive'
                             }
                         ]
                     });
                 });
         } else{
             $ionicPopup.alert({
                 title: 'Please enter the mandatory fields',
                 template: errorString,
                 buttons: [
                     {
                         text: '<b>OK</b>',
                         type: 'button-assertive'
                     }
                 ]
             });
         }

     };
    })

.directive('map', function() {
    return {
        restrict: 'A',
        link:function(scope, element, attrs){
            var map = null;
            var myLatlng = null;
            var mapOptions = null;
            var directionsService = null;
            var directionsDisplay = null;
            var myLocation = null;
            var destination = null;
            var request = null;

            var zValue = scope.$eval(attrs.zoom);
            var lat = scope.$eval(attrs.lat);
            var lng = scope.$eval(attrs.lng);
            var directionLong = scope.$eval(attrs.dirlo);
            var directionLat = scope.$eval(attrs.dirla);

            console.log("directionLong", directionLong);
            console.log("directionLat", directionLat);

            myLatlng = new google.maps.LatLng(lat,lng);

            mapOptions = {
                zoom: zValue,
                center: myLatlng
            };
            map = new google.maps.Map(document.getElementById("map"),mapOptions);


            directionsService = new google.maps.DirectionsService();
            directionsDisplay = new google.maps.DirectionsRenderer();

            myLocation = new google.maps.LatLng(lat,lng);

            destination = new google.maps.LatLng(directionLat, directionLong);


             request = {
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
        LocalStorage.removeItem('loginDetails');

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
                    'callback'     : '&'
                },

                controller: function($scope, $rootScope){
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
                            console.log("inside search", str);
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
                    scope.validateSingle = function (item, typeCode) {
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
                            scope.callback ()({id:scope.value,text:scope.text,typeCode:typeCode});
                        }
                    }
                }
            };
        }
    ]
);



