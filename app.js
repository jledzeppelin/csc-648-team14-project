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

nunjucks.configure('views', {
  autoescape: true,
  express: app,

});

const SETTINGS = require('./settings')
const Business = require('./business')
//const resize = require('./static/js/resize')

const VIEWS_PATH = path.join(__dirname, '/views')
const STATIC_PATH = path.join(__dirname, '/static')
const IMAGE_PATH = path.join(__dirname, '/images')

let port = SETTINGS.web.port

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

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
 * @author Ryan Jin
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
})

/**
 * @description Login for registered user, returns a confirmation
 * @author Juan Ledezma
 */
app.post('/api/login', async function(req, res){
    let email = req.body.email
    let login_password = red.body.login_password

    let userLogin = await Business.loginUser(email, login_password)
    res.json(userLogin)
})

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
  res.render('index');
})


/**
 * @description Search page. Renders search.njk
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/search/',function(req, res) {
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
    res.render('about');
})

/**
 * @description Admin Page, returns admin.njk
 * @author Ryan Jin
 */
app.get('/admin', function(req, res){
    res.render('admin');
})

/**
 * @description User Page, returns user.njk
 * @author Ryan Jin
 */
app.get('/user', function(req, res){
    res.render('user')
})

/**
 * @description User Page with ID, returns user.njk
 * @author Ryan Jin
 */
app.get('/user/', function(req, res){
    let id = req.query.id
    res.render('user',{
        id: id
    })
})

/**
 * @description Login Page, returns login.njk
 * @author Ryan Jin
 */
app.get('/login', function(req, res){
    res.render('login')
})

/**
 * @description Register Page, returns register.njk
 * @author Ryan Jin
 */
app.get('/register', function(req, res){
    res.render('register');

})

/**
 * @description Create a post Page, returns createpost.njk
 * @author Ryan Jin
 */
app.get('/createpost', function(req, res){
    res.render('createpost');
})

/**
 * @description Post Confirmation Page, returns postconfirm.njk
 * @author Ryan Jin
 */
app.get('/postconfirm', function(req, res){
    res.render('postconfirm');
})

/**
 * @description Post Page with ID, returns product.njk
 * @author Ryan Jin
 */
app.get('/post/', function(req, res){
    let id = req.query.id
    res.render('product', {
        id: id
    })
})

/**
 * @description User Account Page, returns account.njk
 * @author XiaoQian Huang
 * xhuang8@mail.sfsu.edu
 */
app.get('/account', function(req, res){
    res.render('account');
})

/**
 * @description Help Page, returns help.njk
 * @author XiaoQian Huang
 * xhuang8@mail.sfsu.edu
 */
app.get('/help', function(req, res){
    res.render('help');
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