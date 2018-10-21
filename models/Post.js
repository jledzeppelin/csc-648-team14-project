const BaseModel = require('./BaseModel')

/**
 * @description The model for a Post. It inherits the BaseModel's generic functionality.
 * @authors Jack
 */
class Post extends BaseModel{

    constructor(){
        super()
    }


    /**
     * @description The table in the database that Post is stored in.
     * @returns {string} The table name
     * @private
     */
    get __TABLE(){return "post"}

    /**
     * @description Grab a sigle post matching the id from the database
     * @returns {Post} A post with the data matching the id in the database
     */
    static getSingleRowById(id){
        let result = super.getSingleRowById(id, Post)
        return result
    }

    /**
     * @description Convert the result from the DB to a new Post object
     * @param result {object} The result from the Database.
     * @returns {Post} The instantiated Post object
     */
    static objectMapper(result){
        let newPost = new Post()

        // Take all the values and put them in the new object
        newPost.id = result.id
        newPost.user_id = result.user_id
        newPost.category_id = result.category_id
        newPost.create_date = result.create_date
        newPost.post_title = result.post_title
        newPost.post_description = result.post_description
        newPost.post_status = result.post_status
        newPost.price = result.price
        newPost.is_price_negotiable = result.is_price_negotiable
        newPost.last_revised = result.last_revised

        return newPost
    }


}

// Required. This specifies what will be imported by other files
module.exports = Post
