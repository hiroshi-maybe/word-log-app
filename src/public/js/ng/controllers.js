'use strict';

/* Controllers */

var app = angular.module('wordLogApp', []);

app.controller('wordListCtrl', function($scope, $http) {
  $http.get('word/list').success(function(res) {
    $scope.words = res.data;
  });
  
  $scope.lookup_dic = function() {
    var word = $scope.new_word;
    if (word.length<1) { return; }
    window.open('http://eow.alc.co.jp/search?q='+word, '_blank');
  };
});