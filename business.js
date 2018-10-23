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

    /**
     * @description Returns all post corresponding to category_id
     * @param category_id - id of category
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    static getCategory(category_id){
        // Convert to integer and check to see if valid
        category_id = parseInt(category_id)
        if(!Number.isInteger(category_id))
            throw `Invalid argument for controller.getPost() "${category_id}". Must be an integer`

        // Create the Post Object
        let Category = Post.getCategory(category_id)
        return Category

    }

    /**
     * @description Returns all recent approved post
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */

    static getLatestApprovedPost(){
        //Creates Post Object
        let lastestApprovedPost = Post.getLatestApprovedPost()
        return lastestApprovedPost
    }

}

// Required. This specifies what will be imported by other files
module.exports = Business