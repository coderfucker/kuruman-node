var express = require('express')
  , http = require('http')
  , path = require('path');

var routes = require('./routes');
var app = express();

// environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(app.router);
app.get('/', routes.index);


app.all('*', function(req, res){
  res.render('index', {msg: 'welcome to the practial node.js'});
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
