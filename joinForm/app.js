var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var join = require('./routes/joinForm');

// 로그인 추가
var session = require("express-session");
var passport = require("passport");
var passportConfig = require("./passport"); // passport/index.js
/////////////////////////////////////
var app = express();
// 기본 세션설정
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "my key",
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
/////////////////////////////////////

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
app.use('/join', join);

///////////////////////////////////// 로그인 시작
app.get("/", (req, res) => {
  res.render("index");
});

passportConfig(passport);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    return req.login(user, loginError => {
      if (loginError) {
        console.error(loginError);
      }
    });
  })(req, res, next);

  res.redirect("/success");
});

app.get("/success", (req, res, next) => {
  res.render("success", {
    user: req.user
  });
});

app.get("/fail", (req, res, next) => {
  res.render("fail", {
    user: req.user
  });
});
///////////////////////////////////// 로그인 끝


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
