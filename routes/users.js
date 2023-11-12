var express = require('express');
var router = express.Router();
const controller= require('../controllers/user.controller');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/api/getall', controller.findbyQuery);
router.put("/api/user/:id", controller.update);
router.post("/api/user", controller.create);
router.delete("/api/user/:id", controller.delete); 
module.exports = router;