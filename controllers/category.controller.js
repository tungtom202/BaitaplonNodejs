const db = require("../models");
const News = db.news;
const Category = db.category;
const Topic = db.topics;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");
const { QueryTypes } = require('sequelize');
const authJwt =require("../middleware/authJwt")


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

//create đưa ra giao diện
exports.createCategory = async (req, res) => {
  try {
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
    const namebody = await Category.create(category);
    return namebody;
  } catch (err) {
    throw new Error("An error occurred while creating the category.");
  }
};
  //
  //get theo id
  exports.findCategoryById = async (categoryId) => {
    try {
      const data = await db.sequelize.query('SELECT * FROM categories WHERE id = :id', {
        replacements: { id: categoryId },
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

  //key ngoại của news
  exports.findbyQueryForeignCategory = async () => {
    try {
      const categoryall = await db.sequelize.query('SELECT * FROM categories', {
        nest: true,
        type: QueryTypes.SELECT,
      });
  
      console.log(categoryall);
      return categoryall;
    } catch (err) {
      console.error(err);
      throw new Error("Đã xảy ra lỗi trong quá trình lấy thông tin category.");
    }
  };

//update ra giao diện
exports.updateCategory = async (req, res) => {
    const id = req.params.id;
    const namebody = await Category.update(req.body, {
      where: { id: id }
  })
    return namebody;
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
// Retrieve all category from the database.
exports.findbyQueryCategory = async (req, res) => {
    const userDoc = await authJwt.userToken(req);
    const name = userDoc.User.displayname;
    const avarta = userDoc.User.avartar;

    db.sequelize.query('SELECT * FROM categories', {
      nest: true,
      type: QueryTypes.SELECT,
    })
      .then(data => {
        const dataCategory = {
          results: data,
          name: name,
          avarta: avarta

      }
        res.render('manageAdmin/categoryAdmin.ejs', { dataCategory });
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving Catergory.',
        });
      });
  };
//delete giao diện
//xóa theo id sau đó hiển thị giao diện
exports.deleteid = (req, res) => {
    const id = req.params.id;
    Category.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.redirect("/manageAdmin/categoryAdmin"); // Chuyển hướng đến trang giao diện mong muốn
        } else {
          res.send({
            message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Category with id=" + id
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