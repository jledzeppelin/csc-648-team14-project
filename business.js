const Post = require('./models/Post.js')
const SETTINGS = require('./settings')


/**
 * @description This is the business layer of the application. It will process the request and return the data.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
class Business{

    /**
     * @description Returns the full details of a single post based on its id.
     * @param id The id of the post as it appears in the database.
     * @returns {Promise}
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static getPost(id){
        // Convert to integer and check to see if valid
        id = parseInt(id)
        if(!Number.isInteger(id))
            throw `Invalid argument for controller.getPost() "${id}". Must be an integer`

        // Create the Post object
        let post = Post.getSingleRowById(id)

        return post

    }
}

// Required. This specifies what will be imported by other files
module.exports = Business