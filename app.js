/**
 * @file app.js
 * @description This is the controller for the ExpressJS application. It accepts HTTP requests and passes them on to the
 * business layer
 *
 */


const path = require('path')
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

nunjucks.configure('views', {
  autoescape: true,
  express: app,

});

const SETTINGS = require('./settings')
const Business = require('./business')

const VIEWS_PATH = path.join(__dirname, '/views')
const STATIC_PATH = path.join(__dirname, '/static')
const IMAGE_PATH = path.join(__dirname, '/images')

let port = SETTINGS.web.port

// initialize body-parser to parse requests to req.body
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//********* SESSIONS *********
// initialize cookie-parser for access to cookies stored in browser
app.use(cookieParser())

// initialize express-session to track logged-in users
app.use(session({
    key: "user_session_id",
    secret: "gator_trader_ses", //replace with a random string
    resave: false,
    saveUninitialized: false,
    cookie: {expires: 600000}
}));

// log user out if cookie is saved in browser but user is not set
app.use(function(req, res, next) {
    if (req.cookies.user_session_id && !req.session.user_id) {
        res.clearCookie("user_session_id")
    }
    next()
})

//check for logged-in user
let checkSession = function(req, res, next) {
    if (req.session.user_id && req.cookies.user_session_id) {
        res.redirect('/account')
    } else {
        next()
    }
} 

//********* SESSIONS END *********

// -------
// -------
// APIs
// -------
// -------

/**
 * @description Returns all recently approved Posts
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 */
app.get('/api/post/recent',async function(req,res){
    let latestApprovedPost = await Business.getLatestApprovedPost()
    res.json(latestApprovedPost)
});

/**
 * @description Returns Posts based on queries passed in. The queries are "name", "category", "page", "sort"
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 * Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/api/post/search',async function (req,res){
    let name = req.query.name
    let category = req.query.category
    let page = req.query.page
    let sort = req.query.sort

    let searchResults = await Business.searchPosts(name, category, page, sort)
    res.json(searchResults)
});

/**
 * @description Returns the full details of a single post based on its id.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/api/post',async function(req, res){
    let id = req.query.id
    let post = await Business.getPost(id)
    res.json(post)
});


/**
 * @description Returns all Categories
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 */
app.get('/api/categories',async function(req,res){
    let allCategories = await Business.getAllCategories()
    res.json(allCategories)
});


/**
 * @description Creates a post
 * @author Juan Ledezma
 */
app.post('/api/post/create', async function(req,res){
    let dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var newPost={
        "user_id":req.body.user_id,
        "category_id":req.body.category_id,
        "post_title":req.body.post_title,
        "post_description":req.body.post_description,
        "post_status":"pending",
        "price":req.body.price,
        "price_is_negotiable":req.body.price_is_negotiable,
        "last_revised":dateTime,
        "create_date":dateTime,
        "number_of_images":req.body.number_of_images
    }

    let post = await Business.createPost(newPost)
    res.json(post)
});


/**
 * @description Registers a new user, returns a confirmation
 * @author Juan Ledezma
 */
app.post('/api/register', async function(req, res){
    var newUser={
        "first_name":req.body.first_name,
        "last_name":req.body.last_name,
        "email":req.body.email,
        "login_password":req.body.login_password,
        "is_banned":0
    }

    let registeredUser = await Business.registerUser(newUser)
    res.json(registeredUser)
});

/**
 * @description Login for registered user, returns a confirmation
 * @author Juan Ledezma
 */
app.post('/api/login', async function(req, res){
    let email = req.body.email
    let login_password = req.body.login_password

    let userLogin = await Business.loginUser(email, login_password)

    /*
    if ("user_id" in userLogin) {
        req.session.user_id = userLogin.user_id
        res.redirect("/") //maybe redirect to account
    } else {
        res.json(userLogin)
    }
    */

    // TO DO: include account_type
    if ("user_id" in userLogin) {
        req.session.user_id = userLogin.user_id
        //console.log(req.session.user_id)
    }
    res.json(userLogin)
});

app.get('/api/logout', function(req, res){
    if (req.session.user_id && req.cookies.user_session_id) {
        res.clearCookie("user_session_id")
        res.redirect("/")
    } else {
        res.redirect("/login")
    }
})

/**
 * @description Uploads an image for a post and generates a thumbnail
 * @author Juan ledezma
 */
app.post('/api/post/fileUpload', function (req, res){
    return newImage = Business.uploadImage(req, res)
});

/**
 * @description Returns all the messages for a specific post that the user owns, returns messages.njk
 * @author Ryan Jin
 */
app.get('api/message/read', function(req, res){
    let post_id = req.query.post_id
    res.render('message',{
        post_id: post_id
    })
});

/**
 * @description Returns all the messages for a specific post that the user owns, returns messages.njk
 * @author Ryan Jin
 */
app.post('api/message/send', async function(req, res){
    let dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

    var messageInfo = {
        "post_id":req.body.post_id,
        "message":req.body.message,
        "initial_send_date":dateTime,
        "last_revised":dateTime
    }

    let sendMessage = await Business.sendMessage(messageInfo)
    res.json(sendMessage)
});

// -------
// -------
// PAGES
// -------
// -------

app.set('view engine', 'njk');
app.set('views', VIEWS_PATH);

/**
 * @description Home page of site. Renders index.njk
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/',function(req, res){
    let user_id = req.session.user_id
    res.render('index', {user_id:user_id});
})


/**
 * @description Search page. Renders search.njk
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/search',function(req, res) {
    let name = req.query.name
    let page = req.query.page
    let sort = req.query.sort
    res.render('search', {
        name: name,
        page: page,
        sort: sort,
    })
})

/**
 * @description About Page, returns about.njk
 * @author Ryan Jin
 */
app.get('/about', function(req, res){
    let user_id = req.session.user_id
    res.render('about', {user_id:user_id});
})

/**
 * @description Admin Page, returns admin.njk
 * @author Ryan Jin
 */
app.get('/admin', function(req, res){
    // TO DO: only admin 
    res.render('admin');
})

/**
 * @description User Page with ID, returns user.njk
 * @author Ryan Jin
 */
app.get('/user', function(req, res){
    let user_id = req.session.user_id
    res.render('user', {user_id:user_id})
})

/**
 * @description Login Page, returns login.njk
 * @author Ryan Jin
 */
app.get('/login', checkSession, function(req, res){
    res.render('login')
})

/**
 * @description Register Page, returns register.njk
 * @author Ryan Jin
 */
app.get('/register', checkSession, function(req, res){
    res.render('register');

})

/**
 * @description Create a post Page, returns createpost.njk
 * @author Ryan Jin
 */
app.get('/createpost', function(req, res){
    let user_id = req.session.user_id
    res.render('createpost', {user_id:user_id});
})

/**
 * @description Post Confirmation Page, returns postconfirm.njk
 * @author Ryan Jin
 */
app.get('/postconfirm', function(req, res){
    let user_id = req.session.user_id
    res.render('postconfirm', {user_id:user_id});
})

/**
 * @description Post Page with ID, returns post.njk
 * @author Ryan Jin
 */
app.get('/post', function(req, res){
    let user_id = req.session.user_id
    res.render('post', {
        id: id,
        user_id: user_id
    })
})


/**
 * @description User Account Page, returns account.njk
 * @author XiaoQian Huang
 * xhuang8@mail.sfsu.edu
 */
app.get('/account', function(req, res){
    if (req.session.user_id && req.cookies.user_session_id) {
        res.render('account', {user_id:req.session.user_id});
    } else {
        res.redirect('/login')
    }
})

/**
 * @description Help Page, returns help.njk
 * @author XiaoQian Huang
 * xhuang8@mail.sfsu.edu
 */
app.get('/help', function(req, res){
    let user_id = req.session.user_id
    res.render('help', {user_id:user_id});
})


app.get('/contact', function(req, res){
    let post_id = req.query.post_id
    let user_id = req.session.user_id

    res.render('contact', {
        post_id:post_id,
        user_id:user_id,
    });


})


// -------
// -------
// STATIC
// -------
// -------

/**
 * @description Serves static routes in static directory
 * @author  Juan
 *          Jack Cole jcole2@mail.sfsu.edu
 */
app.use('/static',express.static(STATIC_PATH))

/**
 * @description Serves images from the image directory
 * @author     Jack Cole jcole2@mail.sfsu.edu
 */
app.use('/images',express.static(IMAGE_PATH))

/**
 * @description Initializes the application to listen on the HTTP port
 */
app.listen(port, () => {
    console.log('Server running on port ' + port)
})