var topicServerSideRouter=require('./topics.routers');
var categoryServerSideRouter=require('./category.routers');
var evaluateServerSideRouter=require('./evaluate.routers');
var userServerSideRouter=require('./user.routers');
var newServerSideRouter=require('./new.routers');
var authServerSideRouter=require('./auth.router');
var homeFaceServerSideRouter=require('./homeFace.routers');


var siteRouter=require('./site.router');

function routerServerSide(app){
    //router site:
    app.use('/',siteRouter);
    // routes serverSide
    app.use('/',topicServerSideRouter);
    //category
    app.use('/',categoryServerSideRouter);
    //evaluate
    app.use('/',evaluateServerSideRouter);
    //user
    app.use('/',userServerSideRouter);
    //new
    app.use('/',newServerSideRouter);
    //login
    app.use('/',authServerSideRouter);
    //homeface
    app.use('/',homeFaceServerSideRouter);
}



module.exports = routerServerSide;