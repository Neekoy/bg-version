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


app.controller('adminController', function($scope, $http, $cookies, $window, $timeout, $location, $anchorScroll) {

	this.ACTIVE_CHATS = {};
	this.DISPLAYED_CHATS = {};
	this.CHAT_CONTENT = {};
	this.chatMessage = {};

	this.chatEnabled = false;

	this.toggleChat = function() {
		this.chatEnabled = !this.chatEnabled;
		console.log(this.chatEnabled);
	}

	this.toggleUserChat = function (session) {
		if (this.DISPLAYED_CHATS[session]) {
			delete this.DISPLAYED_CHATS[session];
		} else {
			this.DISPLAYED_CHATS[session] = true;
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
				message: data.content,
				user: 'user',
			}
			this.CHAT_CONTENT[data.chatSession].push(toAddChatContent);
			console.log(this.CHAT_CONTENT[data.chatSession]);
		}.bind(this));
	}.bind(this));

	socket.on('messageToAdmin', function(data) {
		$timeout(function(){
			timestamp = new Date().getTime();
			toAddChatContent = {
				timestamp: timestamp,
				username: data.username,
				message: data.content,
				user: 'user',
			}
			this.CHAT_CONTENT[data.chatSession].push(toAddChatContent);
		}.bind(this));
	}.bind(this));

	this.submitChat = function(key) {
		timestamp = new Date().getTime();
		toAddChatResponse = {
			timestamp: timestamp,
			username: 'admin',
			message: this.chatMessage[key],
			user: 'admin',
		}
		this.CHAT_CONTENT[key].push(toAddChatResponse);
		this.chatMessage[key] = "";
		$timeout(function(){
			$location.hash('bottom');
			$anchorScroll();
	    });
	};
});