var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('bookDetailReview', {title: '리뷰작성'});
});

module.exports = router;
