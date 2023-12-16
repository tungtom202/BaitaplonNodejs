var newsRouter=require('./news.routers');
var categoryRouter=require('./category.routers');
var topicsRouter=require('./topics.routers');
var evaluateRouter=require('./evaluate.routers');
var usersRouter = require('./users.routers');
var authRouter=require('./auth.routes');

function routerApi(app){
     app.use('/news',newsRouter);
    app.use('/category',categoryRouter);
    app.use('/topics',topicsRouter);
    app.use('/evaluate',evaluateRouter);
    app.use('/users', usersRouter);
    app.use('/auth',authRouter)
}

module.exports = routerApi;