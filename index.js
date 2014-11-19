var MBTiles = require('mbtiles'),
    AWS = require('aws-sdk'),
    path = require('path'),

    s3 = new AWS.S3();


// opts = {
//   mbtiles: <relative path to mbtiles>,           /* required */
//   s3Bucket: <S3 Bucket>,                         /* required */
//   s3Directory: <S3 directory>                    /* optional */
//   s3CacheControl: <S3 HTTP Cache-Control header> /* optional */
//   verbose: <verbosity>                           /* optional */
// }
function Mbtiles3(opts) {
  var options = opts || {};

  if (!(this instanceof Mbtiles3)) {
    return new Mbtiles3(opts);
  }

  if (!options.mbtiles || !options.s3Bucket) {
    throw new Error('Requires mbtiles file and S3 Bucket name.');
  }

  this.mbtiles = path.resolve(options.mbtiles);
  this.s3Bucket = options.s3Bucket;
  this.s3Directory = options.s3Directory || path.basename(this.mbtiles).split('.')[0];
  this.s3CacheControl = options.s3CacheControl || 'max-age=86400, public';

  this.fileExtension = {
    'image/png': '.png',
    'image/jpeg': '.jpg'
  };

  this.verbose = options.verbose || false;

  return this;
}


Mbtiles3.prototype.openDb = function(callback) {
  return new MBTiles(this.mbtiles, function(err, tiles) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, tiles);
    }
  });
};


Mbtiles3.prototype.createQueue = function(callback) {

  this.openDb(function(err, tiles) {
    var zxyStream,
        output = '';

    if (err) {
      callback(err);
    }

    this.tiles = tiles;
    zxyStream = tiles.createZXYStream();

    zxyStream.on('data', function(lines) {
      output += lines;
    });

    zxyStream.on('end', function() {
      var queue = output.toString().split('\n');
      callback(null, queue);
    }.bind(this));

  }.bind(this));
};


Mbtiles3.prototype.uploadQueue = function(queue) {
  var zxy;

  if (!queue.length) {
    return;
  }

  zxy = queue.shift();
  if (!zxy) {
    return this.uploadQueue(queue);
  }

  zxy = zxy.split('/');

  this.tiles.getTile(zxy[0], zxy[1], zxy[2], function(err, buffer, headers) {
    var s3Key = this.s3Directory + '/' + zxy.join('/') + this.fileExtension[headers['Content-Type']],
    params = {
      Bucket: this.s3Bucket,
      Key: s3Key,
      ContentType: headers['Content-Type'],
      ACL: 'public-read',
      CacheControl: this.s3CacheControl,
      Body: buffer
    };

    s3.putObject(params, function(err) {
      if (err) {
        throw err;
      }

      if (this.verbose) {
        console.log('Uploaded ' + this.s3Bucket + '/' + this.s3Directory + '/' + zxy.join('/') + this.fileExtension[headers['Content-Type']]);
      }

    }.bind(this));

    this.uploadQueue(queue);
  }.bind(this));
};


// Helper alias
Mbtiles3.prototype.upload = function () {
  this.createQueue(function(err, queue) {
    this.uploadQueue(queue);
  }.bind(this));
};

module.exports = Mbtiles3;
