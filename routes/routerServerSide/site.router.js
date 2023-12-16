var express = require('express');
var router = express.Router();

const authJwt = require("../../middleware/authJwt.js")
const controlNewAdmin = require("../../controllers/news.controller.js");
const controlEvaluateAdmin = require("../../controllers/evaluate.controller.js");


//hiển thị giao diện home
router.get("/manageAdmin/homeAdmin", [authJwt.verifyToken], async function(req, res){

    //Khi đã login và có token thì đoạn mã dưới sẽ gọi ra user đã được mã hóa ở token đển gọi ra thì cần thông qua Object Userr để lấy giá trị
  //Begin
  const userDoc = await authJwt.userToken(req);
  //End

  const name = userDoc.User.displayname;
  const usernames = userDoc.User.username;
  const avarta = userDoc.User.avartar;
  const passworduse = userDoc.User.password;
  
  const results = await controlNewAdmin.findbyQueryNewNoDuyet(req, res);
  const resultsCount = await controlNewAdmin.findbyQueryNewViewsOne(req, res);
  const countsPost = await controlNewAdmin.countPostNews();
  const countsComment = await controlEvaluateAdmin.countPostCommment();

    res.render("manageAdmin/homeAdmin.ejs", {name, avarta, results: results, countsPost, countsComment, usernames, passworduse, resultsCount})
})

//hiển thị giao diện home
router.get("/manageAdmin/login", function(req, res){
    res.render("manageAdmin/login.ejs")
})

// router.get("/interFaceWeb/homeFace", function(req, res){
  
//   res.render("interFaceWeb/homeFace.ejs")
// })
// router.get('/interFaceWeb/homeFace', async (req, res) => {
//   try {
//     await controlTopicAdmin.findbyQueryTopicFace(req, res);
//     res.render("interFaceWeb/homeFace.ejs");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       message: 'Internal server error.',
//     });
//   }
// });
//hiển thị trang detail
// router.get("/interFaceWeb/newDetail", function(req, res){
//   res.render("interFaceWeb/newDetail.ejs")
// })
module.exports = router;