var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var passport=require('passport');
var session = require('express-session');


//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var join = require('./routes/joinForm');
var main = require('./routes/main');
//책 업로드 페이지
//var bookDetailWrite = require('./routes/detail/write');
//책 상세 페이지 (조회 페이지)
//var bookDetailRead = require('./routes/detail/read');
//var bookDetailUpdate = require('./routes/detail/update');
var bookDetail = require('./routes/detail');
//구매 페이지
var order = require('./routes/orders');
var board = require('./routes/board');

//var login = require('./routes/loginForm');
//var mypage = require('./routes/mypage');

var app = express();

var moment = require('moment');//cmd에 'npm install --save moment'로 설치
app.locals.moment = require('moment');

/*app.use(session({
  secret:'!@#$%^&*',
  resave:false,
  saveUninitialized : true,
  store: new FileStore()
}));*/

app.use(cookieParser('session-secret-key'));
app.use(session({
  secret: '!@#$%^&*',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', main);
app.use('/users', usersRouter);
app.use('/join',join);

//app.use('/index', indexRouter);
app.use('/book/detail', bookDetail);
app.use('/orders', order);
app.use('/board', board);

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
