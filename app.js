var express = require('express')
  , morgan = require('morgan')
  , http = require('http')
  , path = require('path');

// middleware
var favicon = require('serve-favicon')
  , methodOverride = require('method-override')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , errorHandler = require('errorhandler');

// express model
var mongoose= require('mongoose')
  , dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog'
  , db = mongoose.connect(dbUrl, {safe: true});

var routes = require('./routes');
var app = express();
var router = express.Router();
app.locals.appTitle = 'kuruman';

app.use(function(req, res, next){
  if(!models.Article || !models.User) return next(new Error('no collections'));
  req.models= models;
  return next();
});

// environments
app.set('port', process.env.PORT || 3000);
app.set('env', 'development');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(session({
  secret: '2C44774A-D649-4D44-9535-46E296EF984F', 
  resave: false,
  saveUninitialized: true,
}));
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  if(req.session && req.session.admin)
    res.locals.admin = true;
  next();
});

// authorization
var authorize = function(req, res, next) {
  console.log('auth====>', req.session);
  if(req.session && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};

// dev 
if('development' === app.get('env')) {
  app.use(errorHandler());
}

app.use(router);
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);
app.get('/logout', routes.user.logout);
app.get('/admin', authorize, routes.article.admin);
app.get('/post', authorize, routes.article.post);
app.post('/post', authorize, routes.article.postArticle);
app.get('/articles/:slug', routes.article.show);

// rest api routes
app.all('/api', authorize);
app.get('/api/articles', routes.article.list);
app.post('/api/articles', routes.article.add);
app.put('/api/articles/:id', routes.article.edit);
app.delete('/api/articles/:id', routes.article.del);

app.all('*', function(req, res){
  res.sendStatus(404);
});

//http.createServer(app).listen(app.get('port'), function(){ 
//  console.log('express.js server listening on oport', app.get('port')); 
//});

var server = http.createServer(app);
var boot = function(){
  server.listen(app.get('port'), function(){
    console.info('express server listening on port', app.get('port')); 
  });
}
var shutdown = function(){
  server.close();
}
if(require.main === module){
  boot();
} else {
  console.info('runing app as a module');
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
