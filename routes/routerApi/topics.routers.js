const topics = require("../../controllers/topics.controller.js");
var router = require("express").Router();
// Create a new topics
router.post("/", topics.create);
// Retrieve all topics
router.get("/getall", topics.findAll);
// Retrieve topics by Page
router.get("/getbypage", topics.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", topics.findOne);
// Update a Tutorial with id
router.put("/:id", topics.update);
// Delete a Tutorial with id
router.delete("/:id", topics.delete);
// Delete all topics
router.delete("/", topics.deleteAll);

module.exports = router;