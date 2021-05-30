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
    database: 'sw_project_table',
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
    if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }else{
  var order_num = req.query.order_num;

  pool.getConnection(function(err,connection){
    var sql="SELECT orders.*,book.* FROM orders,book WHERE cust_id=? AND orders.book_num = book.book_num ORDER BY order_num ASC";
    connection.query(sql,req.session.userid, function(err,rows){
      // SELECT orders.*,book.*  FROM orders,book WHERE orders.book_num = book.book_num
      // '/orders/buy'에서 불러오기 성공!!! //SELECT * FROM orders
      if(err) console.error("err : "+err);
      //console.log("rows : " + JSON.stringify(rows));

      res.render('buyorders', { title: '상품 구매 페이지',rows: rows});
      connection.release();
    });
  });
}
});

router.post('/buy', function(req,res,next){
    if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }else{
  const datas = JSON.parse(req.body.params);//Json 'u' unexpected token 오류 이곳에서 발생
  console.log("datas>>>", datas);

  //이 부분에 주석 처리
  var sql="insert into orders(order_num, cust_id, order_date, order_price, book_num, quantity) values(?,?,NOW(),?,?,?);"
  //var sql="INSERT INTO orders SET order_num=?, cust_id='?', order_date=NOW(), order_price = ?, book_num = ?, quantity = ?";s
  pool.getConnection(function(err,connection){
    //order_date = ? 로 바꾸면 같은 오류 발생(book_num만 console에 출력)
        connection.query(sql,[datas["order_num"], req.session.userid, datas["book_price"], datas["book_num"], 1],
           function(err,rows){
          //INSERT INTO orders SET ?
            if(err) console.error("err : "+err);
            //console.log("rowsfjdkjslkfkjsdlsdjjklfskljkljs : " + JSON.stringify(rows));

            res.redirect('/orders/cart');
            connection.release();
        });
    });
}
});

//수량 수정 화면 표시 GET
router.get('/quantity/update', function(req,res,next) {
  var order_num = req.query.order_num;
  
  pool.getConnection(function(err,connection){
      if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

      var sql ="SELECT order_num, cust_id, order_date, order_price, book_num, quantity FROM orders WHERE order_num=?";
      
      connection.query(sql, [order_num], function(err,rows){
          if(err) console.error(err);
          //console.log("update에서 1개 글 조회 결과 확인 : ",rows);
          res.render('buyorders', { title: '상품 구매 페이지',rows: rows});
          connection.release();
      });
  });
});

//수량 수정 로직 처리 POST
router.post('/quantity/update', function(req,res,next){
  var order_num = req.body.order_num;
  var cust_id = req.body.cust_id;
  var order_date = req.body.order_date;
  var order_price = req.body.order_price;
  var book_num = req.body.book_num;
  var quantity = req.body.quantity;
  var datas = [req.session.userid,order_price,book_num,quantity,order_num];

  var order_price = req.body.order_price * req.body_quantity;
  var total_price;//total 변수

  pool.getConnection(function(err,connection){
      //INSERT INTO board(creator_id, title, content, passwd, image) values(?,?,?,?,?)
      //"INSERT INTO orders(cust_id,order_date,order_price,book_num,quantity,order_num) VALUES(?,NOW(),?,?,?,?) ON DUPLICATE KEY UPDATE order_price = quantity * order_price"
      var sql = "UPDATE orders SET cust_id = ?, order_date=NOW(), order_price=?, book_num=?, quantity=? WHERE order_num=?";
      //INSERT INTO SAMPLE_TABLE VALUES ('',5,1,2) ON DUPLICATE KEY UPDATE value1 = value1 + 1;
      //UPDATE orders SET cust_id = ?, order_date=?, order_price=?, book_num=?, quantity=? WHERE order_num=?
      connection.query(sql,datas,function(err,row){
          if(err) console.error("글 수정 중 에러 발생 err : ", err);
          console.log("row : " + JSON.stringify(row));
          res.redirect('/orders/buy');
          connection.release();
      });
  });
});

router.post('/price/update', function(req,res,next){
  var order_num = req.body.order_num;
  var cust_id = req.body.cust_id;
  var order_date = req.body.order_date;
  var order_price = req.body.order_price;
  var book_num = req.body.book_num;
  var quantity = req.body.quantity;
  var datas = [req.session.userid,order_price,book_num,quantity,order_num];

  pool.getConnection(function(err,connection){
      //INSERT INTO board(creator_id, title, content, passwd, image) values(?,?,?,?,?)
      //"INSERT INTO orders(cust_id,order_date,order_price,book_num,quantity,order_num) VALUES(?,NOW(),?,?,?,?) ON DUPLICATE KEY UPDATE order_price = quantity * order_price"
      var sql = "UPDATE orders SET cust_id = ?, order_date=NOW(), order_price=?, book_num=?, quantity=? WHERE order_num=?";
      //INSERT INTO SAMPLE_TABLE VALUES ('',5,1,2) ON DUPLICATE KEY UPDATE value1 = value1 + 1;
      //UPDATE orders SET cust_id = ?, order_date=?, order_price=?, book_num=?, quantity=? WHERE order_num=?
      connection.query(sql,datas,function(err,row){
          if(err) console.error("글 수정 중 에러 발생 err : ", err);
          console.log("row : " + JSON.stringify(row));
          res.redirect('/orders/buy');
          connection.release();
      });
  });
});

//장바구니 페이지
router.get('/cart', function(req,res,next) {
  if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }else{
  var cart_num = req.query.cart_num;

  pool.getConnection(function(err,connection){
      var sql="SELECT cart.*,book.* FROM cart,book WHERE cart.cust_id = ? AND cart.book_num = book.book_num ORDER BY cart_num ASC";
    //connection.query('SELECT cart.*, customer.*,book.* FROM cart,book WHERE cart.cust_id = customer.cust_id AND cart.book_num = book.book_num', [cart_num], function(err,rows){
    connection.query(sql, req.session.userid, function(err,rows){
      // '/orders/buy'에서 불러오기 성공!!! //SELECT * FROM orders
      if(err) console.error("err : "+err);
      //console.log("rows : " + JSON.stringify(rows));

      res.render('cart', { title: '장바구니 페이지',rows: rows});
      connection.release();
    });
  });
}
});

router.post('/cart', function(req,res,next){
    if(!req.session.userid)
  {
    res.send('<script type="text/javascript">alert("로그인이 필요합니다.");location.href="/login";</script>');
  }
  else{
  const datas = JSON.parse(req.body.params);//Json 'u' unexpected token 오류 이곳에서 발생
  console.log("datas>>>", datas);
  console.log("cart session id : ", req.session.userid);
  var userid=req.session.userid;
  //var datas=[cart_num, userid, book_num, 1];
  pool.getConnection(function(err,connection){
      var sql="insert into cart(cart_num, cust_id, book_num, quantity) values(?,?,?,?);"
        /*connection.query("INSERT INTO cart SET cart_num=?, cust_id='?', book_num = ?, quantity = ?", 
        [datas["cart_num"], datas[id], datas["book_num"] , 1],function(err,rows){
            if(err) console.error("err : "+err);
            //console.log("rows : " + JSON.stringify(rows));

            res.redirect('/orders/cart');
            connection.release();
        });*/
        connection.query(sql, [datas["cart_num"], userid, datas["book_num"] , 1], function(err,rows){
            if(err) console.error("err : "+err);
            //console.log("rows : " + JSON.stringify(rows));

            res.redirect('/orders/cart');
            connection.release();
        });
    });
}
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
      //console.log("rows : " + JSON.stringify(rows));

      res.render('orderList', { title: '구매 내역 페이지',rows: rows});
      connection.release();
    });
  });
});

// router.get('/payment',function(req,res,next){
//   res.render('payment',{title: "결제방법 선택하기"});
// });

module.exports = router;