const db = require("../models");
const Category = db.category;
const Topics = db.topics;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new category
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a topics
    const topics = {
        name: req.body.name,
    };
    // Save category in the database
    Topics.create(topics)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the topics."
        });
    });
};
// Retrieve all columns from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Topics.findAll({ where: condition })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving Columns."
        });
    });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, name } = req.query;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Topics.findAndCountAll({ 
        // include: [{// Notice `include` takes an ARRAY
        //     model: Category
        //   }],
        where: condition, limit, offset })
    .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Topics."
        });
    });
}
// Find a single category with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Topics.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Topics with id=" + id
        });
    });
};
// Update a category by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Topics.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Topics was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Topics with id=${id}. Maybe Topics was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Topics with id=" + id
        });
    });
};
// Delete a category with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Topics.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Topics was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Topics with id=${id}. Maybe Topics was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Topics with id=" + id
        });
    });
};
// Delete all categorys from the database.
exports.deleteAll = (req, res) => {
    Topics.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Topics were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all Columns."
        });
    });
};