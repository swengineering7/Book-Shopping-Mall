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
  database: 'sw_project_table'
});

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

/*GET users listing. */
router.get('/idCheckForm', function(req, res, next) {
  res.render('idCheckForm', {title: 'customer id check Form!'});
});

router.post('/idCheckPro', function(req,res,next){
  var id=req.body.id;
  console.log("id : ", id);
  pool.getConnection(function(err,connection){
    var sql="select cust_name from customer where cust_id = ?";
    connection.query(sql, id, function(err,rows){
      console.log(JSON.stringify(rows[0]));
      if(rows[0]!=undefined) //이미 있는 아이디
      {

        res.send('<script type="text/javascript">alert("이미 가입된 아이디입니다");location.href="/join/idCheckForm";</script>');
      }
      else //사용 가능한 아이디
      {
        res.send('<script type="text/javascript">alert("사용 가능한 아이디입니다");window.close();</script>');
      }
    });
  });
});

router.get('/idCheckPro', function(req,res,next){
  res.render('idCheckPro', {title: 'id check'});
});

router.post('/customer', function(req,res,next){
  var cust_id = req.body.cust_id;
  var cust_pwd = req.body.cust_pwd;
  var cust_name = req.body.cust_name;
  var cust_email=req.body.cust_email;
  var zipcode=req.body.zipcode;
  var address=req.body.address;
  var cust_phone_num=req.body.cust_phone_num;
  var cust_secession=0;
  var cust_point=50000;
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
        var duplicate = "ER_DUP_ENTRY";
        var truncated = "ER_TRUNCATED_WRONG_VALUE";
        console.error("err : " + err);
        if(!JSON.stringify(err).indexOf(duplicate))
        {
          console.log("duplicate key!!!!!!");
        }
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
});

router.post('/seller', function(req,res,next){
  var sell_id = req.body.sell_id;
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
});

router.post('/employee', function(req,res,next){
  var emp_id = req.body.emp_id;
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
});

module.exports = router;
