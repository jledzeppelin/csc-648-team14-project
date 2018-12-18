var settings = {}

settings.web = {}
settings.web.port = process.env.PORT || 8080

settings.db = {
    host     : "",
    user     : "",
    password : "",
    database : "",
}

settings.CAPTCHA_SECRET = ""

module.exports = settings