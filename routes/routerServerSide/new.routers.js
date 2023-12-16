var express = require('express');
var router = express.Router();
const multer = require('multer');
const authJwt =require("../../middleware/authJwt")
const controlNewAdmin = require("../../controllers/news.controller");
const controlCategoryAdmin = require("../../controllers/category.controller");
const controlTopicAdmin = require("../../controllers/topics.controller");

const bodyParser = require('body-parser');


router.get('/manageAdmin/newAdmin',[authJwt.verifyToken], async (req, res) => {
    await controlNewAdmin.findbyQueryNews(req, res);
});
//add
router.get("/manageAdmin/addNew", [authJwt.verifyToken], async function(req, res) {
  try {
    const categoryall = await controlCategoryAdmin.findbyQueryForeignCategory();
    const topicsall = await controlTopicAdmin.findbyQueryForeignTopic();
    const userDoc = await authJwt.userToken(req);
    const userIdd = userDoc.User.id;

    res.render("manageAdmin/addNew.ejs", { categoryall, topicsall, userIdd: userIdd });
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while retrieving News."
    });
  }
});
router.post("/manageAdmin/addNew",[authJwt.verifyToken], async function(req, res){
  await controlNewAdmin.createNew(req, res);
   res.redirect("./newAdmin");
});
//delete  theo Id
router.get('/manageAdmin/newAdmin/delete/:id',controlNewAdmin.deleteid )

//chuyển trang edit
router.get("/manageAdmin/editNew/:id",[authJwt.verifyToken], async function(req, res) {
  try {
    
    const results = await controlNewAdmin.findNewById(req.params.id);
    const categoryall = await controlCategoryAdmin.findbyQueryForeignCategory();
    const topicsall = await controlTopicAdmin.findbyQueryForeignTopic();

    const userDoc = await authJwt.userToken(req);
    const avarta = userDoc.User.avartar;
    const userName = userDoc.User.username;

    // console.log(results);
    res.render("manageAdmin/editNew.ejs", { results: results, categoryall: categoryall, topicsall: topicsall, avarta, userName });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Đã xảy ra lỗi trong quá trình lấy thông tin news."
    });
  }
});

router.post('/manageAdmin/editNew/:id',  (req, res) => {
    
  // Gọi hàm updatecategory từ controlcategoryAdmin controller và truyền giá trị của name
  controlNewAdmin.updateNew(req, res)
  .then((data) => {
      // Xử lý logic khi tạo chủ đề thành công
      console.log(data);
      // Gửi phản hồi thành công
      res.redirect("../newAdmin")
    })
    .catch((err) => {
      // Gửi phản hồi lỗi
      res.status(500).send({
        message: "An error occurred while creating the new."
      });
 });
});


//search all
router.get('/interFaceWeb/pageSearch', async (req, res) => {
  try {
    const topicData = await controlTopicAdmin.findbyQueryTopicFace(req, res);
    const searchData = await controlNewAdmin.findAllNews(req, res);
    res.render("interFaceWeb/pageSearch.ejs", { searchData: searchData, topicData: topicData });
  } catch (error) {
    console.error('Failed to retrieve news', error);
    res.status(500).send({ error: 'Failed to retrieve news' });
  }
});


//new faceslide
// router.get('/interFaceWeb/homeFace', async (req, res) => {
//     const data = await controlNewAdmin.findbyQueryNewSlide(req, res);
//     res.render('interFaceWeb/homeFace.ejs', { : data });
// });




module.exports = router;