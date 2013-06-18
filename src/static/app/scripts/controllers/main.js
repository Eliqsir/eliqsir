'use strict';

angular.module('staticApp')
  .controller('MainCtrl', function ($scope,Juice) {
        $scope.categories = ['Citrus','Malty','Tainty','Flatulant','Horny','Desert','Soft Drink'];
        Juice.get().then(function(juices){
            $scope.juices = juices;
            $scope.vendors = _.chain(juices).pluck('maker').uniq().value();
        })
  });
