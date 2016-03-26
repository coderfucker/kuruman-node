var boot = require('../app').boot
  , shutdown = require('../app').shutdown
  , port = require('../app').port
  , superagent = require('superagent')
  , expect = require('expect.js');

describe('server', function() {
  before(function(){
    boot();
  });

  describe('homepage', function(){
    it('should respond to GET', function(done){
      superagent
        .get('http://127.0.0.1:' + port)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  after(function(){
    shutdown();
  });
});
