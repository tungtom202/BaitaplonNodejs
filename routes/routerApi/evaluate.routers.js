const evaluates = require("../../controllers/evaluate.controller.js");
var router = require("express").Router();
// Create a new evaluates
router.post("/", evaluates.create);
// Retrieve all evaluates
router.get("/getall", evaluates.findAll);
// Retrieve evaluates by Page
router.get("/getbypage", evaluates.findAllByPage);
// Retrieve a single evaluates with id
router.get("/:id", evaluates.findOne);
// Update a Tutorial with id
router.put("/:id", evaluates.update);
// Delete a Tutorial with id
router.delete("/:id", evaluates.delete);
// Delete all evaluates
router.delete("/", evaluates.deleteAll);

module.exports = router;