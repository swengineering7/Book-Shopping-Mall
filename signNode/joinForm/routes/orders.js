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

/* GET home page. orders TABLE 불러오기 */
router.get('/', function(req,res,next) {
  pool.getConnection(function(err,connection){
    connection.query('SELECT * FROM orders',function(err,rows){
      // '/orders'에서 불러오기 성공!!!
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('index', { title: 'test',rows: rows});
      connection.release();
    });
  });
});

//구매 페이지
router.get('/buy', function(req,res,next) {
  pool.getConnection(function(err,connection){
    connection.query('SELECT orders.*,book.*  FROM orders,book WHERE orders.book_num = book.book_num',function(err,rows){
      // SELECT orders.*,book.*  FROM orders,book WHERE orders.book_num = book.book_num
      // '/orders/buy'에서 불러오기 성공!!! //SELECT * FROM orders
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('buyorders', { title: '상품 구매 페이지',rows: rows});
      connection.release();
    });
  });
});

router.post('/buy', function(req,res,next){
  var datas = {
    "order_num" : req.body.order_num,
    "cust_id" : req.body.cust_id,
    "order_date" : req.body.order_date,
    "order_price" : req.body.order_price,

    "book_num": req.body.book_num,
    "quantity": req.body.quantity
    /* book_num, qunatity? */
  }

  console.log(datas.order_num);
  console.log(datas.cust_id);
  console.log(datas.order_date);
  console.log(datas.order_price);
  console.log(datas.book_num);
  console.log(datas.quantity);

  pool.getConnection(function(err,connection){
        connection.query('INSERT INTO orders SET ?', datas,function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/book');
            connection.release();
        });
    });
});

//장바구니 페이지
router.get('/cart', function(req,res,next) {
  pool.getConnection(function(err,connection){
    connection.query('SELECT orders.*,book.*  FROM orders,book WHERE orders.book_num = book.book_num',function(err,rows){
      // '/orders/buy'에서 불러오기 성공!!! //SELECT * FROM orders
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('cart', { title: '장바구니 페이지',rows: rows});
      connection.release();
    });
  });
});

router.post('/cart', function(req,res,next){
  var datas = {
    "order_num" : req.body.order_num,
    "cust_id" : req.body.cust_id,
    "order_date" : req.body.order_date,
    "order_price" : req.body.order_price,

    "book_num": req.body.book_num,
    "quantity": req.body.quantity
    /* book_num, qunatity? */
  }

  console.log(datas.order_num);
  console.log(datas.cust_id);
  console.log(datas.order_date);
  console.log(datas.order_price);
  console.log(datas.book_num);
  console.log(datas.quantity);

  pool.getConnection(function(err,connection){
        connection.query('INSERT INTO orders SET ?', datas,function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/orders/cart');
            connection.release();
        });
    });
});

module.exports = router;