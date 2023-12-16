const db = require("../models");
const News = db.news;
const Users = db.user;
const Evaluate = db.evaluate;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");
const { QueryTypes } = require('sequelize');
const authJwt =require("../middleware/authJwt")

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
        newsId: req.body.newsId,
        email: req.body.email
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

//create đưa ra giao diện
exports.createEvaluate = async (req, res) => {
  try {
    // Validate request
    if (!req.body.comments) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    const evaluate = {
      comments: req.body.comments,
      likes: req.body.likes,
      userId: req.body.userId,
      newsId: req.body.newsId
  };
    const namebody = await Evaluate.create(evaluate);
    return namebody;
  } catch (err) {
    throw new Error("An error occurred while creating the evaluate.");
  }
};

//đánh giá trong news
exports.createEvaluateNews = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.comments) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    const evaluate = {
      email: req.body.email,
      comments: req.body.comments,
      newsId: req.body.newsId

    };
    const namebody = await Evaluate.create(evaluate);
    return namebody;
  } catch (err) {
    next(err); // Chuyển lỗi tới middleware xử lý lỗi chung của ứng dụng
  }
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
// Retrieve all category from the database.
exports.findbyQueryEvaluate = async (req, res) => {
    const userDoc = await authJwt.userToken(req);
    const name = userDoc.User.displayname;
    const avarta = userDoc.User.avartar;

    db.sequelize.query('SELECT * FROM evaluates', {
      nest: true,
      type: QueryTypes.SELECT,
    })
      .then(data => {
        dataEvaluate = {
          results: data,
          name: name,
          avarta: avarta
        }
        res.render('manageAdmin/evaluateAdmin.ejs', { dataEvaluate });
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving ecaluate.',
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
  //get theo id
  exports.findEvaluateById = async (evaluateId) => {
    try {
      const data = await db.sequelize.query('SELECT * FROM evaluates WHERE id = :id', {
        replacements: { id: evaluateId },
        nest: true,
        type: QueryTypes.SELECT,
      });
  
      if (data.length === 0) {
        throw new Error("Không tìm thấy danh mục.");
      }
  
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      throw new Error("Đã xảy ra lỗi trong quá trình lấy thông tin danh mục.");
    }
  };
//update ra giao diện
exports.updateEvaluate = async (req, res) => {
  const id = req.params.id;
  const namebody = await Evaluate.update(req.body, {
    where: { id: id }
})
  return namebody;
};
//delete giao diện
//xóa theo id sau đó hiển thị giao diện
exports.deleteid = (req, res) => {
    const id = req.params.id;
    Evaluate.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.redirect("/manageAdmin/evaluateAdmin"); // Chuyển hướng đến trang giao diện mong muốn
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

// đếm comment
exports.countPostCommment = async () => {
  try {
    const data = await db.sequelize.query('SELECT COUNT(*) AS total_comment FROM evaluates', {
      type: QueryTypes.SELECT,
    });

    return data[0].total_comment; // Trả về giá trị số lượng bài viết từ đối tượng đầu tiên trong mảng
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving Comment.');
  }
};