const db = require("../models");
const News = db.news;
const Category = db.category;
const Op = db.Sequelize.Op;
const { getPagination, getPagingData } = require("./utils");
const { QueryTypes } = require('sequelize');
const multer = require('multer');
const authJwt =require("../middleware/authJwt")

var bodyParser = require('body-parser')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/upload');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    },
  });
var upload = multer({ storage: storage }).single('uploadfile')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
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
//create đưa ra giao diện
// exports.createNew = async (req, res) => {
//   try {
//     // Validate request
//     if (!req.body.title) {
//       res.status(400).send({
//         message: "Content can not be empty!"
//       });
//       return;
//     }

//     // Create a news
//     const news = {
//         title: req.body.title,
//         published: req.body.published ? req.body.published : false,
//         img: req.body.img,
//         content: req.body.content,
//         genre: req.body.genre,
//         newviews: req.body.newviews,
//         poststatus: req.body.poststatus,
//         categoryId: req.body.categoryId
//     };
//     const namebody = await News.create(news);
//     return namebody;
//   } catch (err) {
//     throw new Error("An error occurred while creating the news.");
//   }
// };
exports.createNew = async (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      // Một lỗi của Multer xảy ra khi upload.
      res.send("lỗi");
    } else {
      // Một lỗi không xác định xảy ra khi upload.
      if (req.file == undefined) {
        res.send("Bạn chưa chọn file");
      } else {
        //  const userDoc = await authJwt.userToken(req);
        //  const userId = userDoc.User.id;
        const news = {
          title: req.body.title,
          published: req.body.published ? req.body.published : false,
          img: req.file.originalname,
          content: req.body.content,
          genre: req.body.genre,
          newviews: req.body.newviews,
          poststatus: req.body.poststatus,
          categoryId: req.body.categoryId,
          userId: req.body.userId,
        };
        News.create(news)
          .then((createdNews) => {
            res.render("newAdmin", { news: createdNews }); // Render giao diện newAdmin với dữ liệu tin tức đã tạo
          })
          .catch((error) => {
            res.status(500).send("Đã xảy ra lỗi trong quá trình tạo tin tức mới"); // Gửi phản hồi lỗi
          });
      }
    }
  });
};

//get theo id
  exports.findNewById = async (newId) => {
    try {
      const data = await db.sequelize.query('SELECT * FROM news WHERE id = :id', {
        replacements: { id: newId },
        nest: true,
        type: QueryTypes.SELECT,
      });
  
      if (data.length === 0) {
        throw new Error("Không tìm thấy news.");
      }
  
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      throw new Error("Đã xảy ra lỗi trong quá trình lấy thông tin news.");
    }
  };
//find chuyển trang chi tiết
exports.findNewByIdDetails = async (newId) => {
  try {
    const updateluotxem = await db.sequelize.query('UPDATE news SET newviews = newviews + 1 WHERE id = :id', {
      replacements: { id: newId },
      type: QueryTypes.UPDATE,
    });

    const data = await db.sequelize.query('SELECT news.id, news.title, news.img, news.content, news.genre, users.lastname, users.fistname, DATE_FORMAT(news.createdAt, "%a %b %d %Y %H:%i") AS formattedCreatedAt FROM news JOIN users ON news.userId = users.id WHERE news.id = :id;', {
      replacements: { id: newId },
      nest: true,
      type: QueryTypes.SELECT,
    });

    if (data.length === 0) {
      throw new Error("Không tìm thấy tin tức.");
    }

    return data;

  } catch (err) {
    console.error(err);
    throw new Error("Đã xảy ra lỗi trong quá trình lấy thông tin tin tức.");
  }
};
// Find a single news with an id
exports.findGenreAll = async (req, res) => {
  try {
    const data = await db.sequelize.query('SELECT * FROM news ORDER BY RAND() LIMIT 6', {
      nest: true,
      type: QueryTypes.SELECT,
    });
    return data;
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving news.',
    });
  }
};
//lấy danh sách theo chủ đề
// Hàm để lấy danh sách chủ đề tương ứng với ID tin tức

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




// Retrieve all category from the database.
exports.findbyQueryNews = async (req, res) => {
    const userDoc = await authJwt.userToken(req);
    const name = userDoc.User.displayname;
    const avarta = userDoc.User.avartar;

    db.sequelize.query('SELECT * FROM news', {
      nest: true,
      type: QueryTypes.SELECT,
    })
      .then(data => {
        // console.log(data);
        const dataNew = {
          results: data,
          name: name,
          avarta: avarta,
      }
        res.render('manageAdmin/newAdmin.ejs', { dataNew });
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving News.',
        });
      });
  };

  //key ngoại của evaluate
exports.findbyQueryForeignNew = async () => {
    try {
      const newall = await db.sequelize.query('SELECT * FROM news', {
        nest: true,
        type: QueryTypes.SELECT,
      });
  
      // console.log(newall);
      return newall;
    } catch (err) {
      console.error(err);
      throw new Error("Đã xảy ra lỗi trong quá trình lấy thông tin new.");
    }
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


//phân trang page topic
exports.findAllByPageNewTopic = async (req, res) => {
  try {
    const { page, size, title } = req.query;
    const limit = parseInt(size) || 10;
    const offset = (parseInt(page) - 1) * limit || 0;
    const condition = title ? { title: { $like: `%${title}%` } } : {};

    const { count, rows } = await News.findAndCountAll({
      where: condition,
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);
    const currentPage = parseInt(page) || 1;

    return { totalPages, currentPage, items: rows };
  } catch (error) {
    throw new Error('Some error occurred while retrieving news.');
  }
};
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
exports.updateNew = async (req, res) => {
  const id = req.params.id;
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).send('Error uploading file');
      }

      if (typeof req.file === 'undefined') {
        await News.update(
          {
            title: req.body.title,
            content: req.body.content,
            published: req.body.published,
            genre: req.body.genre,
            newviews: req.body.newviews,
            poststatus: req.body.poststatus,
            categoryId: req.body.categoryId
          },
          {
            where: { id: id }
          }
        );

        console.log('News updated successfully');
        res.render('manageAdmin/newAdmin.ejs'); // Render giao diện newadmin
      } else {
        await News.update(
          {
            title: req.body.title,
            img: req.file.originalname,
            content: req.body.content,
            published: req.body.published,
            genre: req.body.genre,
            newviews: req.body.newviews,
            poststatus: req.body.poststatus,
            categoryId: req.body.categoryId
          },
          {
            where: { id: id }
          }
        );

        console.log('News updated successfully');
        res.render('manageAdmin/newAdmin.ejs'); // Render giao diện newadmin
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
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

// Retrieve all news from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  News.findAll({ where: condition })
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
//tìm kiếm qua giao diện
exports.findAllNews = async (req, res) => {
  try {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    const data = await News.findAll({ where: condition });
    return data;
  } catch (err) {
    throw new Error(err.message || "Some error occurred while retrieving new.");
  }
};
//delete giao diện
exports.deleteid = (req, res) => {
    const id = req.params.id;
    News.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.redirect("/manageAdmin/newAdmin"); // Chuyển hướng đến trang giao diện mong muốn
        } else {
          res.send({
            message: `Cannot delete News with id=${id}. Maybe News was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete News with id=" + id
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

///export giao diện faceweb

exports.findbyQueryNewSlide = async (req, res) => {
  try {
    const data = await db.sequelize.query('SELECT id, title, img, content FROM news WHERE poststatus = "duyet" LIMIT 4', {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News.');
  }
};
//hiển thị tin hotttt
exports.findbyQueryNewViews = async (req, res) => {
  try {
    const data = await db.sequelize.query('SELECT id, title, img, genre, content, newviews FROM news WHERE CAST(newviews AS SIGNED INTEGER) > 4 ORDER BY CAST(newviews AS SIGNED INTEGER) DESC LIMIT 3;', {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News views.');
  }
};
///Nhiều lượt xem nhất
exports.findbyQueryNewViewsOne = async (req, res) => {
  try {
    const data = await db.sequelize.query('SELECT id, title, img, genre, content, createdAt, newviews FROM news WHERE CAST(newviews AS SIGNED INTEGER) > 10 ORDER BY CAST(newviews AS SIGNED INTEGER) DESC LIMIT 1;', {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News views.');
  }
};
// đếm sl bài báo
exports.countPostNews = async () => {
  try {
    const data = await db.sequelize.query('SELECT COUNT(*) AS total_posts FROM news', {
      type: QueryTypes.SELECT,
    });

    return data[0].total_posts; // Trả về giá trị số lượng bài viết từ đối tượng đầu tiên trong mảng
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News.');
  }
};

///export giao diện homeadmin

exports.findbyQueryNewNoDuyet = async (req, res) => {
  try {
    const data = await db.sequelize.query('SELECT id, title, img, content FROM news WHERE poststatus = "khongduyet"', {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News.');
  }
};
///export giao diện faceweb

exports.findbyQueryNewLaws = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, title, img, content FROM news WHERE genre = 'Politics & Laws' ORDER BY id DESC LIMIT 4;", {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News.');
  }
};
exports.findbyQueryNewLawsBottom = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, img, title FROM (SELECT id, img, title, ROW_NUMBER() OVER (ORDER BY id ASC) AS rn FROM news WHERE genre = 'Politics & Laws') AS t1 WHERE rn = 1 UNION SELECT id, NULL, title FROM ( SELECT id, title, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM news WHERE genre = 'Politics & Laws' ) AS t2 WHERE rn = 2 UNION SELECT id, NULL, title FROM ( SELECT id, title, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM news  WHERE genre = 'Politics & Laws') AS t3 WHERE rn = 3 UNION SELECT id, NULL, title FROM ( SELECT id, title, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM news WHERE genre = 'Politics & Laws' ) AS t4 WHERE rn = 4;",
    { nest: true, type: QueryTypes.SELECT, });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News.');
  }
};
//bottom_left
exports.findbyQueryNewLawsBottomLeft = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, title, img, content FROM news WHERE genre = 'Politics & Laws' ORDER BY id DESC LIMIT 1;", {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News.');
  }
};
//economy
exports.findbyQueryNewEconomy = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, title, img, content FROM news WHERE genre = 'Economy' ORDER BY id DESC LIMIT 3;", {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News Economy.');
  }
};
//
exports.findbyQueryEconomyBottom = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, img, title FROM (SELECT id, img, title, ROW_NUMBER() OVER (ORDER BY id ASC) AS rn FROM news WHERE genre = 'Economy') AS t1 WHERE rn = 1 UNION SELECT id, NULL, title FROM ( SELECT id, title, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM news WHERE genre = 'Economy' ) AS t2 WHERE rn = 2 UNION SELECT id, NULL, title FROM ( SELECT id, title, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM news  WHERE genre = 'Economy') AS t3 WHERE rn = 3 UNION SELECT id, NULL, title FROM ( SELECT id, title, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM news WHERE genre = 'Economy' ) AS t4 WHERE rn = 4;", {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News.');
  }
};
//bottom_left
exports.findbyQueryEconomyBottomLeft = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, title, img, content FROM news WHERE genre = 'Economy' ORDER BY id DESC LIMIT 1;", {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News.');
  }
};
//society
exports.findbyQuerySocietyBottom = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, img, title FROM (SELECT id, img, title, ROW_NUMBER() OVER (ORDER BY id ASC) AS rn FROM news WHERE genre = 'Society') AS t1 WHERE rn = 1 UNION SELECT id, NULL, title FROM ( SELECT id, title, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM news WHERE genre = 'Society' ) AS t2 WHERE rn = 2 UNION SELECT id, NULL, title FROM ( SELECT id, title, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM news  WHERE genre = 'Society') AS t3 WHERE rn = 3 UNION SELECT id, NULL, title FROM ( SELECT id, title, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn FROM news WHERE genre = 'Society' ) AS t4 WHERE rn = 4;", {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News.');
  }
};
//bottom_left
exports.findbyQuerySocietyBottomLeft = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, title, img, content FROM news WHERE genre = 'Society' ORDER BY id DESC LIMIT 1;", {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving News.');
  }
};

//life& style
exports.findbyQueryLifeStyle = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, title, img, content FROM news WHERE genre = 'Life & Style' ORDER BY id DESC LIMIT 6;", {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving Life & Style.');
  }
};

//sport
exports.findbyQuerySport = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, title, img, content FROM news WHERE genre = 'Sports' ORDER BY id DESC LIMIT 1;", {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving Sports.');
  }
};
//eviroiment
exports.findbyQueryEnvironment = async (req, res) => {
  try {
    const data = await db.sequelize.query("SELECT id, title, img, content FROM news WHERE genre = 'Environment' ORDER BY id DESC LIMIT 1;", {
      nest: true,
      type: QueryTypes.SELECT,
    });

    return data;
  } catch (err) {
    throw new Error(err.message || 'Some error occurred while retrieving Environment.');
  }
};
