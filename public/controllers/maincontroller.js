console.log("Greetings from the main controller.");

var socket = io();

var app = angular.module('mainApp', ['ngCookies']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.controller('mainController', function($scope, $http, $cookies) {

	if (typeof $cookies.get("itemsInCart") === "undefined") {
		$cookies.put("itemsInCart", 0);
		this.itemsInCart = 0;
	} else {
		this.itemsInCart = $cookies.get("itemsInCart");
	}
	this.itemsInCartFormatted = "(" + this.itemsInCart + ")";

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

	this.addToCart = function(boughtStuff) {

		this.itemsInCart = $cookies.get("itemsInCart");
		this.itemsInCart = parseFloat(this.itemsInCart) + 1;
		$cookies.put("itemsInCart", this.itemsInCart);
		this.itemsInCartFormatted = "(" + this.itemsInCart + ")";

		if (typeof $cookies.get("productsInCart") === "undefined") {
			var products = {};
			products[boughtStuff] = 1;
			$cookies.putObject("productsInCart", products);
		} else {
			products = $cookies.getObject("productsInCart");
			if (products.hasOwnProperty(boughtStuff)) {
				products[boughtStuff] += 1;
				$cookies.putObject("productsInCart", products);
			} else {
				products[boughtStuff] = 1;
				$cookies.putObject("productsInCart", products);
			}
		}
		check = $cookies.getObject("productsInCart");
		console.log(check);
		
	}

	this.toggleCart = function() {
		this.showCart = !this.showCart;
	}

});