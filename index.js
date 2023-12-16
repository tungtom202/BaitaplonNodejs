const authJwt =require("../../middleware/authJwt.js")

//giao diện
var express = require("express")
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

///
//hiển thị giao diện home
app.get("/manageAdmin/homeAdmin", function(req, res){
    res.render("manageAdmin/homeAdmin.ejs");
})
//hiển thị giao diện login
app.get("/manageAdmin/login", function(req, res){
    res.render("manageAdmin/login.ejs")
})
//liên kết từ homeAdmin -> topicAdmin
app.get('/manageAdmin/topicAdmin', (req, res) => {
    res.render('manageAdmin/topicAdmin');
});
//liên kết từ homeAdmin -> categoryAdmin
app.get('/manageAdmin/categoryAdmin', (req, res) => {
    res.render('manageAdmin/categoryAdmin.ejs');
});
//liên kết từ homeAdmin -> evaluateAdmin
app.get('/manageAdmin/evaluateAdmin', (req, res) => {
    res.render('manageAdmin/evaluateAdmin.ejs');
});