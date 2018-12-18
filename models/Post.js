const BaseModel = require('./BaseModel')
const RegisteredUser = require('./RegisteredUser')
const Message = require('./Message')

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

    get registered_user(){
        return this._registered_user
    }
    set registered_user(value){
        this._registered_user = value
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

    static getAllPending() {
        let sql = `SELECT * FROM ${this.__TABLE} LEFT JOIN registered_user ON post.user_id = registered_user.id WHERE post_status = "pending"`
        return super.getMultipleBySQL(Post, sql)
    }

    static changeStatus(post_id, status) {
        let attribute = "post_status"
        return super.updateSingleRecordByID(Post, post_id, attribute, status)
    }

    /**
     * @description Inserts new post to db
     * @returns {Promise} A confirmation of the new post being added
     * @author Juan Ledezma
     */
    static insertNewRecord(newPost) {
        let result = super.insertNewRecord(Post, newPost)
        return result
    }

    /**
     * @description Grab a sigle post matching the id from the database
     * @returns {Promise} A post with the data matching the id in the database
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static getSingleRowById(id){
        return super.getSingleRowById(Post, {id:id, table2:"registered_user", table1_col:"user_id", table2_col:"id"})
    }

    /**
     * @description getImageLocations returns the post of all images location
     * @returns all image locations stored in a array "imageLocations" || an empty array if no images
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    getImageLocations(){
            var imageLocations = []
            for(var i =1; i<=this.number_of_images;i++) imageLocations.push(`/images/posts/${this.id}-${i}.jpg`)
            // console.log("imageLocations: ", imageLocations)
            return imageLocations
    }

    /**
     * @description getThumbnail returns the post of all images thumbnail URL
     * @returns all image thumbnail URL locations stored in a array "thumbnailURL" || an empty array if no images
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    getThumbnailURL(){
        var thumbnailURL = []
        for(var i =1; i<=this.number_of_images;i++) thumbnailURL.push(`/images/posts/${this.id}-${i}t.jpg`)
        // console.log("thumbnailURL: ", thumbnailURL)
        return thumbnailURL
    }
    /**
     * @descirption Returns posts under the specified user id, with messages attached
     * @param user_id {Number} The user ID
     * @author Jack Cole jcole@mail.sfsu.edu
     */
    static getUserPosts(user_id){
        let userPosts = super.getMultipleByFilters(Post, {
            filters : [`user_id = '${user_id}'`],
            sort: "create_date",
            direction: "DESC",})
        return userPosts
    }


    /**
     * @descirption Returns recent approved Posts
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    static getLatestApprovedPosts(){
        let latestApprovedPost = super.getMultipleByFilters(Post, {
            filters : ["post_status = 'approved'"],
            sort: "create_date",
            direction: "DESC",
            table2:"registered_user",
            table1_col:"user_id",
            table2_col:"id"} )
        return latestApprovedPost
    }

    /**
     * @description Convert the result from the DB to a new Post object
     * @param result {object} The result from the Database.
     * @returns {Post} The instantiated Post object
     * @author Jack Cole jcole2@mail.sfsu.edu
     * @author Ryan Jin
     */
    static objectMapper(result){
        let newPost = new Post()

        if(typeof result.registered_user !== "undefined"){
            try{
                let newRegisteredUser = new RegisteredUser()
                newRegisteredUser.first_name = result.registered_user.first_name
                newRegisteredUser.id = result.registered_user.id
                newPost.registered_user = newRegisteredUser
            }catch(e){
                console.error(result, e)
            }
        }

        // Take all the values and put them in the new object
        newPost.id = result.post.id

        newPost.category_id = result.post.category_id
        newPost.create_date = result.post.create_date
        newPost.post_title = result.post.post_title
        newPost.post_description = result.post.post_description
        newPost.post_status = result.post.post_status
        newPost.price = result.post.price
        newPost.is_price_negotiable = result.post.is_price_negotiable
        newPost.last_revised = result.post.last_revised
        newPost.number_of_images = result.post.number_of_images
        return newPost
    }

    /**
     * @description This is what will be returned when converting the object to JSON.
     * @returns {{id: *, user_id: *, category_id: *, create_date: *, post_title: *, post_description: *, post_status: *, price: *, is_price_negotiable: *, last_revised: *, number_of_images: *, image_location: *}}
     * @author Jack Cole jcole2@mail.sfsu.edu
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     */
    toJSON() {
        return {
            id: this.id,
            registered_user : this.registered_user,
            category_id : this.category_id,
            create_date : this.create_date,
            post_title : this.post_title,
            post_description : this.post_description,
            post_status : this.post_status,
            price : this.price,
            is_price_negotiable : this.is_price_negotiable,
            last_revised : this.last_revised,
            number_of_images : this.number_of_images,
            image_location : this.getImageLocations(),
            thumbnail_URL : this.getThumbnailURL()
        }
    }


}

// Required. This specifies what will be imported by other files
module.exports = Post
