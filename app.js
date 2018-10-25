/**
 * @file app.js
 * @description This is the controller for the ExpressJS application. It accepts HTTP requests and passes them on to the
 * business layer
 *
 */


const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const mustache = require('mustache-express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')

nunjucks.configure('views', {
  autoescape: true,
  express: app,

});

const SETTINGS = require('./SETTINGS')
const Business = require('./business')

const VIEWS_PATH = path.join(__dirname, '/views')
const STATIC_PATH = path.join(__dirname, '/static')


let port = SETTINGS.web.port

/**
 * @description Serve static routes in static directory
 * @author  Juan
 *          Jack Cole jcole2@mail.sfsu.edu
 */
app.use('/static',express.static(STATIC_PATH))

/**
 * @description Returns the full details of a single post based on its id.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/api/post/:id',async function(req, res){
    let id = req.params.id
    let post = await Business.getPost(id).catch(function(err){
      console.error(err)
      return {};
    })
    res.json(post)

});


/**
 * @description Returns all post corresponding to category_id
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 */
app.get('api/category/:category_id',async function(req,res){
    let category_id = req.params.category_id
    let Category = await Business.getCategory(category_id).catch(function(err){
        console.error(err)
        return {};
    })
    res.json(Category);
});


/**
 * @description Returns all recent approved post
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 */
app.get('api/post/recent',async function(req,res){
    let latestApprovedPost = await Business.getLatestApprovedPost().catch(function(err){
        console.error(err)
        return {};
    })
    res.json(latestApprovedPost)
});


/**
 * @description Returns search results
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 */
app.get('/api/post/search/:name/:category/:page/:sort',async function (req,res){
    let name = req.params.name
    let category = req.params.category
    let page = req.params.page
    let sort = req.params.sort

    let searchResults = await Business.searchPosts(name, category, page, sort).catch(function(err){
        console.error(err)
        return {};
    })
    res.json(searchResults)
});

//register/authenticate
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.post('/api/register', async function (req, res){
    var newUser={
        "first_name":req.body.first_name,
        "last_name":req.body.email,
        "email":req.body.email,
        "login_password":req.body.login_password,
        "is_banned":0
    }

    let registeredUser = await Business.registerUser(newUser).catch(function(err){
        console.error(err)
        return {};
    })

    res.json(registeredUser)
})

app.post('/api/login', async function (req,res){
    //TODO
})


// -------------- PAGES -------------- //

// Mustache engine setup to read HTML files
app.set('view engine', 'njk');
app.set('views', VIEWS_PATH);

/**
 * @description Reads the page and returns its contents as a string.
 * e.g. getPage('index') returns the contents of views/
 * @param name {String} The file name of the page, without the extension
 * @returns {String} The contents of the file
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
function getPage(name){
  return fs.readFileSync(`${VIEWS_PATH}/pages/${name}.html`, 'utf8')
}

/**
 * @description Home page of site. Uses index page to render.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/',function(req, res){
  res.render('index');
})

/**
 * @description Search page. Requires a name, page, and sort in the arguments of the URL.
 * e.g. /search/giraffe/1/pricedesc
 * Uses search page to render.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/search/:name/:page/:sort',function(req, res) {
  let name = req.params.name
  let page = req.params.page
  let sort = req.params.sort
  res.render('search', {
    name: name,
    page: page,
    sort: sort,
  })
})

app.get('/search/',function(req, res) {
  res.render('search')
})





/**
 * @description Initializes the application to listen on the HTTP port
 */
app.listen(port, () => {
    console.log('Server running on port ' + port)
})