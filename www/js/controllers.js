angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  $scope.images = [{src:"img/petCares.svg",label:"Pet Cares"},
    {src:"img/petClubs.svg",label:"Pet Clubs"},
    {src:"img/petOwners.svg",label:"Pet Owners"},
    {src:"img/petCommunities.svg",label:"Pet Communities"},
    {src:"img/petStores.svg",label:"Pet Stores"},
    {src:"img/petEvents.svg",label:"Pet Events"}];
})

.controller('ChatsCtrl', function($scope, Chats) {
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
