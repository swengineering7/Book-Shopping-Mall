var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');


// set mail //
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service : 'gmail',
  auth: {
    user:'testest10222@gmail.com',
    pass:'test1234!' //password
  }
});

var mailOption;

var mysql = require('mysql');
const { response } = require('express');
var pool = mysql.createPool({
  connectionLimit: 5,
  host:'localhost',
  user : 'root',
  password:'1234',
  database: 'sw_project',
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(session({
  secret:'!@#$%^&*',
  resave:false,
  saveUninitialized : true,
}));

//multer loading
var multer = require('multer');
var fs = require('fs');
const { route } = require('./users');
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
});

/* genre page */
/* GET liter page */
router.get('/genre_liter',function(req, res, next){
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM book',function(err,rows){
      //'SELECT * FROM customer' -> 'SELECT * FROM book' : 성공
      if(err) console.error("err : "+err);
      //console.log("rows : " + JSON.stringify(rows));
      console.log("book length : "+rows.length);
      res.render('genre_liter', { title: '상품 리스트!',rows: rows});
      //url창에 book을 입력하면 list.ejs로 이동
      connection.release();
    });
  });
});
/* GET liter page */
router.get('/genre_art',function(req, res, next){
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM book',function(err,rows){
      //'SELECT * FROM customer' -> 'SELECT * FROM book' : 성공
      if(err) console.error("err : "+err);
      //console.log("rows : " + JSON.stringify(rows));
      console.log("book length : "+rows.length);
      res.render('genre_art', { title: '상품 리스트!',rows: rows});
      //url창에 book을 입력하면 list.ejs로 이동
      connection.release();
    });
  });
});
/* GET liter page */
router.get('/genre_sci',function(req, res, next){
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM book',function(err,rows){
      //'SELECT * FROM customer' -> 'SELECT * FROM book' : 성공
      if(err) console.error("err : "+err);
      //console.log("rows : " + JSON.stringify(rows));
      console.log("book length : "+rows.length);
      res.render('genre_sci', { title: '상품 리스트!',rows: rows});
      //url창에 book을 입력하면 list.ejs로 이동
      connection.release();
    });
  });
});
/* GET liter page */
router.get('/genre_soc',function(req, res, next){
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM book',function(err,rows){
      //'SELECT * FROM customer' -> 'SELECT * FROM book' : 성공
      if(err) console.error("err : "+err);
      //console.log("rows : " + JSON.stringify(rows));
      console.log("book length : "+rows.length);
      res.render('genre_soc', { title: '상품 리스트!',rows: rows});
      //url창에 book을 입력하면 list.ejs로 이동
      connection.release();
    });
  });
});

/* GET main page */
router.get('/', function(req, res, next) {
  if(!req.session.name){
    var book_num = req.params.book_num;

    pool.getConnection(function(err,connection){
        //use the connection
  
        var sql ="SELECT b.book_num, b.book_title, b.image, SUM(quantity) FROM orders AS O inner join book AS B on b.book_num = o.book_num GROUP BY book_num ORDER BY SUM(quantity) DESC";
  
        connection.query(sql, [book_num], function(err,row){
            if(err) console.error(err);
            console.log("베스트셀러 결과 확인 : ",row);
            
            res.render('main', { title: 'Main page',row:row});
            //일단은 bestseller가 아닌 main으로 render
            connection.release();
        });
    });
  //res.render('main', { title: 'Main page', name:req.session.name}); //main.ejs
  }
  else{
    if(req.session.division=="customer")
    {
      var book_num = req.params.book_num;

      pool.getConnection(function(err,connection){
        //use the connection
  
        var sql ="SELECT b.book_num, b.book_title, b.image, SUM(quantity) FROM orders AS O inner join book AS B on b.book_num = o.book_num GROUP BY book_num ORDER BY SUM(quantity) DESC";
  
        connection.query(sql, [book_num], function(err,row){
            if(err) console.error(err);
            console.log("베스트셀러 결과 확인 : ",row);
            
            res.render('welcome_cus', { title: 'Main page',row:row, name:req.session.name});
            //일단은 bestseller가 아닌 main으로 render
            connection.release();
        });
      });
    }
    else if(req.session.division=="seller"){
      var book_num = req.params.book_num;

      pool.getConnection(function(err,connection){
        //use the connection
  
        var sql ="SELECT b.book_num, b.book_title, b.image, SUM(quantity) FROM orders AS O inner join book AS B on b.book_num = o.book_num GROUP BY book_num ORDER BY SUM(quantity) DESC";
  
        connection.query(sql, [book_num], function(err,row){
            if(err) console.error(err);
            console.log("베스트셀러 결과 확인 : ",row);
            
            res.render('welcome_sell', { title: 'Main page',row:row, name:req.session.name});
            //일단은 bestseller가 아닌 main으로 render
            connection.release();
        });
      });
    }
    else if(req.session.division=="manager"){
      var book_num = req.params.book_num;

      pool.getConnection(function(err,connection){
        //use the connection
  
        var sql ="SELECT b.book_num, b.book_title, b.image, SUM(quantity) FROM orders AS O inner join book AS B on b.book_num = o.book_num GROUP BY book_num ORDER BY SUM(quantity) DESC";
  
        connection.query(sql, [book_num], function(err,row){
            if(err) console.error(err);
            console.log("베스트셀러 결과 확인 : ",row);
            
            res.render('welcome_emp', { title: 'Main page',row:row, name:req.session.name});
            //일단은 bestseller가 아닌 main으로 render
            connection.release();
        });
      });
    }
  }

});

/* GET login page */
router.get('/login',function(req, res, next){
  res.render('login', {title:'login', name:req.session.name});
});

/* GET welcome custoemr page */
router.get('/welcome_cus',function(req, res, next){
  if(!req.session.name) return res.redirect('/login');
  else if(!req.session.division!="customer") return res.redirect('/');
  else res.render('welcome_cus', {title:'welcome customer', name:req.session.name});
});

/* GET welcome seller page */
router.get('/welcome_sell',function(req, res, next){
  if(!req.session.name) return res.redirect('/login');
  else if(!req.session.division!="seller") return res.redirect('/');
  else res.render('welcome_sell', {title:'welcome seller', name:req.session.name});
});

/* GET welcome employee page */
router.get('/welcome_emp',function(req, res, next){
  if(!req.session.name) return res.redirect('/login');
  else if(!req.session.division!="manager") return res.redirect('/');
  else res.render('welcome_emp', {title:'welcome employee', name:req.session.name});
});

/* GET findid page */
router.get('/findid',function(req, res, next){
  res.render('findid', {title:'findid'});
});

/* GET findpwd page */
router.get('/findpwd',function(req, res, next){
  res.render('findpwd', {title:'findpwd'});
});

/* GET customer page */
router.get('/custpage',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/";</script>');
  }
  else if(req.session.division!="customer")
  {
    res.send('<script type="text/javascript">alert("구매자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var id=req.session.userid;
    //"SELECT orders.*,book.* FROM orders,book WHERE cust_id=? AND orders.book_num = book.book_num"
    pool.getConnection(function(err,connection){
      var sql = 'SELECT * FROM customer WHERE cust_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error(err);
        console.log("rows : ", JSON.stringify(rows));
        res.render('custpage',{title: "마이페이지",  row:rows[0]});
        connection.release();
      })
    })
  }
});

/* GET 구매자 정보 수정 */
router.get('/custupdate',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="customer")
  {
    res.send('<script type="text/javascript">alert("구매자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var id=req.session.userid;
    pool.getConnection(function(err,connection){
      var sql = 'SELECT * FROM customer WHERE cust_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error(err);
        console.log("rows : ", JSON.stringify(rows));
        res.render('custupdate',{title: "구매자 마이페이지 수정", row:rows[0]});
        connection.release();
      })
    })
  }
});

/* POST 구매자 정보 수정 */
router.post('/custupdate',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="customer")
  {
    res.send('<script type="text/javascript">alert("구매자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var userid=req.session.userid;
    var new_passwd=req.body.new_passwd;
    var cust_pwd = req.body.cust_pwd;
    var zipcode=req.body.zipcode;
    var address=req.body.address;
    var cust_phone_num=req.body.cust_phone_num;
 
    pool.getConnection(function(err,connection){
      if(new_passwd='')
      {
        var datas=[zipcode, address, cust_phone_num, userid, cust_pwd];
        var sql="UPDATE customer SET zipcode=?, address=?, cust_phone_num=? WHERE cust_id=? AND cust_pwd=?";
      }
      else
      {
        var datas=[new_passwd, zipcode, address, cust_phone_num, userid, cust_pwd];
        var sql="UPDATE customer SET cust_pwd=?, zipcode=?, address=?, cust_phone_num=? WHERE cust_id=? AND cust_pwd=?";
      }

      connection.query(sql, datas, function(err,result){
        console.log(result);
        if(err) console.error("정보 수정 중 오류 발생 err : ", err);
        if(result.affectedRows==0){
          res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 변경되지 않았습니다.');history.back();</script>");
        }
        else{
          res.send('<script>alert("정보가 수정되었습니다.");location.href="/custpage";</script>');
        }
      })
    })
  }
});

/* Get seller mypage */
router.get('/sellpage',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="seller")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var id=req.session.userid;
    pool.getConnection(function(err,connection){
      var sql = 'SELECT * FROM seller WHERE sell_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error(err);
        console.log("rows : ", JSON.stringify(rows));
        //rows.birthday = moment(rows.birthday).format('YYYY-MM-DD');
        res.render('sellpage',{title: "마이페이지", row:rows[0]});
        connection.release();
      })
    })
  }
});

/* GET 판매자 정보 수정 */
router.get('/sellupdate',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="seller")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var id=req.session.userid;
    pool.getConnection(function(err,connection){
      var sql = 'SELECT * FROM seller WHERE sell_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error(err);
        console.log("rows : ", JSON.stringify(rows));
        res.render('sellupdate',{title: "판매자 마이페이지 수정", row:rows[0]});
        connection.release();
      })
    })
  }
});

/* POST 판매자 정보 수정 */
router.post('/sellupdate',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="seller")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var userid=req.session.userid;
    var new_passwd=req.body.new_passwd;
    var sell_pwd = req.body.sell_pwd;
    var sell_phone_num=req.body.sell_phone_num;
    pool.getConnection(function(err,connection){
      if(new_passwd==''){
        var datas=[sell_phone_num, userid, sell_pwd];
        var sql="UPDATE seller SET sell_phone_num=? WHERE sell_id=? AND sell_pwd=?";
      }else{
        var datas=[new_passwd, sell_phone_num, userid, sell_pwd];
        var sql="UPDATE seller SET sell_pwd=?, sell_phone_num=? WHERE sell_id=? AND sell_pwd=?";
      }
      connection.query(sql, datas, function(err,result){
        console.log(result);
        if(err) console.error("정보 수정 중 오류 발생 err : ", err);
        if(result.affectedRows==0){
          res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 변경되지 않았습니다.');history.back();</script>");
        }
        else{
          res.send('<script>alert("정보가 수정되었습니다.");location.href="/sellpage";</script>');
        }
      })
    })
  }
});

/* Get employee my page */
router.get('/empage',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="manager")
  {
    res.send('<script type="text/javascript">alert("관리자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var id=req.session.userid;
    pool.getConnection(function(err,connection){
      var sql = 'SELECT * FROM employee WHERE emp_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error(err);
        console.log("rows : ", JSON.stringify(rows));
        //rows.birthday = moment(rows.birthday).format('YYYY-MM-DD');
        res.render('empage',{title: "마이페이지", row:rows[0]});
        connection.release();
      })
    })
  }
});

/* GET 관리자 정보 수정 */
router.get('/empupdate',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="manager")
  {
    res.send('<script type="text/javascript">alert("관리자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var id=req.session.userid;
    pool.getConnection(function(err,connection){
      var sql = 'SELECT * FROM employee WHERE emp_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error(err);
        console.log("rows : ", JSON.stringify(rows));
        res.render('empupdate',{title: "관리자 마이페이지 수정", row:rows[0]});
        connection.release();
      })
    })
  }
});

/* POST 관리자 정보 수정 */
router.post('/empupdate',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="manager")
  {
    res.send('<script type="text/javascript">alert("관리자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var userid=req.session.userid;
    var new_passwd=req.body.new_passwd;
    var emp_pwd = req.body.emp_pwd;
    var emp_phone_num=req.body.emp_phone_num;
    
    pool.getConnection(function(err,connection){
      if(new_passwd==''){
        var datas=[emp_phone_num, userid, emp_pwd];
        var sql="UPDATE employee SET emp_phone_num=? WHERE emp_id=? AND emp_pwd=?";
      }else{
        var datas=[new_passwd, emp_phone_num, userid, emp_pwd];
        var sql="UPDATE employee SET emp_pwd=?, emp_phone_num=? WHERE emp_id=? AND emp_pwd=?";
      }
      connection.query(sql, datas, function(err,result){
        console.log(result);
        if(err) console.error("정보 수정 중 오류 발생 err : ", err);
        if(result.affectedRows==0){
          res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 변경되지 않았습니다.');history.back();</script>");
        }
        else{
          res.send('<script>alert("정보가 수정되었습니다.");location.href="/empage";</script>');
        }
      })
    })
  }
});

/* 관리자 페이지에서 구매자 목록 관리 */
router.get('/empage/managecus',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="manager")
  {
    res.send('<script type="text/javascript">alert("관리자만 접근이 가능합니다!");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var id=req.session.userid;
    pool.getConnection(function(err,connection){
      var sql = 'SELECT * FROM customer';
      connection.query(sql, id, function(err,rows){
        if(err) console.error(err);
        console.log("rows : ", JSON.stringify(rows));
        res.render('managecus',{title: "구매자 관리페이지", rows});
        connection.release();
      })
    })
  }
});

/* 관리자 페이지에서 판매자 목록 관리 */
router.get('/empage/managesell',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="manager")
  {
    res.send('<script type="text/javascript">alert("관리자만 접근이 가능합니다!");location.href="/";</script>');
  }
  else
  {
    console.log("id : ", JSON.stringify(req.session.userid));
    var id=req.session.userid;
    pool.getConnection(function(err,connection){
      var sql = 'SELECT * FROM seller';
      connection.query(sql, id, function(err,rows){
        if(err) console.error(err);
        console.log("rows : ", JSON.stringify(rows));
        res.render('managesell',{title: "판매자 관리페이지", rows});
        connection.release();
      })
    })
  }
});

/* POST login page */
router.post('/login', function(req,res,next){
  var division = req.body.division;
  var id=req.body.id;
  var passwd=req.body.passwd;
  pool.getConnection(function(err, connection){
    if(division=="customer")
    {
      var sql = 'SELECT * FROM customer WHERE cust_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        var user = rows[0];
        if(!user){
          res.send('<script type="text/javascript">alert("가입되지 않은 아이디입니다.");location.href="/login";</script>');
        }
        else if(user.cust_pwd != passwd)
        {
          res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다.");location.href="/login";</script>');
        }
        else 
        {
          req.session.name = user.cust_name;
          req.session.userid = user.cust_id;
          req.session.division = "customer";
          console.log('name : ', JSON.stringify(req.session.name));
          console.log('id : ', req.session.userid);
          console.log('division : ', JSON.stringify(req.session.division));
          req.session.save(function(){
            res.redirect('/welcome_cus');
          })
        }
        connection.release();
      });
    }
    else if(division=="seller")
    {
      var sql = 'SELECT * FROM seller WHERE sell_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        var user = rows[0];
        if(!user){
          res.send('<script type="text/javascript">alert("가입되지 않은 아이디입니다.");location.href="/login";</script>');
        }
        else if(user.sell_pwd != passwd)
        {
          res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다.");location.href="/login";</script>');
        }
        else 
        {
          req.session.name = user.sell_name;
          req.session.userid = user.sell_id;
          req.session.division="seller";
          console.log('session name: ', JSON.stringify(req.session.name));
          req.session.save(function(){
            res.redirect('/welcome_sell');
          })
        }
        connection.release();
      });
    }
    else if(division=="manager")
    {
      var sql = 'SELECT * FROM employee WHERE emp_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        var user = rows[0];
        if(!user){
          res.send('<script type="text/javascript">alert("가입되지 않은 아이디입니다.");location.href="/login";</script>');
        }
        else if(user.emp_pwd != passwd)
        {
          res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다.");location.href="/login";</script>');
        }
        else 
        {
          req.session.name = user.emp_name;
          req.session.userid = user.emp_id;
          req.session.division="manager";
          console.log('session : ', JSON.stringify(req.session.name));
          req.session.save(function(){
          res.redirect('/welcome_emp');
          })
        }
        connection.release();
      });
    }
  });
});

// logout 처리
router.get('/logout', function(req,res,next){
	req.session.destroy(function(){ 
    req.session;
    });
	res.redirect('/');
});

/* POST findid page */
router.post('/findid', function(req,res,next){
  var division = req.body.division;
  var email=req.body.email;
  var name=req.body.name;
  var datas=[name, email];
  pool.getConnection(function(err, connection){
    if(division=="customer")
    {console.log('customer!');
      var sql = "SELECT cust_id FROM customer WHERE cust_name=? AND cust_email=?";
      connection.query(sql, datas, function(err,rows){
        if(err) console.error("err : "+err);
        if(rows[0]==null)
        {
            res.send('<script type="text/javascript">alert("가입되지 않은 아이디 혹은 이메일입니다!");location.href="/findid";</script>');
          connection.release();
        }
        else
        {
          console.log("rows : " + JSON.stringify(rows));
          var user = rows[0];
          console.log("cust_id : ", JSON.stringify(user.cust_id));
          var text = '<script type="text/javascript">alert("가입하신 아이디는 '+user.cust_id+'입니다.");location.href="/login";</script>';
          res.send(text);
          connection.release();
        }
      });
    }
    else if(division=="seller")
    {console.log('seller!');
      var sql = "SELECT sell_id FROM seller WHERE sell_name=? AND sell_email=?";
      connection.query(sql, datas, function(err,rows){
        if(err) console.error("err : "+err);
        if(rows[0]==null)
        {
            res.send('<script type="text/javascript">alert("가입되지 않은 아이디 혹은 이메일입니다!");location.href="/findid";</script>');
          connection.release();
        }
        else
        {
          console.log("rows : " + JSON.stringify(rows));
          var user = rows[0];
          console.log("cust_id : ", JSON.stringify(user.sell_id));
          var text = '<script type="text/javascript">alert("가입하신 아이디는 '+user.sell_id+'입니다.");location.href="/login";</script>';
          res.send(text);
          connection.release();
        }
      });
    }
    else if(division=="manager")
    {console.log('manager!');
      var sql = "SELECT emp_id FROM employee WHERE emp_name=? AND emp_email=?";
      connection.query(sql, datas, function(err,rows){
        if(err) console.error("err : "+err);
        if(rows[0]==null)
        {
            res.send('<script type="text/javascript">alert("관리자 가입되지 않은 아이디 혹은 이메일입니다!");location.href="/findid";</script>');
          connection.release();
        }
        else
        {
          console.log("rows : " + JSON.stringify(rows));
          var user = rows[0];
          console.log("cust_id : ", JSON.stringify(user.emp_id));
          var text = '<script type="text/javascript">alert("가입하신 아이디는 '+user.emp_id+'입니다.");location.href="/login";</script>';
          res.send(text);
          connection.release();
        }
      });
    }
  });
});

/* POST findpwd page */
router.post('/findpwd', function(req,res,next){
  var division = req.body.division;
  var id = req.body.id;
  var email=req.body.email;
  var name=req.body.name;
  var datas=[id, name, email];
  console.log("mail data : ", datas);
  pool.getConnection(function(err, connection){
    if(division=="customer")
    {console.log('customer!');
      var sql = "SELECT * FROM customer WHERE cust_id=?";
      connection.query(sql, datas, function(err,rows){
        if(err) console.error("err : "+err);
        if(rows[0]==null)
        {
            res.send('<script type="text/javascript">alert("회원정보가 존재하지 않습니다!");location.href="/findpwd";</script>');
            connection.release();
        }
        else
        {
          console.log("rows : " + JSON.stringify(rows));
          const randomString = Math.random().toString(36).slice(2);
          var user = rows[0];
          if(email != user.cust_email || name != user.cust_name) //아이디와 이메일 혹은 이름이 일치하지 않는 경우
          {
            res.send('<script type="text/javascript">alert("아이디와 회원정보가 일치하지 않습니다!");location.href="/findpwd";</script>');
            connection.release();
          }
          else //회원정보 모두 일치
          {
            datas=[randomString, id];
            sql="UPDATE customer SET cust_pwd = ? WHERE cust_id=?";
            connection.query(sql,datas, function(err,rows){
              if(err) console.error("err : "+ err);
              else console.log("success to change temporary password");
            })
            mailOption = {
              from:'testest10222@gmail.com',
              to: user.cust_email,
              subject: '임시 비밀번호입니다',
              text: '임시 비밀번호는 '+randomString+' 입니다.'
            };
            transporter.sendMail(mailOption, function(err,res){
              if(err) console.log(err);
              else console.log('이메일 발송 성공');
              transporter.close();
            });
            res.send('<script type="text/javascript">alert("가입하신 이메일로 임시 비밀번호를 전송하였습니다.반드시 변경하시길 바랍니다.");location.href="/login";</script>');
            connection.release();
          }
          
        }
      });
    }
    else if(division=="seller")
    {console.log('seller!');
      var sql = "SELECT * FROM seller WHERE sell_id=?";
      connection.query(sql, datas, function(err,rows){
      if(err) console.error("err : "+err);
      if(rows[0]==null)
      {
          res.send('<script type="text/javascript">alert("회원정보가 존재하지 않습니다!");location.href="/findpwd";</script>');
          connection.release();
      }
      else
      {
        console.log("rows : " + JSON.stringify(rows));
        const randomString = Math.random().toString(36).slice(2);
        var user = rows[0];
        if(email != user.sell_email || name != user.sell_name) //아이디와 이메일 혹은 이름이 일치하지 않는 경우
        {
          res.send('<script type="text/javascript">alert("아이디와 회원정보가 일치하지 않습니다!");location.href="/findpwd";</script>');
          connection.release();
        }
        else //회원정보 모두 일치
        {
          datas=[randomString, id];
          sql="UPDATE seller SET sell_pwd = ? WHERE sell_id=?";
          connection.query(sql,datas, function(err,rows){
            if(err) console.error("err : "+ err);
            else console.log("success to change temporary password");
          })
          mailOption = {
            from:'testest10222@gmail.com',
            to: user.sell_email,
            subject: '임시 비밀번호입니다',
            text: '임시 비밀번호는 '+randomString+' 입니다.'
          };
          transporter.sendMail(mailOption, function(err,res){
            if(err) console.log(err);
            else console.log('이메일 발송 성공');
            transporter.close();
          });
          res.send('<script type="text/javascript">alert("가입하신 이메일로 임시 비밀번호를 전송하였습니다.반드시 변경하시길 바랍니다.");location.href="/login";</script>');
          connection.release();
        }
      }
    });
    }
    else if(division=="manager")
    {console.log('manager!');
    var sql = "SELECT * FROM employee WHERE emp_id=?";
    connection.query(sql, datas, function(err,rows){
      if(err) console.error("err : "+err);
      if(rows[0]==null)
      {
          res.send('<script type="text/javascript">alert("회원정보가 존재하지 않습니다!");location.href="/findpwd";</script>');
          connection.release();
      }
      else
      {
        console.log("rows : " + JSON.stringify(rows));
        const randomString = Math.random().toString(36).slice(2);
        var user = rows[0];
        if(email != user.emp_email || name != user.emp_name) //아이디와 이메일 혹은 이름이 일치하지 않는 경우
        {
          res.send('<script type="text/javascript">alert("아이디와 회원정보가 일치하지 않습니다!");location.href="/findpwd";</script>');
          connection.release();
        }
        else //회원정보 모두 일치
        {
          datas=[randomString, id];
          sql="UPDATE employee SET emp_pwd = ? WHERE emp_id=?";
          connection.query(sql,datas, function(err,rows){
            if(err) console.error("err : "+ err);
            else console.log("success to change temporary password");
          })
          mailOption = {
            from:'testest10222@gmail.com',
            to: user.emp_email,
            subject: '임시 비밀번호입니다',
            text: '임시 비밀번호는 '+randomString+' 입니다.'
          };
          transporter.sendMail(mailOption, function(err,res){
            if(err) console.log(err);
            else console.log('이메일 발송 성공');
            transporter.close();
          });
          res.send('<script type="text/javascript">alert("가입하신 이메일로 임시 비밀번호를 전송하였습니다.반드시 변경하시길 바랍니다.");location.href="/login";</script>');
          connection.release();
        }
      }
    });
    }
  });
});

/* GET home page. book TABLE 불러오기 */
router.get('/book', function(req,res,next) {
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM book',function(err,rows){
      //'SELECT * FROM customer' -> 'SELECT * FROM book' : 성공
      if(err) console.error("err : "+err);
      //console.log("rows : " + JSON.stringify(rows));
      console.log("book length : "+rows.length);
      res.render('list', { title: '상품 리스트!',rows: rows});
      //url창에 book을 입력하면 list.ejs로 이동
      connection.release();
    });
  });
});

/* 판매자 올린 상품을 조회할 수 있는 페이지*/

/* 판매자가 상품을 추가(write), 수정(update), 삭제(delete) */
router.get('/book/detail/write', function(req, res, next) {
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="seller")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");location.href="/book";</script>');
  }
  else
  {
  res.render('bookDetailWrite', {title: '책 상세 페이지!'});
  //웹페이지에 보이는 제목은 여기서 바뀜
  //url창에 book/detail/write를 입력하면 'bookWrite.ejs'로 이동
  }
});

router.post('/book/detail/write', upload.single("image"), function(req,res,next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="seller")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");location.href="/book";</script>');
  }
  else
  {
    console.log("sell_id : ", req.session.userid);
      var datas = {
        //"book_num" : req.body.book_num,
        "book_title" : req.body.title,
        "book_genre" : req.body.genre,
        "book_price" : req.body.price,
        "book_content" : req.body.content,
        "image" : req.file.originalname,
        "author" : req.body.author,
        "publisher" : req.body.publisher,
        // "book_count" : req.body.book_count,
        // "book_sellcount" : req.body.book_sellcount,
        // "book_reviewcount" : req.body.book_reviewcount,
        // "book_score" : req.body.book_score
        "sell_id" : req.session.userid
    }
 
}

console.log(datas.book_num);//undefined가 정상
console.log(datas.book_title);
  
pool.getConnection(function(err,connection){
      connection.query('INSERT INTO book SET ?', datas,function(err,rows){
          if(err) console.error("err : "+err);
          console.log("rows : " + JSON.stringify(rows));

          res.redirect('/book');//1. 검색결과 페이지 2. 조회 페이지
          connection.release();
      });
  });
});

//글 조회 로직 처리 GET
router.get('/book/detail/read/:book_num', function(req,res,next) {
  var book_num = req.params.book_num;
  
  pool.getConnection(function(err,connection){
      //use the connection

      var sql ="select review.*, book.* from review, book where review.book_num=? and book.book_num=?;";

      connection.query(sql, [book_num, book_num], function(err,rows){
          if(err) console.error(err);
          console.log("1개 글 조회 결과 확인 : ",rows);
          //console.log("1개 글 책 번호 확인 : ",rows[0].book_num);
          
          res.render('bookDetailRead', { title: '글 조회',rows: rows});
          connection.release();
      });
  });
});

//글 수정 화면 표시 GET
router.get('/book/detail/update', function(req,res,next) {
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="seller")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");history.back();</script>');
  }
  else
  {
  var book_num = req.query.book_num;
  
  pool.getConnection(function(err,connection){
      if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

      var sql ="SELECT book_num, image, book_title, book_genre, author, publisher, book_price, book_content FROM book WHERE book_num=?";
      
      connection.query(sql, [book_num], function(err,rows){
          if(err) console.error(err);
          console.log("update에서 1개 글 조회 결과 확인 : ",rows);
          res.render('bookDetailUpdate', {title: "글 수정",row:rows[0]});
          connection.release();
      });
  });
}
});

router.post('/book/detail/update', upload.single("image"), function(req,res,next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="seller")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");history.back();</script>');
  }
  else
  {
    if(req.file!=null){
      var book_num = req.body.book_num;
      var book_title = req.body.title;
      var book_genre = req.body.genre;
      var book_price = req.body.price;
      var book_content = req.body.content;
      var image = req.file.originalname;
      var author = req.body.author;
      var publisher = req.body.publisher;
      var datas = [book_title, book_genre, book_price, book_content, image, author, publisher, book_num];
      var sql = "UPDATE book SET book_title=?, book_genre=?, book_price = ?, book_content = ?, image = ?, author=?, publisher=? WHERE book_num = ?";
    }
    else{
      var book_num = req.body.book_num;
      var book_title = req.body.title;
      var book_genre = req.body.genre;
      var book_price = req.body.price;
      var book_content = req.body.content;
      var author = req.body.author;
      var publisher = req.body.publisher;
      var datas = [book_title, book_genre, book_price, book_content, author, publisher, book_num];
      var sql = "UPDATE book SET book_title=?, book_genre=?, book_price = ?, book_content = ?, author=?, publisher=? WHERE book_num = ?";
    }

  
console.log(book_num);
console.log(book_genre);
console.log(publisher);
console.log(datas);

pool.getConnection(function(err,connection){

  connection.query(sql, datas, function(err,row){
      if(err) console.error("err : "+err);
      console.log("row : " + JSON.stringify(row));

      res.redirect('/book');//후보 1. 검색결과 페이지 2. 조회 페이지
      //res.redirect('/book/detail/read/' + book_num);
      connection.release();
    });
  });
}
});

// router.post('/book/detail', function(req, res, next) {
//   console.log('req.body: ' + JSON.stringify(req.body));
//   res.json(req.body);
// });

router.post('/book/detail/delete', function(req, res, next) {
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="seller")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");history.back();</script>');
  }
  else
  {
  var book_num = req.body.book_num;
  var path = req.body.image;

  console.log(book_num, path);

  pool.getConnection(function(err, connection) {
      var sql = "DELETE FROM book WHERE book_num=?";
      connection.query(sql, [book_num], function(err, row) {
          if (err) console.error("글 삭제 중 에러 발생 err : ", err);

          console.log("row : " + JSON.stringify(row));

          fs.unlink("public/images/"+path, function(){
              res.redirect('/book');
          });
          connection.release();
      });    
  });
}
});

/* 구매자 정보 삭제 */
router.post('/delete/customer', function(req,res,next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="manager")
  {
    res.send('<script type="text/javascript">alert("관리자가 아닙니다.");location.href="/book";</script>');
  }
  else
  {
  var id = req.body.delete_id;
  console.log("delete id : ",id);
  var sql = "DELETE FROM customer WHERE cust_id=?";

  pool.query(sql,[id],function(err,result){
      console.log(result);
      if(err) console.error("err : ",err);
      res.redirect('/empage/managecus')
      //connection.release();
  });
}
});

/* 판매자 정보 삭제 */
router.post('/delete/seller', function(req,res,next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="manager")
  {
    res.send('<script type="text/javascript">alert("관리자가 아닙니다.");location.href="/book";</script>');
  }
  else
  {
  var id = req.body.delete_id;
  console.log("delete id : ",id);
  var sql = "DELETE FROM seller WHERE sell_id=?";

  pool.query(sql,[id],function(err,result){
      console.log(result);
      if(err) console.error("err : ",err);
      res.redirect('/empage/managesell')
      //connection.release();
  });
}
});


// 리뷰작성 화면 표시 GET
router.get('/book/detail/review', function(req,res,next) {
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="customer")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");location.href="/book";</script>');
  }
  else
  {
  var book_num = req.query.book_num;
  
  pool.getConnection(function(err,connection){
      var sql = "SELECT book_num, image, book_title, book_genre, author, publisher, book_price, book_content FROM book WHERE book_num=?";
      connection.query(sql, [book_num], function(err,row){
          if(err) console.error(err);
          console.log("책 조회 : ",row);
  
          res.render('bookDetailReview', { title: '리뷰 작성',row:row[0]});
          connection.release();
      });
  });
}
});



// 리뷰작성 로직 처리 POST
router.post('/book/detail/review', function(req,res,next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="customer")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");location.href="/book";</script>');
  }
  else
  {

  //var review_num = req.body.review_num; // primary key
  var book_num = req.body.book_num; // foreign key
  var cust_id = req.session.userid; // foreign key

  var review_star;
  if(req.body.review_star==1) review_star=1;
  else if(req.body.review_star==2) review_star=2;
  else if(req.body.review_star==3) review_star=3;
  else if(req.body.review_star==4) review_star=4;
  else if(req.body.review_star==5) review_star=5;
  var review_content = req.body.review_content;

  var datas = [book_num, cust_id, review_star, review_content];
  console.log('datas : ',datas);

pool.getConnection(function(err,connection){
  var sqlForReview = "INSERT INTO review(book_num, cust_id, review_star, review_content, review_date) VALUES(?,?,?,?,Now())";
  connection.query(sqlForReview, datas,function(err,rows){
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.redirect('/book');
      connection.release();
  });
});
  }
});



/*GET Customer addPoint */
router.get('/addPoint', function(req, res, next) {
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="customer")
  {
    res.send('<script type="text/javascript">alert("구매자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    pool.getConnection(function(err,connection){
      connection.query('SELECT * FROM customer where cust_id=?',req.session.userid,function(err,rows){
        //'SELECT * FROM customer' -> 'SELECT * FROM book' : 성공
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows[0].cust_point));
        res.render('addPoint', { title: '포인트 충전 폼',rows: rows[0]});
        connection.release();
      });
    });
  }
});

/* POST Custoemr addPoint */
router.post('/addPoint', function(req,res,next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="customer")
  {
    res.send('<script type="text/javascript">alert("구매자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
  var id = req.session.userid;
  var add_point=req.body.add_point*1;
  var cust_point=req.body.cust_point*1;
  var total=add_point+cust_point;
  var datas=[total, id];
  var sql = "update customer set cust_point=? where cust_id=?;";

  pool.query(sql,datas,function(err,result){
      console.log(result);
      if(err) console.error("err : ",err);
      //res.send('<script type="text/javascript">alert("포인트 충전 성공");window.close();</script>');
      res.send('<script type="text/javascript">alert("포인트 충전 성공");location.href="/custpage"</script>');
      //connection.release();
  });
}
});

/*GET Customer addPoint */
router.get('/sellbookList', function(req, res, next) {
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else if(req.session.division!="seller")
  {
    res.send('<script type="text/javascript">alert("판매자가 아닙니다.");location.href="/";</script>');
  }
  else
  {
    pool.getConnection(function(err,connection){
      connection.query('select * from book where sell_id=?;',req.session.userid,function(err,rows){
        if(err) console.error("err : "+err);
        res.render('sellbookList', { title: '판매자 업로드 상품 목록 조회 폼',rows: rows});
        connection.release();
      });
    });
  }
});


module.exports = router;
