var boot = require('../app').boot
  , shutdown = require('../app').shutdown
  , port = require('../app').port
  , superagent = require('superagent')
  , expect = require('expect.js');

var seedArticles = require('../db/articles.json');

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
    it('should contain posts', function(done){
      superagent
        .get('http://127.0.0.1:' + port)
        .end(function(err, res){
          seedArticles.forEach(function(item, index, list){
            if(item.published) {
              expect(res.text).to.contain('<h2><a href="/articles/' + item.slug + '">' + item.title);
            } else {
              expect(res.text).not.to.contain('<h2><a href="/articles/' + item.slug + '">' + item.title);
            }
          });
          done();
        });
    });
  });

  after(function(){
    shutdown();
  });
});
