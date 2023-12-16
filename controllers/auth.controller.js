const db = require("../models");
const config = require("../config/auth.config");
//const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
// var bcrypt = require("bcryptjs");
const bcrypt = require('bcrypt');

const md5 = require("md5");
const {
  QueryTypes
} = require('sequelize');
const {
  user
} = require("../models");
exports.signin = (req, res) => {
  const msv = req.body.username;
  const pwd = req.body.password;
  let strQuery="select * from users where username='"+msv+"' and password='"+pwd+"'";
  db.sequelize.query(strQuery, {
      // replacements: {
      //   username: msv,
      //   //password: bcrypt.hashSync(pwd)
      //   password: pwd
      // },
      nest:true,
      type: QueryTypes.SELECT
    })
    .then(data => {
      if (!data[0]) {
        console.log(data);
        // var password = "0868609385"  
        console.log("Data : ", data[0])
        console.log("Hashed password : ", bcrypt.hashSync(pwd), 8)
        res.send(data[0]);
        return res.status(403).send({
          message: "Tài khoản hoặc mật khẩu không đúng."
        });

      } else {
        console.log(data);
        console.log("Hashed password : ", md5(pwd))
        //data[0]      
        var token = jwt.sign({
          User: data[0]
        }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
        // // save user token
        user.token = token;
        // user
        // res.status(200).json(user);
        res.status(200).send({
          User: data[0],
          // email: user.email,
          // roles: authorities,
          accessToken: token
        });
      }
      // res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};




exports.signinauth = async (req, res) => {
  const msv = req.body.username;
  const pwd = req.body.password;

  try {
    // Thực hiện truy vấn để kiểm tra tài khoản và mật khẩu
    let strQuery = "SELECT * FROM users WHERE username = ?";
    const data = await db.sequelize.query(strQuery, {
      nest: true,
      type: QueryTypes.SELECT,
      replacements: [msv]
    });

    if (!data[0]) {
      return res.status(403).send({
        message: "Tài khoản hoặc mật khẩu không đúng."
      });
    }

    // Mật khẩu đã lưu trong cơ sở dữ liệu
    const storedPassword = data[0].password;

    // Giải mã mật khẩu đã lưu và so sánh với mật khẩu nhập vào
    const match = await bcrypt.compare(pwd, storedPassword);

    if (match) {
      // Mật khẩu đúng, thực hiện đăng nhập thành công
      const token = jwt.sign({ User: data[0] }, config.secret, { expiresIn: 86400 });
      res.cookie('token', token, { maxAge: 900000, httpOnly: true });
      res.redirect('homeAdmin');
    } else {
      // Mật khẩu không đúng
      return res.status(403).send({
        message: "Tài khoản hoặc mật khẩu không đúng."
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Lỗi xử lý mật khẩu."
    });
  }
};
// Xử lý đăng nhập
// exports.signinauth = (req, res) => {

//   const msv = req.body.username;
//   const pwd = req.body.password;

//   // Thực hiện truy vấn để kiểm tra tài khoản và mật khẩu
//   let strQuery = "select * from users where username='"+msv+"' and password='"+pwd+"'";
//   db.sequelize.query(strQuery, {
//     nest: true,
//     type: QueryTypes.SELECT
//   })
//   .then((data) => {
//     if (!data[0]) {
//       return res.status(403).send({
//         message: "Tài khoản hoặc mật khẩu không đúng."
//       });
//     } else {
//       // Tạo token

//       const token = jwt.sign({ User: data[0] }, config.secret, { expiresIn: 86400 });
//       res.cookie('token', token, { maxAge: 900000, httpOnly: true })
//       res.redirect('homeAdmin');

      
//       // Trả về token
//       //res.json({ token });
//     }
//   })
//   .catch(err => {
//     res.status(500).send({
//       message: err.message
//     });
//   });
// };