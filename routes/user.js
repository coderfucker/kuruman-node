// get users list
exports.list = function(req, res){
  res.send('respond with a resource');
};

// get login page
exports.login = function(req, res, next){
  res.render('login');
};

// get logout route
exports.logout = function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
};

// post authenticate route
exports.authenticate = function(req, res, next){
  console.log('cyn', req.body);
  if(!req.body.email || !req.body.password)
    return res.render('login', {error: 'please enter your email and password.'});
  req.collections.users.findOne({
    email: req.body.email,
    password: req.body.password
  }, function(error, user){
    if(error) return next(error);
    if(!user) return res.render('login', {error: 'incorrect email & password combination.'});
    req.session.user = user;
    req.session.admin = user.admin;
    console.log('====>', req.session);
    res.redirect('/admin');
  });
};
