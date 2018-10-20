/**
 * @file app.js
 * @description This is the business layer of the application. It will process the request and return the data.
 * @authors Jack
 */
const settings = require('./settings')

// Instantiates the controller object
controller = {}

/**
 * @description Returns the full details of a single post based on its id.
 * @param id The id of the post as it appears in the database. Must be an integer.
 * @authors Jack
 */
controller.getPost = function(id){
    if(!Number.isInteger(id))
        throw `Invalid argument for controller.getPost() "${id}". Must be an integer`


}


module.exports = controller