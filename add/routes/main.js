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
  database: 'sw_project_table',
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

/* GET main page */
router.get('/', function(req, res, next) {
  if(!req.session.name){
  res.render('main', { title: 'Main page', name:req.session.name}); //main.ejs
  }
  else{
    if(req.session.division=="customer")
    {
      res.render('welcome_cus', { title: 'Main page', name:req.session.name}); //main.ejs
    }
    else if(req.session.division=="seller"){
      res.render('welcome_sell', { title: 'Main page', name:req.session.name}); //main.ejs
    }
    else if(req.session.division=="manager"){
      res.render('welcome_emp', { title: 'Main page', name:req.session.name}); //main.ejs
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
  else res.render('welcome_cus', {title:'welcome customer', name:req.session.name});
});

/* GET welcome seller page */
router.get('/welcome_sell',function(req, res, next){
  if(!req.session.name) return res.redirect('/login');
  else res.render('welcome_sell', {title:'welcome seller', name:req.session.name});
});

/* GET welcome employee page */
router.get('/welcome_emp',function(req, res, next){
  if(!req.session.name) return res.redirect('/login');
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
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
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
        //rows.birthday = moment(rows.birthday).format('YYYY-MM-DD');
        res.render('custpage',{title: "마이페이지", row:rows[0]});
        connection.release();
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

/* Get employee my page */
router.get('/empage',function(req, res, next){
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
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
          req.session.division="employee";
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
	delete req.session;
  //delete req.session.userid;
  //delete req.session.division;
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
  });
});

/* GET home page. book TABLE 불러오기 */
router.get('/book', function(req,res,next) {
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM book',function(err,rows){
      //'SELECT * FROM customer' -> 'SELECT * FROM book' : 성공
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('list', { title: '상품 리스트!',rows: rows});
      //url창에 book을 입력하면 list.ejs로 이동
      connection.release();
    });
  });
});

/* 판매자 올린 상품을 조회할 수 있는 페이지*/

/* 판매자가 상품을 추가(write), 수정(update), 삭제(delete) */
router.get('/book/detail/write', function(req, res, next) {
  res.render('bookDetailWrite', {title: '책 상세 페이지!'});
  //웹페이지에 보이는 제목은 여기서 바뀜
  //url창에 book/detail/write를 입력하면 'bookWrite.ejs'로 이동
});

router.post('/book/detail/write', upload.single("image"), function(req,res,next){
  var datas = {
    //"book_num" : req.body.book_num,
    "book_title" : req.body.title,
    "book_genre" : req.body.genre,
    "book_price" : req.body.price,
    "book_content" : req.body.content,
    "image" : req.file.originalname,
    "author" : req.body.author,
    "publisher" : req.body.publisher
    // "book_count" : req.body.book_count,
    // "book_sellcount" : req.body.book_sellcount,
    // "book_reviewcount" : req.body.book_reviewcount,
    // "book_score" : req.body.book_score
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

      var sql ="SELECT book_num, image, book_title, book_genre, author, publisher, book_price, book_content FROM book WHERE book_num=?";

      connection.query(sql, [book_num], function(err,row){
          if(err) console.error(err);
          console.log("1개 글 조회 결과 확인 : ",row);
          
          res.render('bookDetailRead', { title: '글 조회',row:row[0]});
          connection.release();
      });
  });
});

//글 수정 화면 표시 GET
router.get('/book/detail/update', function(req,res,next) {
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
});

router.post('/book/detail/update', upload.single("image"), function(req,res,next){
  var book_num = req.body.book_num;
  var book_title = req.body.title;
  var book_genre = req.body.genre;
  var book_price = req.body.price;
  var book_content = req.body.content;
  var image = req.file.originalname;
  var author = req.body.author;
  var publisher = req.body.publisher;
  var datas = [book_title, book_genre, book_price, book_content, image, author, publisher, book_num];
  
console.log(book_num);
console.log(book_genre);
console.log(publisher);
console.log(datas);

pool.getConnection(function(err,connection){
  var sql = "UPDATE book SET book_title=?, book_genre=?, book_price = ?, book_content = ?, image = ?, author=?, publisher=? WHERE book_num = ?";
  connection.query(sql, datas, function(err,row){
      if(err) console.error("err : "+err);
      console.log("row : " + JSON.stringify(row));

      res.redirect('/book');//후보 1. 검색결과 페이지 2. 조회 페이지
      //res.redirect('/book/detail/read/' + book_num);
      connection.release();
    });
  });
});

// router.post('/book/detail', function(req, res, next) {
//   console.log('req.body: ' + JSON.stringify(req.body));
//   res.json(req.body);
// });

router.post('/book/detail/delete', function(req, res, next) {
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
});


module.exports = router;
