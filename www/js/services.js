angular.module('starter.services', [])


.factory('LoginService', function($http,$q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var  postData = {
                "login_password": pw,
                "login_username": name
            };

            var headers = {
                'Content-Type': 'application/json'
            };

            var req = {
                method: 'POST',
                url: 'http://demo.titill.com/mobileapi/login',
                headers: headers,
                data: postData
            };


            $http(req).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getUserPwd: function(email) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var  postData = {
                forgot_emailid: email
            };

            var headers = {
                'Content-Type': 'application/json'
            };

            var req = {
                method: 'POST',
                url: 'http://demo.titill.com/mobileapi/forgotpassword',
                headers: headers,
                data: postData
            };

            $http(req).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getCities: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var headers = {
                'Content-Type': 'application/json'
            };

            var req = {
                method: 'GET',
                url: 'http://demo.titill.com/mobileapi/geocities',
                headers: headers
            };

            console.log("Inside LoginService getCities::::",req.url);

            $http(req).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }

    }
})

.factory('geoLocationService', function($http, $q){
        var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?sensor=true&";

        return {
            getCity: function(lat,long) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                var headers = {
                    'Content-Type': 'application/json'
                };

                var url = BASE_URL + "latlng="+lat+","+long+"&key=AIzaSyAoVMZ_NA31Lio44mlHR9lIKsBWvi2I8-0";

                var req = {
                    method: 'GET',
                    url: url,
                    headers: headers
                };

                console.log(req.url);

                $http(req).then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });

                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                };
                return promise;

            }
        }
    })

.factory('UserService', function($http, $q){
    var BASE_URL = "http://demo.titill.com/mobileapi/";

    return {
        getUserType: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var headers = {
                'Content-Type': 'application/json'
            };

            var url = BASE_URL + 'titillusertype/';

            var req = {
                method: 'GET',
                url: url,
                headers: headers
            };

            console.log("Inside UserService ::: getUserType--",req.url);

            $http(req).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;

        }
    }
})

.factory('SearchService', function($http, $q){
    var BASE_URL = "http://demo.titill.com/mobileapi/";
    var items = [];

    return {
        getUserList: function(params,count){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var headers = {
                'Content-Type': 'application/json'
            };
            var limitUp = count.upperLimit;
            var limitDown = count.lowerLimit;
            var url = BASE_URL+'search/'+params.cityId+'/'+params.typeCode+'/'+limitDown+'/'+limitUp+'/';

            var req = {
                method: 'GET',
                url: url,
                headers: headers
            };

            console.log(req.url);

            $http(req).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getNewUsers: function(params,count){
            var limitUp = count.upperLimit;
            var limitDown = count.lowerLimit;
            var url = BASE_URL+'search/'+params.cityId+'/'+params.typeCode+'/'+limitDown+'/'+limitUp+'/';
console.log("getNewUsers inside",url);
            return $http.get(url).then(function(response){
                items = response;
                return items;
            });
        },
        getSearchDetails: function(params){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var headers = {
                'Content-Type': 'application/json'
            };

            var url = BASE_URL+'userpage/'+params.userId+'/'+params.userTypeId;

            var req = {
                method: 'GET',
                url: url,
                headers: headers
            };

            console.log(req.url);

            $http(req).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getSearchImage: function(userId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var headers = {
                'Content-Type': 'application/json'
            };

            var url = BASE_URL+'userdetailsmedia/'+userId;

            var req = {
                method: 'GET',
                url: url,
                headers: headers
            };

            console.log(req.url);

            $http(req).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        getViews: function(userId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var headers = {
                'Content-Type': 'application/json'
            };

            var url = BASE_URL+'views/'+userId;

            var req = {
                method: 'GET',
                url: url,
                headers: headers
            };

            console.log(req.url);

            $http(req).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }

    }
})

.factory('geoLocation', function (LocalStorage) {
    return {
        setGeolocation: function (latitude, longitude) {
            var _position = {
                latitude: latitude,
                longitude: longitude
            }
            LocalStorage.setObject('geoLocation', _position)
        },
        getGeolocation: function () {
            return glocation = {
                lat: LocalStorage.getObject('geoLocation').latitude,
                lng: LocalStorage.getObject('geoLocation').longitude
            }
        }
    }
})

.factory('LocalStorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        removeItem: function(key) {
            $window.localStorage.removeItem(key);
        }
    }
}])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
