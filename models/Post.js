const BaseModel = require('./BaseModel')

/**
 * @description The model for a Post. It inherits the BaseModel's generic functionality.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
class Post extends BaseModel{

    get id(){
        return this.__id
    }

    set id(id){
        this.__id = id
    }

    get user_id(){
        return this._user_id
    }
    set user_id(value){
        this._user_id = value
    }

    get category_id() {
        return this._category_id
    }
    set category_id(value) {
        this._category_id = value
    }

    get last_revised() {
        return this._last_revised
    }

    set last_revised(value) {
        this._last_revised = value
    }
    get is_price_negotiable() {
        return this._is_price_negotiable
    }

    set is_price_negotiable(value) {
        this._is_price_negotiable = value
    }
    get price() {
        return this._price
    }

    set price(value) {
        this._price = value
    }
    get post_status() {
        return this._post_status
    }

    set post_status(value) {
        this._post_status = value
    }
    get post_description() {
        return this._post_description
    }

    set post_description(value) {
        this._post_description = value
    }
    get post_title() {
        return this._post_title
    }

    set post_title(value) {
        this._post_title = value
    }
    get create_date() {
        return this._create_date
    }

    set create_date(value) {
        this._create_date = value
    }

    get number_of_images() {
        return this._number_of_images
    }

    set number_of_images(value){
        this._number_of_images = value
    }

    constructor(){
        super()
    }

    /**
     * @description The table in the database that Post is stored in.
     * @returns {string} The table name
     * @private
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static get __TABLE(){return "post"}


    /**
     * @description Grab a sigle post matching the id from the database
     * @returns {Promise} A post with the data matching the id in the database
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static getSingleRowById(id){
        return super.getSingleRowById(Post, {id:id})
    }


    /**
     * @descirption Returns recent approved Posts
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    static getLatestApprovedPosts(){
        let latestApprovedPost = super.getMultipleByFilters(Post, {sort: "create_date"} )
        return latestApprovedPost
    }

    /**
     * @description Returns search results
     * @param name -
     * @param category -
     * @param page -
     * @param sort -
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */

    static searchPosts(name,category,page,sort){
        let sql = `SELECT * FROM ${this.__TABLE} WHERE `
        let searchResults = super.getMultipleBySQL(Post, )
        return searchResults
    }

    /**
     * @description
     * @param title
     * @param description
     * @param category
     * @param image
     * @author Ryan Jin
     */
    static createPost(title, description, category, image){
        let newPost = super.createPost(title, description, category, image, Post)
        return newPost
    }

    /**
     * @description Convert the result from the DB to a new Post object
     * @param result {object} The result from the Database.
     * @returns {Post} The instantiated Post object
     * @author Jack Cole jcole2@mail.sfsu.edu
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
        newPost.number_of_images = result.number_of_images

        return newPost
    }

    /**
     * @description This is what will be returned when converting the object to JSON.
     * @returns {{id: *, user_id: *, category_id: *, create_date: *, post_title: *, post_description: *, post_status: *, price: *, is_price_negotiable: *, last_revised: *}}
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    toJSON() {
        return {
            id: this.id,
            user_id : this.user_id,
            category_id : this.category_id,
            create_date : this.create_date,
            post_title : this.post_title,
            post_description : this.post_description,
            post_status : this.post_status,
            price : this.price,
            is_price_negotiable : this.is_price_negotiable,
            last_revised : this.last_revised,
            number_of_images : this.number_of_images,
        }
    }


}

// Required. This specifies what will be imported by other files
module.exports = Post
