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
		this.products = $cookies.getObject("productsInCart");
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
			this.products = {};
			this.products[boughtStuff] = 1;
			$cookies.putObject("productsInCart", this.products);
		} else {
			this.products = $cookies.getObject("productsInCart");
			if (this.products.hasOwnProperty(boughtStuff)) {
				this.products[boughtStuff] += 1;
				$cookies.putObject("productsInCart", this.products);
			} else {
				this.products[boughtStuff] = 1;
				$cookies.putObject("productsInCart", this.products);
			}
		}
		console.log(this.products);
		
	}

	this.getNumberInCart = function(num) {
    	return new Array(num);
	}

	this.getProductDesc = function(prodName) {
		if (prodName === "cloudBasic") {
			return "Cloud Hosting";
		}
		if (prodName === "cloudStandard") {
			return "Cloud Hosting";
		}
		if (prodName === "cloudPro") {
			return "Cloud Hosting";
		}
		if (prodName === "cloudUltimate") {
			return "Cloud Hosting";
		} else {
			return "Other service";
		}
	}

	this.getProductSize = function(prodName) {
		if (prodName === "cloudBasic") {
			return "Basic Plan";
		}
		if (prodName === "cloudStandard") {
			return "Standard Plan";
		}
		if (prodName === "cloudPro") {
			return "Pro Plan";
		}
		if (prodName === "cloudUltimate") {
			return "Ultimate Plan";
		} else {
			return "One size";
		}
	}

	this.toggleCart = function() {
		this.showCart = !this.showCart;
	}

	this.emptyCart = function() {
		$cookies.remove("productsInCart");
		$cookies.put("itemsInCart", 0);
		this.itemsInCart = 0;
		this.itemsInCartFormatted = "(" + this.itemsInCart + ")";
	}
});