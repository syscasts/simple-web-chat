var debug = require('debug')('scchat')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
// var favicon = require('serve-favicon')
var express = require('express')
var logger = require('morgan')
var path = require('path')
var redis = require('redis')

var routes = require('./routes/index')

var app = express()

debug('App starting')

var server = require('http').Server(app)
var io = require('socket.io')(server)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
  res.io = io
  next()
})

app.use('/', routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

function websocketHandler (socket) {
  debug('socketio connection just started')
  var sub = redis.createClient()
  var pub = redis.createClient()
  var currentChannel

  function joinChannel (channel) {
    currentChannel = channel
    sub.subscribe(channel)
    socket.emit('joinpart', 'Welcome to ' + channel)
  }

  sub.on('subscribe', function (channel, count) {
    var message = 'Someone joined channel: ' + channel
    debug(message)
    pub.publish(channel, JSON.stringify({type: 'joinpart', content: message}, null, 2))
  })

  sub.on('message', function (channel, rawMessage) {
    debug('got message on channel ' + channel + ': ' + rawMessage)
    var message = JSON.parse(rawMessage)
    socket.emit(message.type, message.content)
  })

  function chatMessage (message) {
    debug('Chat message received: ' + message)
    pub.publish(currentChannel, JSON.stringify({type: 's2c', content: message}, null, 2))
  }

  function disconnect () {
    debug('socketio connection terminated')
    if (currentChannel) {
      pub.publish(currentChannel, JSON.stringify({type: 'joinpart', content: 'User left'}, null, 2))
    }
    sub.unsubscribe()
    sub.quit()
    pub.quit()
  }

  socket.on('disconnect', disconnect)
  socket.on('join', joinChannel)

  socket.on('c2s', chatMessage)
}

io.set('transports', [ 'websocket' ])
io.sockets.on('connection', websocketHandler)

module.exports = {app: app, server: server}
