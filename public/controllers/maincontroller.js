console.log("Greetings from the main controller.");

var socket = io();

var app = angular.module('mainApp', []);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});


app.controller('mainController', function($scope, $http) {

	this.itemsInCart = 0;
	console.log(this.itemsInCart);

	$scope.$watch('$viewContentLoaded', function() {
		console.log("The content has been fully loaded.");
	});

	this.tab = "main";
	this.gameActive = false;
	this.username = "";

	this.changeTab = function(tab) {
		this.tab = tab;
	};

	this.activeTab = function(tab) {
		return this.tab === tab;
	};


});