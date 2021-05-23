var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// passport-local 설치
// const passport = require('passport');;
var app = module.exports = express();
var router = express.Router();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var join = require('./routes/joinForm');
var customerJoin = require('./routes/customerJoin');
var sellerJoin = require('./routes/sellerJoin');
var employeeJoin = require('./routes/employeeJoin');
//책 업로드 페이지
var bookDetailWrite = require('./routes/detail/write');
//책 상세 페이지 (조회 페이지)
var bookDetailRead = require('./routes/detail/read');
var bookDetailUpdate = require('./routes/detail/update');
var board = require('./routes/board');
// const passportConfig = require('./passport');

var login = require('./routes/loginForm');
//var login = require('./routes/app_session_mysql');

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
//app.use('/auth/login',login);
app.use('/book/detail/write',bookDetailWrite);
app.use('/book/detail/read',bookDetailRead);
app.use('/book/detail/update',bookDetailUpdate);
app.use('/board', board);

// app.use(passport.initialize());
// app.use(passport.session());
var options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '1234',
	database: 'sw_project_table'
};

var sessionStore = new MySQLStore(options);

app.use(session({
	key: 'session_cookie_name',
	secret: 'ABCD1234ABAB!@',
	store: sessionStore,
	resave: false,
	saveUninitialized: true
    //공식 문서에서는 false(https://www.npmjs.com/package/express-mysql-session)
}));

app.use(bodyParser.urlencoded({extended : false}));

app.get('/auth/login', (req,res) => {

    var output = `
        <h1>Login</h1>
        <tr>
        <td>분류</td>
        <td>
          <select name="division" id="division">
            <option value ="customer">구매자</option>
            <option value ="seller">판매자</option>
            <option value ="manager">관리자</option>
          </select>
        </td>
        </tr>
        <form action = "/auth/login" method = "POST">
            <p>
                <input type = "text" name = "id" placeholder = "ID">
            </p>
            <p>
                <input type = "password" name = "pwd" placeholder = "Password">
            </p>
            <p>
                <input type = "submit">
            </p>
        </form>
    `;
    
    res.send(output);
});

app.get('/welcome', (req,res) => {
  var output ="";
  if(req.session.displayName)
  {
    output += `
      <h1>Hello, ${req.session.displayName}</h1>
      <a href = "/auth/logout">LogOut</a>
    `;
    res.send(output);
  }
  else
  {
    output += `
      <h1>Welcome</h1>
      <a href = "/auth/login">LogOut</a>
    `;
    res.send(output);
  }
});

app.get('/auth/logout', (req,res) => {
  delete req.session.displayName;
  req.session.save(() => {
    res.redirect('/welcome');
  });
});

app.post('/auth/login', (req,res) => {
    var userInfo = {
      user_id : "jamong",
      user_pwd : "1234",
      displayName : "Jamong"
    };
    var uid = req.body.id;
    var upwd = req.body.pwd;

    if(uid ===userInfo.user_id && upwd ===userInfo.user_pwd)
    {
      req.session.displayName = userInfo.displayName;
      req.session.save(() => {
        res.redirect('/welcome');
      });
    }
    else{
      res.send('There is no id <a href="/auth/login">Login</a>');
    }
});

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
