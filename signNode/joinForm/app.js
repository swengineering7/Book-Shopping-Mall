var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// passport-local 설치

var session = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var join = require('./routes/joinForm');
var customerJoin = require('./routes/customerJoin');
var sellerJoin = require('./routes/sellerJoin');
var employeeJoin = require('./routes/employeeJoin');
var login = require('./routes/login');
//책 업로드 페이지
var bookDetailPage = require('./routes/detail');
//책 상세 페이지 (조회 페이지)
var bookDetail = require('./routes/bookDetail');
var board = require('./routes/board');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "node-session",
  resave:false,
  saveUninitialized:true
}))
/* option 
- secret : 필수, 세션 암호화에 사용 
- resave : 세션이 변경되지 않아도 저장이 됨, false 권장 
- saveUninitialized : 세션 초기화시 미리 만들지를 설정 
*/

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/join',join);
app.use('/join/customer',customerJoin);
app.use('/join/seller',sellerJoin);
app.use('/join/employee',employeeJoin);
app.use('/login',login);
app.use('/book/detail',bookDetailPage);
app.use('/bookDetail',bookDetail);
app.use('/board', board);

const multer = require('multer');
const fs = require('fs');

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.get('/book/detail', (req, res) => {
  res.sendFile(path.join(__dirname, 'detail.ejs'));
});
app.post('/book/detail', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send('ok');
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
