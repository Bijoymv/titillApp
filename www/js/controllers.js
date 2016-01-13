angular.module('starter.controllers', [])


.controller('SignInCtrl', function($scope, $rootScope, LoginService, $ionicPopup, $state, $ionicLoading, LocalStorage, geoLocation, geoLocationService, $cordovaGeolocation) {
    $scope.data = {};
    LocalStorage.removeItem('userTypes');
   // $state.go('tab.dash');
    var loginDetails = LocalStorage.getObject('loginDetails');
    console.log("Reached SignInCtrl",loginDetails.username);

    var getCities = function (){
        LoginService.getCities().success(function (data) {
            var cityNames = new Array();
            if (data.data.city_names[0].data) {
                for(var i=0; i< data.data.city_names[0].data.length; i++){
                    cityNames[data.data.city_names[0].data[i].name]=data.data.city_names[0].data[i].id;
                }
            }
            $rootScope.cityNames = cityNames;
        }).error(function (data) {
          console.log("error in fetching city names");
            $rootScope.cityNames = [];
        });
    };

        if(!$rootScope.cityNames || !$rootScope.cityNames.length > 0){
            getCities();
        }



        ionic.Platform.ready(function(){
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
            });

            var posOptions = {
                enableHighAccuracy: false,
                timeout: 20000,
                maximumAge: 0
            };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                var lat  = position.coords.latitude;
                var long = position.coords.longitude;
                console.log("cordovaGeolocatiosssn",lat);
                console.log("cordovaGeolocationdd long",long);
                $ionicLoading.hide();

            }, function(err) {
                $ionicLoading.hide();
                $rootScope.cityNameGeo = "Bangalore";
                console.log("Geolocation errosssssr",err);
            });
        });



            //x.innerHTML="Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
          /*  var geocodingAPI = "https://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng="+position.coords.latitude+","+position.coords.longitude+"&key=AIzaSyAoVMZ_NA31Lio44mlHR9lIKsBWvi2I8-0";
            $.getJSON(geocodingAPI, function (json) {
                if (json.status == "OK") {
                    var result = json.results[0];
                    var city = "";
                    var state = "";
                    for (var i = 0, len = result.address_components.length; i < len; i++) {
                        var ac = result.address_components[i];
                        if (ac.types.indexOf("administrative_area_level_1") >= 0) state = ac.long_name;
                        if (ac.types.indexOf("administrative_area_level_2") >= 0) city = ac.long_name;
                    }
                    if (state != '') {
                        console.log("You are in " + city + ", " + state + "!");
                        if(city == "bengaluru" || city == "Bengaluru" || city == "Bangalore Urban" || city == "bangalore urban"){
                            $('#tag_location, #tag_geoloc').val('Bangalore');
                        }else if($('#tag_location').val() == ""){ $('#tag_location, #tag_geoloc').val(city); }else{ }
                    }
                }else{
                }

            });*/
        //};

/*if(LocalStorage.getObject('cityDetails') !== undefined){
 console.log("cityDetails",LocalStorage.getObject('cityDetails'));
} else{
    getCities();
}*/

   /* if (loginDetails.username !== undefined) {
        $state.go('tab.dash');
    }*/
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

    $scope.getPwd = function() {
         $ionicLoading.show({
             template: 'loading..',
             animation: 'fade-in',
             noBackdrop: false
         });
            LoginService.getUserPwd($scope.data.email).success(function(data) {
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

.controller('DashCtrl', function($scope, UserService, $ionicPopup, $state, $ionicLoading, LocalStorage) {

        $scope.userType = null;
        $scope.images = null;
        console.log("Reached DashCtrl",LocalStorage);
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
                    template: 'Please check your internet Connection!',
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


        $scope.getListing = function(city_id,type_id){
            var params = {cityId:city_id,typeCode:type_id};
            $state.go("tab.search",params);
        };

})

.controller('SearchCtrl', function($scope, SearchService, $stateParams, Chats, $ionicPopup, $state, $ionicLoading, LocalStorage) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To lisiten for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});



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

                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Data not available!',
                    template: 'Please check your internet Connection!',
                    buttons: [
                        {
                            text: '<b>OK</b>',
                            type: 'button-assertive'
                        }
                    ]
                });
            });
        };

        getUserList();

        $scope.loadMore = function() {
            $scope.moredata = false;
                console.log("InsideloadMore");
                count.lowerLimit = count.upperLimit;
                count.upperLimit = count.upperLimit + 40;

                SearchService.getNewUsers($stateParams,count).then(function(items){
                    console.log("getNewUsers is called");
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

        var getUserImage = function() {
            console.log("Inside getUserImage");
            SearchService.getSearchImage($stateParams).success(function (data) {
                var userList = [];
                console.log("getUserImage",data);
            }).error(function (data) {
            });
        };




    })


.controller('SearchDetailCtrl', function($scope, $stateParams, SearchService, $ionicLoading) {
        console.log("getSearchDetails is called");
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
    })

.controller('ChatsCtrl', function($scope, $stateParams, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };

});
