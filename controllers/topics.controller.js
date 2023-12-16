const db = require("../models");
const Category = db.category;
const Topics = db.topics;
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');
const { getPagination, getPagingData } = require("./utils");
const { name } = require("ejs");
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

//create đưa ra giao diện
exports.createTopic = async (req, res) => {
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a topics
    const topics = {
      name: req.body.name
    };
    //console.log(topics);
    // Save topics in the database
    // Topics.create(topics)
    //   .then(data => {
    //     res.render("manageAdmin/topicAdmin.ejs", { topics: data }); // Hiển thị trang giao diện "topics" và truyền dữ liệu bản ghi mới tạo
    //   })
    //   .catch(err => {
    //     res.status(500).send({
    //       message: err.message || "Some error occurred while creating the topics."
    //     });
    //   });
    
    const namebody = await Topics.create(topics)
    return namebody;

  };
  //
// Retrieve all columns from the database trả về Json.
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
//in dữ liệu ra giao diện
// Retrieve all Users from the database.
exports.findbyQueryTopic = async (req, res) => {
    const userDoc = await authJwt.userToken(req);
    const name = userDoc.User.displayname;
    const avarta = userDoc.User.avartar;
    db.sequelize.query('SELECT * FROM topics', {
      nest: true,
      type: QueryTypes.SELECT,
    })
      .then(data => {
        // console.log(data);
        const dataTopic = {
            results: data,
            name: name,
            avarta: avarta

        }
        res.render('manageAdmin/topicAdmin.ejs', { dataTopic });
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving topic.',
        });
      });
  };
//key ngoại của category
exports.findbyQueryForeignTopic = async () => {
  try {
    const topicall = await db.sequelize.query('SELECT * FROM topics', {
      nest: true,
      type: QueryTypes.SELECT,
    });

    // console.log(topicall);
    return topicall;
  } catch (err) {
    console.error(err);
    throw new Error("Đã xảy ra lỗi trong quá trình lấy thông tin chủ đề.");
  }
};
//get theo id
exports.findTopicById = (req, res) => {
  const topicId = req.params.id; // Lấy ID từ tham số đường dẫn

  db.sequelize.query('SELECT * FROM topics WHERE id = :id', {
    replacements: { id: topicId },
    nest: true,
    type: QueryTypes.SELECT,
  })
    .then(data => {
      if (data.length === 0) {
        res.status(404).send({
          message: "Topic not found."
        });
        return;
      }

      console.log(data);
      res.render('manageAdmin/editTopic.ejs', { results: data });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving topics.',
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


exports.findOneTopic = async (id) => {
  try {
    const data = await db.sequelize.query('SELECT topics.name, news.content, news.title, news.id, news.img  FROM topics  JOIN news ON news.genre = topics.name   WHERE topics.id = :id ORDER BY news.id DESC; ', {
      replacements: { id: id },
      nest: true,
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (data.length === 0) {
      throw new Error("Không tìm thấy topic.");
    }

    // console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error("Đã xảy ra lỗi trong quá trình lấy thông tin topic.");
  }
};


//update ra giao diện
exports.updateTopic = async (req, res) => {
    const id = req.params.id;
    const namebody = await Topics.update(req.body, {
      where: { id: id }
  })
    return namebody;
};
// Update a topic by the id in the request
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
//xóa theo id sau đó hiển thị giao diện
exports.delete = (req, res) => {
    const id = req.params.id;
    Topics.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.redirect("/manageAdmin/topicAdmin"); // Chuyển hướng đến trang giao diện mong muốn
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



///giao diện facehome
//in dữ liệu ra giao diện
// Retrieve all Users from the database.
exports.findbyQueryTopicFace = async (req, res) => {
  try {
    const data = await db.sequelize.query('SELECT id, name FROM topics LIMIT 6', {
      nest: true,
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving topics.',
    });
  }
};
exports.findbyQueryTopicFaceDetail = async (req, res) => {
  try {
    const data = await db.sequelize.query('SELECT name FROM topics LIMIT 6', {
      nest: true,
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving topics.',
    });
  }
};