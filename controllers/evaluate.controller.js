const db = require("../models");
const News = db.news;
const Users = db.user;
const Evaluate = db.evaluate;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new evaluate
exports.create = (req, res) => {
    // Validate request
    if (!req.body.comments) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a evaluate
    const evaluate = {
        comments: req.body.comments,
        likes: req.body.likes,
        userId: req.body.userId,
        newsId: req.body.newsId
    };
    // Save category in the database
    Evaluate.create(evaluate)
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
// Retrieve all evaluate from the database.
exports.findAll = (req, res) => {
    const comments = req.query.comments;
    const condition = comments ? { comments: { [Op.like]: `%${comments}%` } } : null;
    
    Evaluate.findAll({
      include: [
        {
          model: News
        },
        {
          model: Users
        }
      ],
      where: condition
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving data."
        });
      });
  };
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, comments } = req.query;
    var condition = comments ? { comments: { [Op.like]: `%${comments}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    Evaluate.findAndCountAll({ 
        include: [{// Notice `include` takes an ARRAY
            model: News
          },
          {
            model: Users 
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
// Find a single Evaluate with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Evaluate.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving Evaluate with id=" + id
        });
    });
};
// Update a Evaluate by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Evaluate.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Evaluate was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update Evaluate with id=${id}. Maybe Evaluate was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Evaluate with id=" + id
        });
    });
};
// Delete a category with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Evaluate.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "Evaluate was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete Evaluate with id=${id}. Maybe Evaluate was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Evaluate with id=" + id
        });
    });
};
// Delete all categorys from the database.
exports.deleteAll = (req, res) => {
    Evaluate.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Evaluate were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all Evaluate."
        });
    });
};