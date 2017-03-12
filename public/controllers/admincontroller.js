console.log("Greetings from the admin controller.");

var socket = io();

var app = angular.module('adminApp', ['ngCookies']);

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


app.controller('adminController', ['$scope', '$http', '$cookies', '$window', '$timeout', '$location', '$anchorScroll',
 function($scope, $http, $cookies, $window, $timeout, $location, $anchorScroll) {

	this.ACTIVE_CHATS = {};
	this.DISPLAYED_CHATS = {};
	this.CHAT_CONTENT = {};
	this.chatMessage = {};
	$scope.newMessage = [];



	$scope.$watch('newMessage', function (newVal, oldVal) {
		  	var wtf = $('#scroller');
		  	if (typeof wtf[0] != 'undefined') {
		  		console.log("VME");
			  	var height = wtf[0].scrollHeight;
			 	wtf.scrollTop(height);	
		  	}

	}, true);

	socket.emit("adminGetChats", "initial");

	socket.on("adminGetChatStatus", function(data) {
		this.chatEnabled = data;
	}.bind(this));

	socket.on("adminReceiveChats", function(data) {
		console.log(data);
		for (session in data) {
			this.ACTIVE_CHATS[session] = "Customer";
			this.CHAT_CONTENT[session] = [];
			for (var i = 0; i < data[session].length; i++) {
				if (data[session][i].user != 'admin') {
					this.ACTIVE_CHATS[session] = data[session][i].username;
				}
				this.CHAT_CONTENT[session].push(data[session][i]);
			}	
		}
		$scope.$apply();
	}.bind(this))

	this.chatEnabled = false;

	this.toggleChat = function() {
		this.chatEnabled = !this.chatEnabled;
		socket.emit("toggleChat", this.chatEnabled);
	}

	this.toggleUserChat = function (session, username) {
		if (this.DISPLAYED_CHATS[session]) {
			delete this.DISPLAYED_CHATS[session];
		} else {
			this.DISPLAYED_CHATS[session] = username;
			$timeout(function(){
				$location.hash('bottom');
				$anchorScroll();
			});
		}
	}

	socket.on("newChat", function(data) {
		this.chatMessage[data.chatSession] = "";
		socket.emit("adminJoinChat", data.chatSession);
		$timeout(function(){
			timestamp = new Date().getTime();
			this.ACTIVE_CHATS[data.chatSession] = data.username;
			this.CHAT_CONTENT[data.chatSession] = [];
			toAddChatContent = {
				timestamp: timestamp,
				username: data.username,
				message: data.message,
				user: 'user',
			}
			this.CHAT_CONTENT[data.chatSession].push(toAddChatContent);
			console.log(this.CHAT_CONTENT[data.chatSession]);
		}.bind(this));
	}.bind(this));

	socket.on('messageToAdmin', function(data) {
		timestamp = new Date().getTime();
		toAddChatContent = {
			timestamp: timestamp,
			username: data.username,
			message: data.message,
			user: 'user',
		}
		$timeout(function(){
			this.CHAT_CONTENT[data.chatSession].push(toAddChatContent);
		}.bind(this));
		$scope.newMessage = [];
		$scope.newMessage.push("1");
	}.bind(this));

	this.submitChat = function(key) {
		timestamp = new Date().getTime();
		toAddChatResponse = {
			timestamp: timestamp,
			username: 'Християн',
			message: this.chatMessage[key],
			user: 'admin',
			session: key,
		}
		this.CHAT_CONTENT[key].push(toAddChatResponse);
		this.chatMessage[key] = "";
		$timeout(function(){
			$location.hash('bottom');
			$anchorScroll();
		});

		socket.emit("messageFromAdmin", toAddChatResponse);
	};

	this.closeChat = function(session) {
		for (var key in this.ACTIVE_CHATS) {
			if (key === session) {
				delete this.ACTIVE_CHATS[session];
			}
		}
		for (var key2 in this.DISPLAYED_CHATS) {
			if (key2 === session) {
				delete this.DISPLAYED_CHATS[session];
			}
		}
		socket.emit("closeChat", session);
	}
}]);