const Post = require('./models/Post.js')
const SETTINGS = require('./settings')
const RegisteredUser = require('./models/RegisteredUser.js')
const Category = require('./models/Category')

/**
 * @description This is the business layer of the application. It will process the request and return the data.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
class Business{


    static get DEFAULT_SORT(){return "price"}
    static get DEFAULT_SORT_DESCENDING(){return false}

    /**
     * @description Returns the full details of a single based on its id.
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

    /**
     * @description Registers a new user, returns a confirmation
     * @param newUser Full details of a new user
     * @returns {RegisteredUser}
     * @author Juan Ledezma
     */
    static async registerUser(newUser){
        //TO DO: validation (email format, unique email), or done in form?
        let user = await RegisteredUser.insertNewRecord(newUser).catch(function(err) {
            console.error(`Business.registerUser() error: ${err}`)
        })
        return user
    }

    /**
     * @description Login for registered user, returns a confirmation
     * @param email User's email
     * @param login_password User's login password (encrypted)
     * @returns {RegisteredUser}
     * @author Juan Ledezma
     */
    static async loginUser(email, login_password){
        //TO DO: implement basemodel function to get user record by email, or use getMultipleByFilters?
    }

    /**
     * @description Returns all Categories
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    static async getAllCategories(){
        // Create the Category Object
        let allCategories = await Category.getAllCategories().catch(function(err){
            console.error(`Business.getAllCAtegories() error: ${err}`)
        })

        return allCategories
    }

    /**
     * @description Returns all recent approved post
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    static getLatestApprovedPost(){
        //Creates Post Object
        let lastestApprovedPost = Post.getLatestApprovedPosts().catch(function(err){
            console.error(`Business.getLatestApprovedPost() error: ${err}`)
        })

        return lastestApprovedPost
    }

    /**
     * @description Returns search results
     * @param name {String} Search input
     * @param category {Number} Search by category (category_id)
     * @param page {Number} Search results in a given page
     * @param sort {String} Sort results by price or newest first, default is by increasing price
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     * Jack Cole jcole2@mail.sfsu.edu
     */
    static async searchPosts(name , category , page , sort){
        category = parseInt(category)
        page = parseInt(page)
        let sort_column = Business.DEFAULT_SORT
        let sort_desc = Business.DEFAULT_SORT_DESCENDING

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

        if(sort !== "default")
        {
            sort_column = sort
        }

        let filters = [
           `post_title LIKE '%${name}%'`,
        ]

        // If category is not 0, then apply category filter
        if(category !== 0)
            filters.push(`category_id = '${category}'`)

        // Creates Post Object
        let searchResults = await Post.getMultipleByFilters(Post, {filters : filters, page: page, sort: sort_column, sort_desc: sort_desc})
            .catch(function(err){
            console.error(`Business.getCategory() error: ${err}`)
        })
        return searchResults
    }

    /**
     * @description Creates a new post, returns confirmation
     * @param newPost All details for a new post
     * @returns {Post}
     * @author Ryan Jin
     */
    static async createPost(newPost){
        // TO DO: validation? user exists in db
        let post = await Post.insertNewRecord(newPost).catch(function(err) {
            console.error(`Business.createPost() error: ${err}`)
        })

        return post
    }
}

// Required. This specifies what will be imported by other files
module.exports = Business