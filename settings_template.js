var settings = {};

settings.web = {};
//add settings for db password

settings.web.port = process.env.PORT || 8080;

module.exports = settings;