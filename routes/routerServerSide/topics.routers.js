var express = require('express');
var router = express.Router();
const multer = require('multer');
const authJwt =require("../../middleware/authJwt.js")

const upload = multer();

const controlTopicAdmin = require("../../controllers/topics.controller");

//get all
router.get('/manageAdmin/topicAdmin', [authJwt.verifyToken], async (req, res) => {
  try {
     await controlTopicAdmin.findbyQueryTopic(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error."
    });
  }
});
  //delete
  router.get('/manageAdmin/topicAdmin/delete/:id', (req, res) => {
  
    controlTopicAdmin.delete(req, res, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving Columns."
        });
      } else {
        console.log(results);
        res.render("../../manageAdmin/topicAdmin.ejs", { results: results });
      }
    });
  });

  //add
router.get("/manageAdmin/addTopic", function(req, res){
    res.render("manageAdmin/addTopic.ejs");
});
  
router.post('/manageAdmin/addTopic', upload.none(), (req, res) => {
    
  
    // Gọi hàm createTopic từ controlTopicAdmin controller và truyền giá trị của name
  controlTopicAdmin.createTopic(req, res)
      .then((data) => {
        // Xử lý logic khi tạo chủ đề thành công
        console.log(data);
        // Gửi phản hồi thành công
        res.redirect("topicAdmin")
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
router.get("/manageAdmin/editTopic/:id", function(req, res){
  controlTopicAdmin.findTopicById(req, res, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Topic."
      });
    } else {
      console.log(results);
      res.render("manageAdmin/editTopic.ejs", { results: results });
    }
  });
});
//edit topic
router.post('/manageAdmin/editTopic/:id', upload.none(), (req, res) => {
    
  // Gọi hàm updateTopic từ controlTopicAdmin controller và truyền giá trị của name
  controlTopicAdmin.updateTopic(req, res)
  .then((data) => {
      // Xử lý logic khi tạo chủ đề thành công
      console.log(data);
      // Gửi phản hồi thành công
      res.redirect("../topicAdmin")
    })
    .catch((err) => {
      // Gửi phản hồi lỗi
      res.status(500).send({
        message: "An error occurred while creating the topic."
      });
 });
});




// ///giao diện faceweb

// router.get('/interFaceWeb/homeFace', async (req, res) => {
//   try {
//     await controlTopicAdmin.findbyQueryTopicFace(req, res);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       message: 'Internal server error.',
//     });
//   }
// });



module.exports = router;