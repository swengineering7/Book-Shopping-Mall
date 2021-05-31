var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');

var mysql = require('mysql');
const { response } = require('express');
var pool = mysql.createPool({
  connectionLimit: 5,
  host:'localhost',
  user : 'root',
  password:'1234',
  database: 'sw_project'
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(session({
  secret:'!@#$%^&*',
  resave:false,
  saveUninitialized : true
}));

/* GET main page */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Main page', name:req.session.name}); //main.ejs

});

/* GET login page */
router.get('/login',function(req, res, next){
  res.render('login', {title:'login', name:req.session.name});
})

/* GET welcome page */
router.get('/welcome',function(req, res, next){
  if(!req.session.name) return res.redirect('/login');
  else res.render('welcome', {title:'welcome', name:req.session.name});
})

/* GET customer mypage 
router.get('/custpage',function(req, res, next){
  res.render('custpage', {title:'customer my page', name:req.session.name});
  if
})*/

/* POST login page */
router.post('/login', function(req,res,next){
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
        if(user.cust_pwd != passwd) return res.send('비밀번호가 일치하지 않습니다.');
        else 
        {
          req.session.name = user.cust_name;
          req.session.id = user.cust_id;
          console.log('session : ', JSON.stringify(req.session.name));
          req.session.save(function(){
            res.redirect('/welcome');
          })
        }

        //res.redirect('/');
        connection.release();
      });
      
    }
    /*else if(division="seller")
    {

    }
    else if(division="manager")
    {

    }*/
    
  });
});

// logout 처리
router.get('/logout', function(req,res,next){
	delete req.session.name;
	res.redirect('/');
});

module.exports = router;
