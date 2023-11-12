const news = require("../controllers/news.controller.js");
var router = require("express").Router();
const authJwt =require("../middleware/authJwt.js")
// Create a new news router.post("/", news.create);
// Retrieve all news
router.get("/getall",[authJwt.verifyToken], news.findAll);
// Create a new news
router.post("/", news.create);
// Retrieve all published news
router.get("/published", news.findAllPublished);
// Retrieve news by Page
router.get("/getbypage", news.findAllByPage);
// Retrieve a single newswith id
router.get("/:id", news.findOne);
// Update a newswith id
router.put("/:id", news.update);
// Delete a newswith id
router.delete("/:id", news.delete);
// Delete all news
router.delete("/",[authJwt.verifyToken], news.deleteAll);

module.exports = router;