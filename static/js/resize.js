const fileSystem = require('fs')
const sharp = require('sharp')

function resize(path, format, width, height) {
    const readStream = fileSystem.createReadStream(path)
    let transform = sharp()

    if (format) {
        transform = transform.toFormat(format)
    }

    if (width || height) {
        transform = transform.resize(width, height);
    }

    return readStream
}

module.exports = resize