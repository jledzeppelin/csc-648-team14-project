/**
 * @file app.js
 * @description This is the controller for the ExpressJS application. It accepts HTTP requests and passes them on to the
 * business layer
 *
 */
const express = require('express')
const app = express()

const SETTINGS = require('./settings')
const Business = require('./business')


let port = SETTINGS.web.port

/**
 * @description Serve static routes in static directory
 * @author Juan
 */
app.use(express.static('static'))

/**
 * @description Returns the full details of a single post based on its id.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/api/post/:id',function(req, res){
    let id = req.params.id
    let post = Business.getPost(id)
    res.json(post);

});

/**
 * @description Returns all post corresponding to category_id
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 */
app.get('api/category/:category_id',function(req,res){
    let category_id = req.params.category_id
    let Category = Business.getCategory(category_id)
    res.json(Category);
});

/**
 * @description Returns all recent approved post
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 */
app.get('api/post/recent',function(req,res){
    let latestApprovedPost = Business.getLatestApprovedPost()
    res.json(latestApprovedPost)
});

/**
 * @description Initializes the application to listen on the HTTP port
 */
app.listen(port, () => {
    console.log('Server running on port ' + port)
})