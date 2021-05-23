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

//multer loading
var multer = require('multer');
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

      res.render('list', { title: 'test',rows: rows});
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
    "book_num" : req.body.book_num,
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

console.log(datas.book_num);
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
  var datas = {
    "book_num" : req.body.book_num,
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

console.log(datas.book_num);
console.log(datas.book_genre);

pool.getConnection(function(err,connection){
  var sql = "UPDATE book SET book_title=?, book_genre=?, book_price=?, book_content=?, image=?, author=?, publisher=? WHERE book_num=?";
  connection.query(sql, datas,function(err,row){
      if(err) console.error("err : "+err);
      console.log("row : " + JSON.stringify(row));

      res.redirect('/book');//1. 검색결과 페이지 2. 조회 페이지
      //res.redirect('/book/detail/read/' + book_num);
      connection.release();
    });
  });
});

// router.post('/book/detail', function(req, res, next) {
//   console.log('req.body: ' + JSON.stringify(req.body));
//   res.json(req.body);
// });

module.exports = router;
