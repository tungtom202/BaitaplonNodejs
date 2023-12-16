var express = require('express');
var router = express.Router();
const multer = require('multer');
const authJwt =require("../../middleware/authJwt.js")

const upload = multer();

const controlCategoryAdmin = require("../../controllers/category.controller");
const controlTopicAdmin = require("../../controllers/topics.controller");

//get all
router.get('/manageAdmin/categoryAdmin',[authJwt.verifyToken], async (req, res) => {
    try {
      await controlCategoryAdmin.findbyQueryCategory(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal server error."
      });
    }
    
  });
//delete
router.get('/manageAdmin/categoryAdmin/delete/:id', (req, res) => {
  
    controlCategoryAdmin.deleteid(req, res, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving category."
        });
      } else {
        res.render("../../manageAdmin/categoryAdmin.ejs", { results: results });
      }
    });
  });
  
//add
router.get("/manageAdmin/addCategory", async function(req, res) {
  try {
    const topicall = await controlTopicAdmin.findbyQueryForeignTopic();
    res.render("manageAdmin/addCategory.ejs", { topicall: topicall });
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while retrieving topics."
    });
  }
});
  
router.post('/manageAdmin/addCategory', upload.none(), (req, res) => {
    
    // Gọi hàm createCategory từ controlCategoryAdmin controller và truyền giá trị của name
    controlCategoryAdmin.createCategory(req, res)
      .then((data) => {
        // Gửi phản hồi thành công
        res.redirect("categoryAdmin")
      })
      .catch((err) => {
        // Xử lý logic khi có lỗi xảy ra trong quá trình tạo chủ đề
  
        // Gửi phản hồi lỗi
        res.status(500).send({
          message: "An error occurred while creating the topic."
        });
   });
});

//chuyển trang edit
router.get("/manageAdmin/editCategory/:id", async function(req, res) {
  try {
    const categoryId = req.params.id;
    const results = await controlCategoryAdmin.findCategoryById(categoryId);
    const topicall = await controlTopicAdmin.findbyQueryForeignTopic();

    res.render("manageAdmin/editCategory.ejs", { results: results, topicall: topicall });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Đã xảy ra lỗi trong quá trình lấy thông tin danh mục."
    });
  }
});
//edit category
router.post('/manageAdmin/editCategory/:id', upload.none(), (req, res) => {
    
    // Gọi hàm updatecategory từ controlcategoryAdmin controller và truyền giá trị của name
    controlCategoryAdmin.updateCategory(req, res)
    .then((data) => {
        // Gửi phản hồi thành công
        res.redirect("../categoryAdmin")
      })
      .catch((err) => {
        // Gửi phản hồi lỗi
        res.status(500).send({
          message: "An error occurred while creating the topic."
        });
   });
  });
module.exports = router