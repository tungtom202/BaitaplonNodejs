var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var indexRouter = require('./routes/index');

var app = express();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

const bodyParser = require('body-parser');





// Sử dụng body-parser để phân tích dữ liệu từ biểu mẫu
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//

//sử dụng template ejs
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
//

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/tutorial',tutorialsRouter);


///routerServerSide
var routerServerSide=require('./routes/routerServerSide/index');
routerServerSide(app);
//routerApi
var routerApi=require('./routes/routerApi/index');
routerApi(app);





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