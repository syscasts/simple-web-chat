var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Syscasts Chat', channel: req.query.channel.replace(/'/g, "\\'") })
})

module.exports = router
