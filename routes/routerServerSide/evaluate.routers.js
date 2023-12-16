var express = require('express');
var router = express.Router();
const multer = require('multer');
const authJwt =require("../../middleware/authJwt.js")

const upload = multer();

const controlEvaluateAdmin = require("../../controllers/evaluate.controller");
const controlUserAdmin = require("../../controllers/user.controller");
const controlNewAdmin = require("../../controllers/news.controller");

//get all
router.get('/manageAdmin/evaluateAdmin',[authJwt.verifyToken], async (req, res) => {
        await controlEvaluateAdmin.findbyQueryEvaluate(req, res);
});

//delete
router.get('/manageAdmin/evaluateAdmin/delete/:id', (req, res) => {
  
    controlEvaluateAdmin.deleteid(req, res, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving evaluate."
        });
      } else {
        console.log(results);
        res.render("../../manageAdmin/evaluateAdmin.ejs", { results: results });
      }
    });
  });

  
//add
router.get("/manageAdmin/addEvaluate", async function(req, res) {
  try {
    const userall = await controlUserAdmin.findbyQueryForeignUser();
    const newall = await controlNewAdmin.findbyQueryForeignNew();

    res.render("manageAdmin/addEvaluate.ejs", { userall: userall, newall: newall });
  } catch (err) {
    res.status(500).send({
      message: "An error occurred while retrieving Evaluate."
    });
  }
});
  
router.post('/manageAdmin/addEvaluate', upload.none(), (req, res) => {
    
    // Gọi hàm createEvaluate từ controlCategoryAdmin controller và truyền giá trị của name
    controlEvaluateAdmin.createEvaluate(req, res)
      .then((data) => {
        // Xử lý logic khi tạo chủ đề thành công
        console.log(data);
        // Gửi phản hồi thành công
        res.redirect("evaluateAdmin")
      })
      .catch((err) => {
        // Xử lý logic khi có lỗi xảy ra trong quá trình tạo chủ đề
  
        // Gửi phản hồi lỗi
        res.status(500).send({
          message: "An error occurred while creating the evaluate."
        });
   });
});
// //evaluate new
// router.post('/interFaceWeb/newDetail', (req, res) => {
//   // Gọi hàm createEvaluate từ controlCategoryAdmin controller và truyền giá trị của name
//   controlEvaluateAdmin.createEvaluateNews(req, res)
//     .then((data) => {
//       // Xử lý logic khi tạo chủ đề thành công
//       console.log(data);
//       // Gửi phản hồi thành công
//       res.redirect("newDetail")
//     })
//     .catch((err) => {
//       // Xử lý logic khi có lỗi xảy ra trong quá trình tạo chủ đề
//       // Gửi phản hồi lỗi
//       res.status(500).send({
//         message: "An error occurred while creating the evaluate."
//       });
//     });
// });

//chuyển trang edit
//chuyển trang edit
router.get("/manageAdmin/editEvaluate/:id", async function(req, res) {
  try {
    const evaluateId = req.params.id;
    const results = await controlEvaluateAdmin.findEvaluateById(evaluateId);
    const userall = await controlUserAdmin.findbyQueryForeignUser();
    const newall = await controlNewAdmin.findbyQueryForeignNew();

    console.log(results);
    res.render("manageAdmin/editEvaluate.ejs", { results: results, userall: userall,  newall: newall});
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Đã xảy ra lỗi trong quá trình lấy thông tin danh mục."
    });
  }
});
//edit category
router.post('/manageAdmin/editEvaluate/:id', upload.none(), (req, res) => {
    
    // Gọi hàm updatecategory từ controlcategoryAdmin controller và truyền giá trị của name
    controlEvaluateAdmin.updateEvaluate(req, res)
    .then((data) => {
        // Xử lý logic khi tạo chủ đề thành công
        console.log(data);
        // Gửi phản hồi thành công
        res.redirect("../evaluateAdmin")
      })
      .catch((err) => {
        // Gửi phản hồi lỗi
        res.status(500).send({
          message: "An error occurred while creating the eavluate."
        });
   });
  });

module.exports = router;