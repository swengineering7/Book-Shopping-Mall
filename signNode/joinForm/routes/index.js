var express = require('express');
var router = express.Router();
//MySQL loading
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host : 'localhost',
  user: 'root',
  password: '1234',
  database: 'sw_project_table'
});
var path = require('path');

/* GET home page. customer TABLE 불러오기 */
router.get('/', function(req,res,next) {
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM customer',function(err,rows){
      //'SELECT * FROM board' -> 'SELECT * FROM customer' : 성공
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('index', { title: 'test',rows: rows});
      connection.release();
    });
  });
});

/*router.get('/', function(req,res){
  res.sendFile(path.join(__dirname, '/customerJoin'))
})*/

/*POST 구매자 회원가입*/
router.post('/join/customer', function(req,res,next){
  var datas = {
    "cust_id" : req.body.id,
    "cust_pwd" : req.body.passwd,
    "cust_name" : req.body.name,
    "cust_email" : req.body.email,
    /*"zipcode" : req.body.zipcode,

    "address" : req.body.address,*/ 
    "cust_phone_num" : req.body.tel,
    /*"cust_secession" : req.body.cust_secession,
    "cust_point" : req.body.cust_point,*/
    "birthday" : req.body.birth,
  
    "gender" : req.body.gender
  }

  console.log(datas.cust_id);
  
  pool.getConnection(function(err,connection){
        connection.query('INSERT INTO customer SET ?', datas,function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/join/customer');
            connection.release();
        });
    });
});

/*POST 판매자 회원가입*/
router.post('/join/seller', function(req,res,next){
  var datas = {
    "sell_id" : req.body.id,
    "sell_pwd" : req.body.passwd,
    "sell_name" : req.body.name,
    "sell_email" : req.body.email,

    "sell_phone_num" : req.body.tel,
    /*"sell_secession" : req.body.sell_secession*/
  }

  console.log(datas.sell_id);
  
  pool.getConnection(function(err,connection){
        connection.query('INSERT INTO seller SET ?', datas,function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/join/seller');
            connection.release();
        });
    });
});

/*POST 관리자 회원가입*/
router.post('/join/employee', function(req,res,next){
  var datas = {
    "emp_id" : req.body.id,
    "emp_pwd" : req.body.passwd,
    "emp_name" : req.body.name,
    "emp_email" : req.body.email,

    "emp_phone_num" : req.body.tel,
    /*"emp_secession" : req.body.emp_secession*/
  }

  console.log(datas.emp_id);
  
  pool.getConnection(function(err,connection){
        connection.query('INSERT INTO employee SET ?', datas,function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/join/employee');
            connection.release();
        });
    });
});

/* GET home page. book TABLE 불러오기 */
router.get('/book', function(req,res,next) {
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM book',function(err,rows){
      //'SELECT * FROM customer' -> 'SELECT * FROM book' : 성공
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('index', { title: 'test',rows: rows});
      connection.release();
    });
  });
});

router.post('/book/detail', function(req,res,next){
  var datas = {
    // "book_num" : req.body.book_num,
    "book_title" : req.body.title,
    "book_genre" : req.body.genre,
    "book_price" : req.body.price,
    "book_content" : req.body.content,
    // "image" : req.body.image,
    "author" : req.body.author,
    "publisher" : req.body.publisher
    // "book_count" : req.body.book_count,
    // "book_sellcount" : req.body.book_sellcount,
    // "book_reviewcount" : req.body.book_reviewcount,
    // "book_score" : req.body.book_score
}

console.log(datas.book_title);
  
pool.getConnection(function(err,connection){
      connection.query('INSERT INTO book SET ?', datas,function(err,rows){
          if(err) console.error("err : "+err);
          console.log("rows : " + JSON.stringify(rows));

          res.redirect('/book/detail');
          connection.release();
      });
  });
});

/* GET users listing. */
router.get('/book/detail', function(req, res, next) {
  res.render('detail', {title: '책 상세 페이지!'});
});

router.post('/book/detail', function(req, res, next) {
  console.log('req.body: ' + JSON.stringify(req.body));
  res.json(req.body);
});

module.exports = router;
