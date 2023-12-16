var express = require('express');
var router = express.Router();
const multer = require('multer');
const authJwt =require("../../middleware/authJwt.js")

const upload = multer();

const controlAuthAdmin = require("../../controllers/auth.controller");
const controlUserAdmin = require("../../controllers/user.controller");

router.post('/manageAdmin/login', controlAuthAdmin.signinauth);
router.get('/manageAdmin/homeAdmin',[authJwt.verifyToken], (req, res) => {
   
    res.render('manageAdmin/homeAdmin')
    
});


  //add
router.get("/manageAdmin/addRegister", function(req, res){
    res.render("manageAdmin/addRegister.ejs");
});
router.post('/manageAdmin/addRegister', upload.none(), (req, res) => {
    
  
    // Gọi hàm createTopic từ controlTopicAdmin controller và truyền giá trị của name
    controlUserAdmin.createUserRegister(req, res)
      .then((data) => {
        // Xử lý logic khi tạo chủ đề thành công
        console.log(data);
        // Gửi phản hồi thành công
        res.redirect("login")
      })
      .catch((err) => {
        // Xử lý logic khi có lỗi xảy ra trong quá trình tạo chủ đề
  
        // Gửi phản hồi lỗi
        res.status(500).send({
          message: "An error occurred while creating the users."
        });
   });
});
module.exports = router;