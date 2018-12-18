var settings = {}

settings.web = {}
settings.web.http_port = process.env.PORT || 8080

settings.db = {
    host     : "",
    user     : "",
    password : "",
    database : "",
}

settings.CAPTCHA_SECRET = ""

settings.PRIVATE_KEY = "privkey.pem"
settings.FULL_CHAIN = "fullchain.pem"

module.exports = settings