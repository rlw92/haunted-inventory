var express = require('express');
var router = express.Router();

/* GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Haunted-Inventory', about:"Take a gander at our strange and disturbing wares." });
});
*/

// GET home page.
router.get("/", function (req, res) {
  res.redirect("/catalog");
});

module.exports = router;
