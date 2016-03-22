angular.module('starter.services', [])

.factory('LoginService', function($http,$q) {
    return {
        signUp: function(pop_email, pop_pwd, pop_con_pwd, pop_con_regdob, tit_select_box) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            /* var  postData = {
             "login_password": pw,
             "login_username": name
             };*/

            var headers = {
                'Content-Type': 'application/json'
            };

            var req = {
                method: 'GET',
                url: 'http://demo.titill.com/mobileapiajax/register?' +
                    'pop_email='+pop_email+'&pop_pwd='+pop_pwd+
                    '&pop_con_pwd='+pop_con_pwd+'&pop_con_regdob='+pop_con_regdob+
                    '&tit_select_box='+tit_select_box,
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
        claim: function(claim_name, claim_email, claim_mobile, claim_detail, claim_pageid,claim_useridid) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var headers = {
                'Content-Type': 'application/json'
            };

            var req = {
                method: 'GET',
                url: 'http://demo.titill.com/mobileapiajax/advertisementclaim?' +
                    'claim_name='+claim_name+'&claim_email='+claim_email+'&claim_useridid='+claim_useridid+
                    '&claim_mobile='+claim_mobile+'&claim_detail='+claim_detail+
                    '&claim_pageid='+claim_pageid,
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
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

           /* var  postData = {
                "login_password": pw,
                "login_username": name
            };*/

            var headers = {
                'Content-Type': 'application/json'
            };

            var req = {
                method: 'GET',
                url: 'http://demo.titill.com/mobileapiajax/login?login_username='+name+'&login_password='+pw,
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
        getUserPwd: function(email) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            var headers = {
                'Content-Type': 'application/json'
            };

            var req = {
                method: 'GET',
                url: 'http://demo.titill.com/mobileapiajax/forgotpassword?forgot_emailid='+email,
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

            },
            getDirection: function(addr) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                var headers = {
                    'Content-Type': 'application/json'
                };

                var url = BASE_URL + "address="+addr+"&key=AIzaSyAoVMZ_NA31Lio44mlHR9lIKsBWvi2I8-0";

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
   console.log("Reached SearchService");
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
        getCityDetails: function(typeCode){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var headers = {
                'Content-Type': 'application/json'
            };

            var url = 'http://demo.titill.com/mobileapiajax/usertypecity/'+typeCode;

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
        },
        getLikes: function(userId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var headers = {
                'Content-Type': 'application/json'
            };

            var url = BASE_URL+'likes/'+userId;

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
        getFollowers: function(userId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var headers = {
                'Content-Type': 'application/json'
            };

            var url = BASE_URL+'followers/'+userId;

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
        getRating: function(userId){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var headers = {
                'Content-Type': 'application/json'
            };

            var url = BASE_URL+'rating/'+userId;

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
}]);
