var express = require('express');
var router = express.Router();
//MySQL loading
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host:'localhost',
    user : 'root',
    password:'1231',
    database: 'sw_project_table',
  });
//multer loading
var multer = require('multer');

/*Ger Users Listing*/
router.get('/',function(req,res,next){
    //그냥 board/로 접속할 경우, 전체 목록표시로 리다이렉트
    res.redirect('/board/list/1');
});

router.get('/list/:page', function(req,res,next) {
    pool.getConnection(function(err,connection){
        //use the connection
        var sqlForSelectList ="SELECT book_num, book_title, book_author, book_content FROM book";
        connection.query(sqlForSelectList,function(err,rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));
    
            res.render('list', { title: '검색결과 조회',rows: rows});
            connection.release();
        });
    });
});

module.exports = router;