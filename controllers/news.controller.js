const db = require("../models");
const News = db.news;
const Category = db.category;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");

// Create and Save a new news
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a news
    const news = {
        title: req.body.title,
        published: req.body.published ? req.body.published : false,
        img: req.body.img,
        content: req.body.content,
        genre: req.body.genre,
        newviews: req.body.newviews,
        poststatus: req.body.poststatus,
        categoryId: req.body.categoryId
    };
    // Save news in the database
    News.create(news)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the News."
        });
    });
};
// Retrieve all newss from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    News.findAll(
        {
            include: [{// Notice `include` takes an ARRAY
              model: Category
            }]
          }
    )
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving tutorials."
        });
    });
};
// Retrieve by Paging
exports.findAllByPage = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    News.findAndCountAll({ 
        include: [{// Notice `include` takes an ARRAY
            model: Category
          }],
        where: condition, limit, offset })
    .then(data => {
        const response = getPagingData(data, page, limit);
        res.send(response);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving tutorials."
        });
    });
}
// Find a single news with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    News.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving News with id=" + id
        });
    });
};
// Update a news by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    News.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "News was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update News with id=${id}. Maybe News was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating News with id=" + id
        });
    });
};
// Delete a news with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    News.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "News was deleted successfully!"
            });
        } else {
            res.send({
            message: `Cannot delete News with id=${id}. Maybe News was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete news with id=" + id
        });
    });
};
// Delete all News from the database.
exports.deleteAll = (req, res) => {
    News.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} News were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all News."
        });
    });
};
// Find all published newss
exports.findAllPublished = (req, res) => {
    News.findAll({ where: { published: true } })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving News."
        });
    });
};