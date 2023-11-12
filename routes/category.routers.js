const category = require("../controllers/category.controller.js");
var router = require("express").Router();
// Create a new Category
router.post("/", category.create);
// Retrieve all category
router.get("/getall", category.findAll);
// Retrieve category by Page
router.get("/getbypage", category.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", category.findOne);
// Update a Tutorial with id
router.put("/:id", category.update);
// Delete a Tutorial with id
router.delete("/:id", category.delete);
// Delete all category
router.delete("/", category.deleteAll);

module.exports = router;