[![Build Status](https://travis-ci.org/cspanring/mbtiles3.svg)](https://travis-ci.org/cspanring/mbtiles3)

# mbtiles3

Upload MBTiles as ZXY tile schema to S3.


## Installation

    $ npm install mbtiles3


## Usage

    var MBtiles3 = require('../');

    var mbtiles = new MBtiles3({
      mbtiles: 'mytiles.mbtiles',
      s3Bucket: 'tilebucket.example.com'
    });
    mbtiles.upload();

### CLI version

    $ mbtiles3 -b tilebucket.example.com mytiles.mbtiles

    Usage: mbtiles3 [options] mbtiles_file

    Options:

    -b, --bucket [bucket name]       S3 bucket
    -d, --directory [directory name] Directory in S3 bucket to store tiles in
    -c, --cache [Cache-Control]      HTTP Cache-Control header for tiles
    -v, --verbose                    Verbose, show upload log information
    -h, --help                       Output usage information

## Notes

* Currently mbtiles3 is only tested with and supports JPEG or PNG tiles.
* mbtiles3 uses [aws-sdk] and expects access credentials to be configured as environment variables. Please consult the [AWS SDK documentation] for configuration details.


## License

MBtiles3 is [MIT Licensed].


[aws-sdk]: https://github.com/aws/aws-sdk-js
[AWS SDK documentation]: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_Environment_Variables
[MIT Licensed]: https://github.com/cspanring/mbtiles3/blob/master/LICENSE
