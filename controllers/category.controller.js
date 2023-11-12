const db = require("../models");
const News = db.news;
const Category = db.category;
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
    // Create a category
    const category = {
        name: req.body.name,
        description: req.body.description,
        topicId: req.body.topicId
        
    };
    // Save category in the database
    Category.create(category)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the category."
        });
    });
};
// Retrieve all categorys from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    Category.findAll({ where: condition })
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
    Category.findAndCountAll({ 
        include: [{// Notice `include` takes an ARRAY
            model: News
          }],
        where: condition, limit, offset })
    .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving categorys."
        });
    });
}
// Find a single category with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Category.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving category with id=" + id
        });
    });
};
// Update a category by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Category.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "category was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update category with id=${id}. Maybe category was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating category with id=" + id
        });
    });
};
// Delete a category with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Category.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "category was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete category with id=${id}. Maybe category was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete category with id=" + id
        });
    });
};
// Delete all categorys from the database.
exports.deleteAll = (req, res) => {
    Category.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} categorys were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all categorys."
        });
    });
};