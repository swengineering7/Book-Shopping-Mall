var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/read', function(req, res, next) {
  res.render('bookDetailRead', {title: '책 상세 조회 페이지'});
});

router.post('/read', function(req, res, next) {
  console.log('req.body: ' + JSON.stringify(req.body));
  res.json(req.body);
});

/* GET users listing. */
router.get('/update', function(req, res, next) {
    res.render('bookDetailUpdate', {title: '책 상세 수정 페이지'});
  });
  
  router.post('/update', function(req, res, next) {
    console.log('req.body: ' + JSON.stringify(req.body));
    res.json(req.body);
  });

/* GET users listing. */
router.get('/write', function(req, res, next) {
    res.render('bookDetailWrite', {title: '책 상세 작성 페이지'});
  });
  
  router.post('/write', function(req, res, next) {
    console.log('req.body: ' + JSON.stringify(req.body));
    res.json(req.body);
  });

module.exports = router;