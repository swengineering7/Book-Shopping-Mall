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
  password:'1231',
  database: 'sw_project_table'
});

var bool_idcheck=false;
var idchk;

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.render('joinForm', {title: 'Join Form!'});
});*/

/* GET users listing. */
router.get('/customer', function(req, res, next) {
  res.render('join_customer', {title: 'Customer Join Form!'});
});

/* GET users listing. */
router.get('/seller', function(req, res, next) {
  res.render('join_seller', {title: 'Seller Join Form!'});
});

/* GET users listing. */
router.get('/employee', function(req, res, next) {
  res.render('join_employee', {title: 'Manager Join Form!'});
});

/* GET users listing. */
router.get('/employee', function(req, res, next) {
  res.render('join_employee', {title: 'Manager Join Form!'});
});

/*GET Customer idCheckForm. */
router.get('/idCheckCus', function(req, res, next) {
  res.render('idCheckCus', {title: 'customer id check Form!'});
});

/*POST Customer idCheckForm. */
router.post('/idCheckCus', function(req,res,next){
  var id=req.body.id;
  console.log("id : ", id);
  pool.getConnection(function(err,connection){
    var sql="select cust_name from customer where cust_id = ?";
    connection.query(sql, id, function(err,rows){
      console.log(JSON.stringify(rows[0]));
      if(rows[0]!=undefined) //이미 있는 아이디
      {
        bool_idcheck=false;
        res.send('<script type="text/javascript">alert("이미 가입된 아이디입니다");location.href="/join/idCheckCus";</script>');
      }
      else //사용 가능한 아이디
      {
        bool_idcheck=true;
        idchk=id;
        res.send('<script type="text/javascript">alert("사용 가능한 아이디입니다");window.close();</script>');
      }
    });
  });
});

/*GET Seller idCheckForm. */
router.get('/idCheckSell', function(req, res, next) {
  res.render('idCheckSell', {title: 'seller id check Form!'});
});

/*POST Seller idCheckForm. */
router.post('/idCheckSell', function(req,res,next){
  var id=req.body.id;
  console.log("id : ", id);
  pool.getConnection(function(err,connection){
    var sql="select sell_name from seller where sell_id = ?";
    connection.query(sql, id, function(err,rows){
      console.log(JSON.stringify(rows[0]));
      if(rows[0]!=undefined) //이미 있는 아이디
      {
        bool_idcheck=false;
        res.send('<script type="text/javascript">alert("이미 가입된 아이디입니다");location.href="/join/idCheckSell";</script>');
      }
      else //사용 가능한 아이디
      {
        bool_idcheck=true;
        idchk=id;
        res.send('<script type="text/javascript">alert("사용 가능한 아이디입니다");window.close();</script>');
      }
    });
  });
});

/*GET Manager idCheckForm. */
router.get('/idCheckEmp', function(req, res, next) {
  res.render('idCheckEmp', {title: 'Manager id check Form!'});
});

/*POST Manager idCheckForm. */
router.post('/idCheckEmp', function(req,res,next){
  var id=req.body.id;
  console.log("id : ", id);
  pool.getConnection(function(err,connection){
    var sql="select emp_name from employee where emp_id = ?";
    connection.query(sql, id, function(err,rows){
      console.log(JSON.stringify(rows[0]));
      if(rows[0]!=undefined) //이미 있는 아이디
      {
        bool_idcheck=false;
        res.send('<script type="text/javascript">alert("이미 가입된 아이디입니다");location.href="/join/idCheckEmp";</script>');
      }
      else //사용 가능한 아이디
      {
        bool_idcheck=true;
        idchk=id;
        res.send('<script type="text/javascript">alert("사용 가능한 아이디입니다");window.close();</script>');
      }
    });
  });
});

router.post('/customer', function(req,res,next){
  var cust_id = req.body.cust_id;
  if(bool_idcheck==false){
    res.send('<script type="text/javascript">alert("아이디 중복검사는 필수입니다!"); history.back();</script>');
  }
  else if(idchk != cust_id)
  {
    bool_idcheck=false;
    res.send('<script type="text/javascript">alert("아이디 중복검사는 필수입니다!"); history.back();</script>');
  }
  else{
  var cust_pwd = req.body.cust_pwd;
  var cust_name = req.body.cust_name;
  var cust_email=req.body.cust_email;
  var zipcode=req.body.zipcode;
  var address=req.body.address;
  var cust_phone_num=req.body.cust_phone_num;
  var cust_secession=0;
  var cust_point=100000;
  var birthday=req.body.birthday;
  var gender;
  if(req.body.gender=="남") gender=1;
  else gender=2;
  var datas=[cust_id, cust_pwd, cust_name, cust_email, zipcode, address, cust_phone_num, cust_secession
  ,cust_point,birthday, gender];
  console.log('datas : ',datas);
  pool.getConnection(function(err, connection){
    var sqlForInsertCustomer = "insert into customer(cust_id, cust_pwd, cust_name, cust_email, zipcode, address, cust_phone_num, cust_secession, cust_point, birthday, gender) values(?,?,?,?,?,?,?,?,?,?,?)";
    connection.query(sqlForInsertCustomer, datas, function(err,rows){
      if(err)
      {
        res.redirect('/join/customer');
        connection.release();
      }
      else{
        console.log("rows : " + JSON.stringify(rows));
        res.redirect('/');
        connection.release();
      }

    });
  });
}
});

router.post('/seller', function(req,res,next){
  var sell_id = req.body.sell_id;
  if(bool_idcheck==false){
    res.send('<script type="text/javascript">alert("아이디 중복검사는 필수입니다!"); history.back();</script>');
  }
  else if(idchk != sell_id)
  {
    bool_idcheck=false;
    res.send('<script type="text/javascript">alert("아이디 중복검사는 필수입니다!"); history.back();</script>');
  }
  else{
  var sell_pwd = req.body.sell_pwd;
  var sell_name = req.body.sell_name;
  var sell_email = req.body.sell_email;
  var sell_phone_num = req.body.sell_phone_num;
  var sell_secession = 0;

  var datas=[sell_id, sell_pwd, sell_name, sell_email, sell_phone_num, sell_secession];
  console.log('datas : ',datas);
  pool.getConnection(function(err, connection){
    var sqlForInsertCustomer = "insert into seller(sell_id, sell_pwd, sell_name, sell_email, sell_phone_num, sell_secession) values(?,?,?,?,?,?)";
    connection.query(sqlForInsertCustomer, datas, function(err,rows){
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));
      res.redirect('/');
      connection.release();
    });
  });
}
});

router.post('/employee', function(req,res,next){
  var emp_id = req.body.emp_id;
  if(bool_idcheck==false){
    res.send('<script type="text/javascript">alert("아이디 중복검사는 필수입니다!"); history.back();</script>');
  }
  else if(idchk != emp_id)
  {
    bool_idcheck=false;
    res.send('<script type="text/javascript">alert("아이디 중복검사는 필수입니다!"); history.back();</script>');
  }
  else{
  var emp_pwd = req.body.emp_pwd;
  var emp_name = req.body.emp_name;
  var emp_email = req.body.emp_email;
  var emp_phone_num = req.body.emp_phone_num;
  var datas=[emp_id, emp_pwd, emp_name, emp_email, emp_phone_num];
  console.log('datas : ',datas);
  pool.getConnection(function(err, connection){
    var sqlForInsertCustomer = "insert into employee(emp_id, emp_pwd, emp_name, emp_email, emp_phone_num) values(?,?,?,?,?)";
    connection.query(sqlForInsertCustomer, datas, function(err,rows){
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));
      res.redirect('/');
      connection.release();
    });
  });
}
});

module.exports = router;