var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  var channel = req.query.channel || "index" 
  res.render('index', { title: 'Syscasts Chat', channel: channel })
})

module.exports = router
