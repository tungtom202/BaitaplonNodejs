var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter=require('./routes/auth.routes');
//var tutorialsRouter=require('./routes/tutorial.routers');
var app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/tutorial',tutorialsRouter);

// simple route
// app.get("/", (req, res) => {
//   res.json({
//     message: "Welcome to Asset Manager System  EPU of ITC."
//   });
// });


//news
var newsRouter=require('./routes/news.routers');
app.use('/news',newsRouter);
var categoryRouter=require('./routes/category.routers');
app.use('/category',categoryRouter);
var topicsRouter=require('./routes/topics.routers');
app.use('/topics',topicsRouter);
var evaluateRouter=require('./routes/evaluate.routers');
app.use('/evaluate',evaluateRouter);
// routes
// app.use('/', indexRouter);
app.use('/users', usersRouter);
 app.use('/auth',authRouter)

//giao diện
var express = require("express")
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
///\
app.get("/", function(req, res){
   res.render("homeAdmin.ejs")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports=app;