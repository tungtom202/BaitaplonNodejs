const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
//const User = db.user;
verifyToken = (req, res, next) => {
  // let token = req.body.token || req.query.token || req.headers["x-access-token"];

  const { token } = req.cookies;

  // if (!token) {
  //   return res.status(403).send({
  //      message: "Vui lòng đăng nhập!"
  //   });
  //   // res.render("manageAdmin/login")
  // }
  if (!token) {
    return res.redirect("http://localhost:3000/manageAdmin/login");
  }
  try {
    jwt.verify(token, config.secret, (err, decoded) => {
      req.user = decoded;
    });

  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const userToken = async (req) => {
  const { token } = req.cookies;

  const decoded = await jwt.verify(token, config.secret);
  return decoded;
};

const authJwt = {
  verifyToken: verifyToken,
  userToken: userToken
};
module.exports = authJwt;