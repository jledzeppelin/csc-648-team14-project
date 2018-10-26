const Post = require('./models/Post.js')
const SETTINGS = require('./SETTINGS')


/**
 * @description This is the business layer of the application. It will process the request and return the data.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
class Business{

    /**
     * @description Returns the full details of a single post based on its id.
     * @param id The id of the post as it appears in the database.
     * @returns {Post}
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static async getPost(id){
        // Convert to integer and check to see if valid
        id = parseInt(id)
        if(!Number.isInteger(id))
            throw `Invalid argument for controller.getPost() "${id}". Must be an integer`

        // Create the Post object
        let post = await Post.getSingleRowById(id).catch(function(err){
          console.error(`Business.getCategory() error: ${err}`)
        })

        return post

    }

    //return the details of the new user that was created
    static registerUser(newUser){
        //do some validation (email) here, or frontend?
        let user = RegisteredUser.createNewUser(newUser)
        return user
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

    /**
     * @description Returns search results
     * @param name {String} -
     * @param category {String} -
     * @param page {String} -
     * @param sort {String} -
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     * Jack Cole jcole2@mail.sfsu.edu
     */

    static async searchPosts(name , category , page , sort){
        category = parseInt(category)
        page = parseInt(page)

        if(!Number.isInteger(category))
        {
            console.error(`Invalid argument for controller.searchPosts() "${category}". Must be an integer`)
            return []
        }
        if(!Number.isInteger(page))
        {
            console.error( `Invalid argument for controller.searchPosts() "${page}". Must be an integer`)
            return []
        }
        if(name.length < 3)
        {
            console.error( `Invalid argument for controller.searchPosts() "${name}". Must 3 characters or longer`)
            return []
        }

        let filters = [
           `post_title LIKE '%${name}%'`,
        ]

        // If category is not 0, then apply category filter
        if(category !== 0)
            filters.push(`category_id = '${category}'`)

        // Creates Post Object
        let searchResults = await Post.getMultipleByFilters(Post, filters, page, sort).catch(function(err){
            console.error(`Business.getCategory() error: ${err}`)
        })
        return searchResults
    }

    /**
     * @description
     * @param
     * @returns
     * @author Ryan Jin
     */
    static createPost(title, description, category, image){

        let createPost = new Post()
        createPost.title = title
        createPost.description = description
        createPost.category = cateogry
        createPost.image = image
        let response = createPost.insert()
        // Post.createPost(title, description, category, image)

        return response
    }
}

// Required. This specifies what will be imported by other files
module.exports = Business