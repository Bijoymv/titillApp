// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('signin', {
      url: '/sign-in',
      cache: false,
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
  })

  .state('claim', {
      url: '/claim/:claim_pageid/:claim_useridid',
      cache: false,
      templateUrl: 'templates/claim.html',
      controller: 'ClaimCtrl'
  })

  .state('signout', {
      url: '/sign-out',
      cache: false,
      templateUrl: '',
      controller: 'SignOutCtrl'
  })

  .state('forgotpassword', {
      url: '/forgot-password',
      cache: false,
      templateUrl: 'templates/forgot-password.html',
      controller: 'PWdRecoveryCtrl'
  })

  .state('map', {
      url: '/map',
      cache: false,
      templateUrl: 'templates/map.html',
      controller: 'MapCtrl'
  })

  .state('signup', {
      url: '/sign-up',
      cache: false,
      templateUrl: 'templates/register.html',
      controller: 'SignUpCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.search', {
      url: '/search/:typeCode',
          cache: false,
      views: {
          'tab-search': {
              templateUrl: 'templates/search.html',
              controller: 'SearchCtrl'
          }
      }
  })

  .state('tab.searchDefault', {
      url: '/searchDefault',

      views: {
          'tab-search': {
              templateUrl: 'templates/search.html',
              controller: 'SearchCtrl'
          }
      }
  })


  .state('tab.search-detail', {
      url: '/search-detail/:userId/:userTypeId/:citySelected',
          cache: false,
      views: {
          'tab-search': {
              templateUrl: 'templates/search-detail.html',
              controller: 'SearchDetailCtrl'
          }
      }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/dash');

  $urlRouterProvider.otherwise('/sign-in');

  $ionicConfigProvider.tabs.position('bottom');

});
