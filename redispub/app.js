var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const yargs = require('yargs')
// var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
sdssssss
var socketio =require('socket.io')
var app = express();
var server = app.listen(8080)
var io =socketio(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/geo', usersRouter);

io.on('connection',(socket)=>{
  socket
  .on('room.join',(room)=>{
    console.log(socket.rooms);
    Object.keys(socket.rooms).filter((r)=>r!= socket.id)
    .forEach((r)=>socket.leave(r));
    setTimeout(()=>{
      console.log(room)
      socket.join(room);
      socket.emit('event','Joined room'+room);
      socket.broadcast.to(room).emit('event','Someone joined room'+room);
    },0);
  })
  socket.on('event',(e)=>{
    socket.broadcast.to(e.room).emit('event',e.name+'say hello!')
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
