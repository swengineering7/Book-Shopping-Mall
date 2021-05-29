var express = require('express');
var router = express.Router();
var session = require('express-session');
//MySQL loading
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host:'localhost',
    user : 'root',
    password:'1234',
    database: 'sw_project',
    dataStrings : 'date'
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
  var order_num = req.query.order_num;

  pool.getConnection(function(err,connection){
    connection.query('SELECT orders.*,book.*,customer.* FROM orders,book,customer WHERE orders.book_num = book.book_num AND orders.cust_id = customer.cust_id', [order_num], function(err,rows){
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
  const datas = JSON.parse(req.body.params);//Json 'u' unexpected token 오류 이곳에서 발생
  console.log("datas>>>", datas);

  //이 부분에 주석 처리
  
  pool.getConnection(function(err,connection){
    //order_date = ? 로 바꾸면 같은 오류 발생(book_num만 console에 출력)
        connection.query("INSERT INTO orders SET order_num=?, cust_id='user1', order_date=NOW(), order_price = ?, book_num = ?, quantity = ?",
           [datas["order_num"], datas["book_price"], datas["book_num"], 1],
           function(err,rows){
          //INSERT INTO orders SET ?
            if(err) console.error("err : "+err);
            console.log("rowsfjdkjslkfkjsdlsdjjklfskljkljs : " + JSON.stringify(rows));

            res.redirect('/orders/cart');
            connection.release();
        });
    });
});

//장바구니 페이지
router.get('/cart', function(req,res,next) {
  var cart_num = req.query.cart_num;

  pool.getConnection(function(err,connection){
    connection.query('SELECT cart.*, customer.*,book.* FROM cart,customer,book WHERE cart.cust_id = customer.cust_id AND cart.book_num = book.book_num', [cart_num], function(err,rows){
      // '/orders/buy'에서 불러오기 성공!!! //SELECT * FROM orders
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('cart', { title: '장바구니 페이지',rows: rows});
      connection.release();
    });
  });
});

router.post('/cart', function(req,res,next){
  const datas = JSON.parse(req.body.params);//Json 'u' unexpected token 오류 이곳에서 발생
  console.log("datas>>>", datas);
  console.log("session : ", req.session.name);

  // var datas = {
  //   "cart_num" : req.body.cart_num,
  //   "cust_id" : req.body.cust_id,
  //   "book_num": req.body.book_num,
  //   "quantity": req.body.quantity
  // }

  pool.getConnection(function(err,connection){
        connection.query("INSERT INTO cart SET cart_num=?, cust_id='user1', book_num = ?, quantity = ?", 
        [datas["cart_num"], datas["book_num"] , 1],function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/orders/cart');
            connection.release();
        });
    });
});

router.post('/delete/cart', function(req,res,next){
  var cart_num = req.body.cart_num;
  //var passwd = req.body.passwd;
  //var datas = [idx, passwd];

  var sql = "DELETE FROM cart WHERE cart_num=?";

  pool.query(sql,[cart_num],function(err,result){
      console.log(result);
      if(err) console.error("장바구니 비우는 중 에러 발생 err : ",err);

      if(result.affectedRows == 0){
          res.send("<script>alert('장바구니가 비어있습니다.^^');history.back();</script>");
      }
      else{
          res.redirect('/orders/cart');
      }
      //connection.release();
  });
});

router.post('/delete/order', function(req,res,next){
  var order_num = req.body.order_num;
  //var passwd = req.body.passwd;
  //var datas = [idx, passwd];

  var sql = "DELETE FROM orders WHERE order_num=?";

  pool.query(sql,[order_num],function(err,result){
      console.log(result);
      if(err) console.error("장바구니 비우는 중 에러 발생 err : ",err);

      if(result.affectedRows == 0){
          res.send("<script>alert('장바구니가 비어있습니다.^^');history.back();</script>");
      }
      else{
          res.redirect('/orders/buy');
      }
      //connection.release();
  });
});

router.get('/orderList', function(req,res,next) {
  var order_num = req.query.order_num;

  pool.getConnection(function(err,connection){
    connection.query('SELECT orders.*,customer.*  FROM orders,customer WHERE orders.cust_id = customer.cust_id', [order_num], function(err,rows){
      // SELECT orders.*,book.*  FROM orders,book WHERE orders.book_num = book.book_num
      // '/orders/buy'에서 불러오기 성공!!! //SELECT * FROM orders
      if(err) console.error("err : "+err);
      console.log("rows : " + JSON.stringify(rows));

      res.render('orderList', { title: '구매 내역 페이지',rows: rows});
      connection.release();
    });
  });
});

// router.get('/payment',function(req,res,next){
//   res.render('payment',{title: "결제방법 선택하기"});
// });

module.exports = router;