console.log("Greetings from the main controller.");

var socket = io();

var app = angular.module('mainApp', ['ngCookies']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

app.controller('mainController', function($scope, $http, $cookies, $window) {

	console.log($window.innerWidth);
    blankSpacePercent = $window.innerWidth / 1920 * 100;
    this.navLinkBlank = blankSpacePercent * 3.4 * blankSpacePercent / 100 * blankSpacePercent / 100 * blankSpacePercent / 100 * blankSpacePercent / 100;

    this.leftSpace = blankSpacePercent * 0.13;

    if ($window.innerWidth < 1730 ) {
    	this.navMenuOffsetServers = -200;
    }

    if ($window.innerWidth < 1571 ) {
    	this.navMenuOffsetHosting = -100;
    }

    if ($window.innerWidth < 1300) {
    	this.aboutSmallScreen = true;
    	this.aboutBigScreen = false;
    	this.aboutFlex = 'inline-block';
    	this.aboutTextSize = '100';
    } else {
    	this.aboutSmallScreen = false;
    	this.aboutBigScreen = true;
    	this.aboutFlex = 'flex';
       	this.aboutTextSize = '55';
    }

    if ($window.innerWidth < 1050) {
    	this.fullMenu = false;
    	this.mobileMenu = true;
    	this.wordpressFlex = 'inline-block';
    	this.wordpressImgWidth = 100;
    	this.wordpressTextAlign = 'center';
    	this.wordpressTextMargin = '30px';
    } else {
    	this.fullMenu = true;
    	this.mobileMenu = false;
    	this.wordpressFlex = 'flex';
    	this.wordpressImgWidth = 55;
    	this.wordpressTextAlign = 'left';
    	this.wordpressTextMargin = '10%';
    }

    if ($window.innerWidth < 897) {
    	this.advantgeWidth = 100;
    	this.advantageCenterLeft = "center";
    	this.advantageCenterRight = "center";
    	this.advantageImgBorder = 'none';
    } else {
    	this.advantgeWidth = 40;
    	this.advantageCenterLeft = "left";
    	this.advantageCenterRight = "right";
       	this.advantageImgBorder = '1px dashed #c1c1c1';
    }

    if ($window.innerWidth < 692) {
    	this.navLogoClass = 'navLogoImage';
	    this.flowerCont = 40;
	    this.flowerLeft = 0;
	    this.cloudFlowerTextHeight = 45;
	    this.cloudFlowerLine = false;
	    this.cloudFlowerHeight = 400;
    } else {
    	this.navLogoClass = 'navLogoImageBig';
	    this.flowerCont = 30;
	    this.flowerLeft = 10;
	    this.cloudFlowerTextHeight = 35;
	    this.cloudFlowerLine = true;
	    this.cloudFlowerHeight = 300;
    }

	angular.element($window).bind('resize', function () {
        blankSpacePercent = $window.innerWidth / 1920 * 100;
        blankSpace = blankSpacePercent * 3.4 * blankSpacePercent / 100 * blankSpacePercent / 100 * blankSpacePercent / 100 * blankSpacePercent / 100;
        this.leftSpace = blankSpacePercent * 0.13;
	    this.navLinkBlank = blankSpace - 15;

	    if ($window.innerWidth < 1300) {
	    	this.aboutSmallScreen = true;
	    	this.aboutBigScreen = false;
	    	this.aboutFlex = 'inline-block';
	    	this.aboutTextSize = '100';
	    } else {
	    	this.aboutSmallScreen = false;
	    	this.aboutBigScreen = true;
	    	this.aboutFlex = 'flex';
	       	this.aboutTextSize = '55';
	    }

	    if ($window.innerWidth < 1050) {
	    	this.fullMenu = false;
	    	this.mobileMenu = true;
	    	this.wordpressFlex = 'inline-block';
	    	this.wordpressImgWidth = 100;
	    	this.wordpressTextAlign = 'center';
	    	this.wordpressTextMargin = '30px';
	    } else {
	    	this.fullMenu = true;
	    	this.mobileMenu = false;
	    	this.wordpressFlex = 'flex';
	    	this.wordpressImgWidth = 55;
	    	this.wordpressTextAlign = 'left';
	    	this.wordpressTextMargin = '10%';
	    }

	    if ($window.innerWidth < 1730 ) {
	    	this.navMenuOffsetServers = -200;
	    } else {
	    	this.navMenuOffsetServers = 0;
	    }

	    if ($window.innerWidth < 1571 ) {
	    	this.navMenuOffsetHosting = -100;
	    } else {
	    	this.navMenuOffsetHosting = 0;
	    }

	    if ($window.innerWidth < 897) {
	    	this.advantgeWidth = 100;
	    	this.advantageCenterLeft = "center";
	    	this.advantageCenterRight = "center";
	    	this.advantageImgBorder = 'none';
	    } else {
	    	this.advantgeWidth = 40;
	    	this.advantageCenterLeft = "left";
	    	this.advantageCenterRight = "right";
	       	this.advantageImgBorder = "1px dashed #c1c1c1";
	    }

	    if ($window.innerWidth < 692) {
	    	this.navLogoClass = 'navLogoImage';
		    this.flowerCont = 40;
		    this.flowerLeft = 0;
		    this.cloudFlowerTextHeight = 45;
		    this.cloudFlowerLine = false;
		    this.cloudFlowerHeight = 400;
	    } else {
	    	this.navLogoClass = 'navLogoImageBig';
		    this.flowerCont = 30;
		    this.flowerLeft = 10;
		    this.cloudFlowerTextHeight = 35;
		    this.cloudFlowerLine = true;
		    this.cloudFlowerHeight = 300;
	    }


	    $scope.$apply();
	}.bind(this));

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

	this.addToCart = function(boughtStuff, size, timeFrame) {

		this.itemsInCart = $cookies.get("itemsInCart");
		this.itemsInCart = parseFloat(this.itemsInCart) + 1;
		$cookies.put("itemsInCart", this.itemsInCart);
		this.itemsInCartFormatted = "(" + this.itemsInCart + ")";

		id = guid();

		if (boughtStuff === "Cloud") {
			type = "hosting";
			if (size === "Basic") {
				if (timeFrame === "monthly") {
					price = 4.99;
				}
				else if (timeFrame === "yearly") {
					price = 49.99;
				}
			}
			if (size === "Standard") {
				if (timeFrame === "monthly") {
					price = 7.99;
				}
				else if (timeFrame === "yearly") {
					price = 79.99;
				}
			}
			if (size === "Pro") {
				if (timeFrame === "monthly") {
					price = 9.99;
				}
				else if (timeFrame === "yearly") {
					price = 99.99;
				}
			}
			if (size === "Ultimate") {
				if (timeFrame === "monthly") {
					price = 19.99;
				}
				else if (timeFrame === "yearly") {
					price = 199.99;
				}
			}			
		} else {
			type = "undefined";
		}

		if (typeof $cookies.get("productsInCart") === "undefined") {
			this.products = {};

			this.products[id] = {
				type: type,
				product: boughtStuff,
				size: size,
				timeframe: timeFrame,
				price: price,
				id: id
			};

			$cookies.putObject("productsInCart", this.products);
		} else {
			this.products = $cookies.getObject("productsInCart");
			this.products[id] = {
				type: type,
				product: boughtStuff,
				size: size,
				timeframe: timeFrame,
				price: price,
				id: id
			};
			$cookies.putObject("productsInCart", this.products);
		}
		console.log(this.products);
	}

	this.getNumberInCart = function(num) {
    	return new Array(num);
	}

	this.getProductDesc = function(prodName) {
		if (prodName === "Cloud") {
			return "Cloud Hosting";
		} else {
			return "Other service";
		}
	}

	this.getProductSize = function(prodName, prodSize) {
		if (prodName === "Cloud") {
			return prodSize + " Plan";
		}
		else {
			return "One size";
		}
	}

	this.calculateTotal = function(which) {
		if (typeof $cookies.get("productsInCart") === "undefined") {
			return 0;
		} else {
			products = $cookies.getObject("productsInCart");
			subtotal = 0;
			for (item in products) {
				subtotal = subtotal + products[item].price;
			}
			if (which === 'subtotal') {
				return subtotal.toFixed(2);
			} else if (which === 'vat') {
				result = subtotal/5;
				return result.toFixed(2);
			} else {
				vat = subtotal / 5;
				result = subtotal + vat;
				return result.toFixed(2);
			}
		}
	}

	this.toggleCart = function() {
		this.showCart = !this.showCart;
	}

	this.removeFromCart = function(key) {
		products = $cookies.getObject("productsInCart");
		for (product in products) {
			if (product === key.id) {
				delete products[product];
				this.products = products;
				$cookies.putObject("productsInCart", products);

				this.itemsInCart = $cookies.get("itemsInCart");
				this.itemsInCart = parseFloat(this.itemsInCart) - 1;
				$cookies.put("itemsInCart", this.itemsInCart);
				this.itemsInCartFormatted = "(" + this.itemsInCart + ")";
			}
		}
	}

	this.emptyCart = function() {
		$cookies.remove("productsInCart");
		$cookies.put("itemsInCart", 0);
		this.itemsInCart = 0;
		this.itemsInCartFormatted = "(" + this.itemsInCart + ")";
	}

	this.toggleChat = function(toDo) {
		if (toDo === "on") {
			this.fullChat = true;
		} else {
			this.fullChat = false;
		}
	}

	this.submitChat = function(data) {
		console.log(this.chatMessageClient);
		socket.emit("newChatMessage", this.chatMessageClient);
		this.chatMessageClient = "";
	}
});