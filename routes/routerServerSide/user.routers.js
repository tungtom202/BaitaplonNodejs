var express = require('express');
var router = express.Router();
const multer = require('multer');
const authJwt =require("../../middleware/authJwt")

const upload = multer();

const controlUserAdmin = require("../../controllers/user.controller");

router.get('/manageAdmin/UserAdmin',[authJwt.verifyToken], async (req, res) => {
      await controlUserAdmin.findbyQueryUser(req, res);
});

  //add
  router.get("/manageAdmin/addUser", async function(req, res) {
      res.render("manageAdmin/addUser.ejs");
});
    
  
  router.post("/manageAdmin/addUser", function(req, res){
    controlUserAdmin.createUser(req, res);
    res.redirect("./userAdmin");
  });

//chuyển trang edit
router.get("/manageAdmin/editUser/:id", async function(req, res) {
    const results = await controlUserAdmin.findUserById(req.params.id);
    res.render("manageAdmin/editUser.ejs", { results: results });
});

router.post('/manageAdmin/editUser/:id',  (req, res) => {
    
  // Gọi hàm updateUser từ controlUserAdmin controller và truyền giá trị của name
  controlUserAdmin.updateUser(req, res)
  .then((data) => {
      // Xử lý logic khi tạo chủ đề thành công
      console.log(data);
      // Gửi phản hồi thành công
      res.redirect("../userAdmin")
    })
    .catch((err) => {
      // Gửi phản hồi lỗi
      res.status(500).send({
        message: "An error occurred while creating the user."
      });
 });
});

  //delete
  router.get('/manageAdmin/userAdmin/delete/:id', controlUserAdmin.delete);

//đăng xuất
// Tuyến đường xử lý yêu cầu đăng xuất
router.get('/logout', (req, res) => {
  // Xóa token hoặc phiên đăng nhập
  res.clearCookie('token'); // Xóa cookie token (nếu sử dụng cookie)
  // Hoặc res.session.destroy() nếu sử dụng session

  // Chuyển hướng người dùng đến trang đăng nhập hoặc trang khác
  res.redirect('http://localhost:3000/manageAdmin/login');
});
module.exports = router;