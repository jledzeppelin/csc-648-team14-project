var settings = {}

settings.web = {}
settings.web.http_port = process.env.HTTP_PORT || 8080
settings.web.https_port = process.env.HTTPS_PORT || 8081

settings.db = {
    host     : "",
    user     : '',
    password : '',
    database : '',
}

settings.CAPTCHA_SECRET = ""

settings.PRIVATE_KEY = "privkey.pem"
settings.FULL_CHAIN = "fullchain.pem"

module.exports = settings