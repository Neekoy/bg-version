var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var MemcachedStore = require('connect-memcached')(session);
var uuid = require('node-uuid');
var Schema = mongoose.Schema;
var async = require("async");

mongoose.connect('mongodb://localhost/webhost');
global.db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var navigation = require('./routes/navigation')

// Init App
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io').listen(serv);

// Declare the Express session
var sessionMiddleware = session({
    secret: 'the most secretive secret possible',
    saveUninitialized: true,
    resave: true,
    store: new MemcachedStore({
        hosts: ['127.0.0.1:11211'],
    })
});

// Express session middleware for Socket.io
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

// Initialise the Express Session
app.use(sessionMiddleware);

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'default'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.inCart = 11;
  if (res.locals.user) {
    for (var i in res.locals.user) {
      if (i === 'username') {
        req.session.username = res.locals.user[i];
      }
    }
  }
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/', navigation);

// Set Port
app.set('port', (process.env.PORT || 4004));

// Start the Server
serv.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});

USERS_ONLINE = {};
USERS_CARTS = {};
USERS_CHATTING = {};
CHAT_LOGS = {};
CHATON = false;

io.sockets.on('connection', function(socket) {

    username = socket.request.session.username;
    sessionid = socket.request.sessionID;

    USERS_ONLINE[username] = socket.id;

    socket.on("toggleChat", function(onOff) {
      io.sockets.emit("toggleChatGlobally", onOff);
      if (onOff) {
        CHATON = true;
        console.log(CHATON);
      } else {
        CHATON = false;
      }
    });

    socket.on("getInitialChat", function() {
      if (CHATON) {
        if (CHAT_LOGS.hasOwnProperty(sessionid)) {
          socket.join(sessionid);
          console.log(CHAT_LOGS[sessionid]);
          socket.emit("receiveInitialChat", CHAT_LOGS[sessionid]);
        } else {
          socket.emit("receiveInitialChat", "none");
        }
      } else {
        console.log("stopped chat");
        socket.emit("receiveInitialChat", "chatOff");
      }
    });

    socket.on("adminGetChats", function() {
      for (session in CHAT_LOGS) {
        socket.join(session);
      }
      socket.emit("adminGetChatStatus", CHATON);
      socket.emit("adminReceiveChats", CHAT_LOGS);
    });

    socket.on("adminJoinChat", function(data) {
      socket.join(data);
    });

    socket.on("messageFromAdmin", function(data) {
      CHAT_LOGS[chatSession].push(data);
      io.to(data.session).emit("messageFromAdmin", data);
    });

    socket.on("newChatMessage", function(messageClientContent) {
      chatSession = socket.request.sessionID;
      timestamp = new Date().getTime();
      async.parallel([
        function(callback) {
          if ( !(USERS_CHATTING.hasOwnProperty(chatSession)) ) {
            USERS_CHATTING[chatSession] = [];
            CHAT_LOGS[chatSession] = [];
            socket.join(chatSession);

            socket.emit('chatGreetingMessage', chatSession);

            username = socket.request.session.username;
            if (typeof username === 'undefined') {
              chatUsername = "Customer"
            } else {
              chatUsername = username;
            }
            sendData = {
              timestamp: timestamp,
              username: chatUsername,
              chatSession: chatSession,
              message: messageClientContent,
              user: 'user',
            }
            CHAT_LOGS[chatSession].push(sendData);
            io.sockets.emit('newChat', sendData);
          } else {
            console.log("MESSAGING HERE " + chatSession);
            sendDataNew = {
              timestamp: timestamp,
              username: chatUsername,
              chatSession: chatSession,
              message: messageClientContent,
              user: 'user',
            }
            CHAT_LOGS[chatSession].push(sendDataNew);
            io.to(chatSession).emit('messageToAdmin', sendDataNew);
          }
        callback();
        }
      ]);
    })

    socket.on("closeChat", function(session) {
      for (var key in CHAT_LOGS) {
        if (key === session) {
          delete CHAT_LOGS[session];
        }
      }
      for (var key in USERS_CHATTING) {
        if (key === session) {
          delete USERS_CHATTING[session];
        }
      }
      io.to(session).emit("chatClosedByAdmin");
    });

    socket.on('disconnect', function() {
        delete USERS_ONLINE[socket.id];
        delete chatId;
    });

});