/*jshint unused:false */

var should = require('should'),
    Mbtiles3 = require('../');


describe('Mbtiles3', function() {

  it('throws an error when instantiated without options', function (done) {
    (function(){
      new Mbtiles3();
    }).should.throw(/requires/i);
    done();
  });

  it('has basic properties', function(done) {
    var mbtiles3 = new Mbtiles3({
      mbtiles: 'test.mbtiles',
      s3Bucket: 'test.bucket.com'
    });

    mbtiles3.should.have.property('mbtiles', 'test.mbtiles');
    mbtiles3.should.have.property('s3Bucket', 'test.bucket.com');
    done();
  });

  it('generates a valid tile queue for upload', function(done) {
    var mbtiles3 = new Mbtiles3({
      mbtiles: 'test.mbtiles',
      s3Bucket: 'test/test.bucket.com'
    });

    mbtiles3.createQueue(function(err, queue) {
      queue.should.have.property('length', 342);
      done();
    });
  });

});
