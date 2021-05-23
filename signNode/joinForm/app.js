var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// passport-local 설치
// const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var join = require('./routes/joinForm');
var customerJoin = require('./routes/customerJoin');
var sellerJoin = require('./routes/sellerJoin');
var employeeJoin = require('./routes/employeeJoin');
//var login = require('./routes/login');
//책 업로드 페이지
var bookDetailWrite = require('./routes/detail/write');
//책 상세 페이지 (조회 페이지)
var bookDetailRead = require('./routes/detail/read');
var bookDetailUpdate = require('./routes/detail/update');
var board = require('./routes/board');
// const passportConfig = require('./passport');

var login = require('./routes/loginForm');

var app = express();

// passportConfig();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/join',join);
app.use('/join/customer',customerJoin);
app.use('/join/seller',sellerJoin);
app.use('/join/employee',employeeJoin);
app.use('/login',login);
app.use('/book/detail/write',bookDetailWrite);
app.use('/book/detail/read',bookDetailRead);
app.use('/book/detail/update',bookDetailUpdate);
app.use('/board', board);

// app.use(passport.initialize());
// app.use(passport.session());

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
