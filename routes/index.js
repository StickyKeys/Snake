var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   // res.render('index', { title: 'Express' });
//   console.log("GET ATTEMPT");
//   res.send({"message": "Trying to get on the postmans??"})
// });

// router.post('/', function(req, res, next) {
//   console.log("GET ATTEMPT");
//   res.send({"message": "Trying to post on the postmans??"})
// });

// router.delete('/', function(req, res, next) {
//   console.log("GET ATTEMPT");
//   res.send({"message": "Trying to delete on the postmans??"})
// });

// router.put('/', function(req, res, next) {
//   console.log("GET ATTEMPT");
//   res.send({"message": "Trying to put on the postmans??"})
// });

router.get('/', function(req, res, next) {
  // console.log(__dirname);
  // console.log(path.resolve('../views', 'snake.html'));
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
});


router.get('/snake', function(req, res, next) {
  // console.log(__dirname);
  // console.log(path.resolve('../views', 'snake.html'));
  res.sendFile(path.resolve(__dirname, '../views', 'snake.html'));
});

module.exports = router;
