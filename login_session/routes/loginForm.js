var express = require('express');
const { createPool } = require('mysql');
var router = express.Router();

var app=express();
var bodyParser=require('body-parser');
var session = require('express-session');
//var MySQLStore = require('express-mysql-session')(session);
//var dbConfig = require('./dbConfig');
////var dbOptions = dbConfig;
//var conn = mysql.createConnection(dbOptions);
//conn.connect();
var cookieParser = require('cookie-parser');

app.use(cookieParser());


app.set('view engine', 'ejs');
app.set('views', './views');
app.use(session({
  secret:'!@#$%^&*',
  resave:false,
  saveUninitialized: true
}));

//app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host:'localhost',
  user : 'root',
  password:'1234',
  database: 'sw_project'
});




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('loginForm', {title: 'Login Form!'});
  if(!req.session.name)
    res.render('loginForm', {title: 'Login Form!'});
  else
    res.redirect('/welcome');
});

router.get('/welcome', function(req,res){
  if(!req.session.name)
    return res.redirect('/login');
  else 
    res.render('welcome', {name:req.session.name});
})

router.get('/logout', function(req,res){
  req.session.destroy(function(err){
    res.redirect('/');
  });
});

router.post('/', function(req,res,next){
  var division = req.body.division;
  var id=req.body.id;
  var passwd=req.body.passwd;
  
  pool.getConnection(function(err, connection){
    if(division="customer")
    {
      var sql = 'SELECT * FROM customer WHERE cust_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        var user = rows[0];
        console.log("passwd : ", JSON.stringify(user.cust_pwd));
        if(!user) return res.send('가입되지 않은 아이디입니다.');
        if(user.cust_pwd!=passwd) return res.send('비밀번호가 일치하지 않습니다.');
        else 
        {
          res.session.name=user.cust_name;
          res.session.save(function(){
            return res.redirect('/welcome');
          })
          //return res.send('로그인에 성공하였습니다!');
        }

        

        res.redirect('/');
        connection.release();
      });
      
    }
    else if(division="seller")
    {
      var sql = 'SELECT * FROM seller WHERE sell_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        var user = rows[0];
        console.log("passwd : ", JSON.stringify(user.sell_pwd));
        if(!user) return res.send('가입되지 않은 아이디입니다.');
        if(user.sell_pwd!=passwd) return res.send('비밀번호가 일치하지 않습니다.');
        else 
        {
          res.session.name=user.sell_name;
          res.session.save(function(){
            return res.redirect('/welcome');
          })
          //return res.send('로그인에 성공하였습니다!');
        }

        

        res.redirect('/');
        connection.release();
      });
    }
    else if(division="manager")
    {
      var sql = 'SELECT * FROM employee WHERE emp_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        var user = rows[0];
        console.log("passwd : ", JSON.stringify(user.emp_pwd));
        if(!user) return res.send('가입되지 않은 아이디입니다.');
        if(user.emp_pwd!=passwd) return res.send('비밀번호가 일치하지 않습니다.');
        else 
        {
          res.session.name=user.emp_name;
          res.session.save(function(){
            return res.redirect('/welcome');
          })
          //return res.send('로그인에 성공하였습니다!');
        }

        

        res.redirect('/');
        connection.release();
      });
    }
    
  });
});



module.exports = router;
