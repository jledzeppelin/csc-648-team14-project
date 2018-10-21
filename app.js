/**
 * @file app.js
 * @description This is the controller for the ExpressJS application. It accepts HTTP requests and passes them on to the
 * business layer
 *
 */
const express = require('express')
const app = express()

const SETTINGS = require('./settings')
const business = require('./business')


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
    let post = business.getPost(id)
    res.json(post);

});

/**
 * @description Initializes the application to listen on the HTTP port
 */
app.listen(port, () => {
    console.log('Server running on port ' + port)
})