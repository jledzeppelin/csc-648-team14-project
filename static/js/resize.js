const sharp = require('sharp')

module.exports = function resize(path, format, width, height) {
    let transform = sharp(path);

    //convert to provided format
    if (format) {
        transform = transform.toFormat(format)
    }

    //resize to thumbnail size
    if (width || height) {
        transform = transform.resize(width, height);
    }

    //create new thumbnail
    transform.toFile('/images/posts/test.jpg', function (err, info) {
        if (err) throw err;
        console.log(info);
    });
}