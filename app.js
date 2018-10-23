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

const SETTINGS = require('./settings')
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
app.get('/api/post/:id',function(req, res){
    let id = req.params.id
    let post = Business.getPost(id)
    res.json(post);

});



// -------------- PAGES -------------- //

// Mustache engine setup to read HTML files
app.engine('html', mustache());
app.set('view engine', 'html');
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
  let index = getPage("index")
  res.render('template', {
      content: index
  })
})

/**
 * @description Search page. Requires a name, page, and sort in the arguments of the URL.
 * e.g. /search/giraffe/1/pricedesc
 * Uses search page to render.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/search/:name/:page/:sort',function(req, res) {
  let index = getPage("search")
  let name = req.params.name
  let page = req.params.page
  let sort = req.params.sort
  res.render('template', {
    content: index,
    name: name,
    page: page,
    sort: sort,
  })
})


/**
 * @description Initializes the application to listen on the HTTP port
 */
app.listen(port, () => {
    console.log('Server running on port ' + port)
})