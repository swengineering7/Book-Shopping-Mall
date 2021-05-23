var express = require('express');
const { createPool } = require('mysql');
var router = express.Router();

var app=express();
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
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
        else return res.send('로그인에 성공하였습니다!');
        

        res.redirect('/');
        connection.release();
      });
      
    }
    else if(division="seller")
    {

    }
    else if(division="manager")
    {

    }
    
  });
});



module.exports = router;
