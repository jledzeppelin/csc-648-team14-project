/**
 * app.js
 * @description This is the controller for the ExpressJS application. It accepts HTTP requests.
 *
 */

const express = require('express')
const app = express()

const settings = require('./settings')
const business = require('./business')


let port = settings.web.port

/**
 * @description Serve static routes in static directory
 * @authors Juan
 */
app.use(express.static('static'))

/**
 * @description Returns the full details of a single post based on its id.
 * @authors Jack
 */
app.get('/api/post/:id/',function(req, res){

    let post = business.getPost(id)
    res.send(post);

});

app.listen(port, () => {
    console.log('Server running on port ' + port)
})