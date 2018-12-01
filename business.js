const Post = require('./models/Post.js')
const RegisteredUser = require('./models/RegisteredUser.js')
const Category = require('./models/Category')
const Message = require('./models/Message.js')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')

const THUMBNAIL = {height:200, width:200}
const IMAGE_SIZE_LIMIT = 2000000 // 2MB
const SETTINGS = require('./settings')

//****** IMAGE UPLOAD *********
//Could put inside a class

/**
 * @description Defines the storage destination and filename for uploaded images
 * @author Juan Ledezma
 */
const storage = multer.diskStorage({
    destination: './images/posts/',
    filename: function(req, file, callback) {
        callback(null, req.query.post_id + '-' + req.query.image_number + path.extname(file.originalname));
    }
});

/**
 * @description Configures the multer upload middleware
 * @author Juan Ledezma
 */
const upload = multer({
    storage: storage,
    limits: {fileSize: IMAGE_SIZE_LIMIT},
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).single('postImage'); //name in form

/**
 * @description Checks the file type of the file to be uploaded
 * @param  file File to be checked 
 * @param callback Function to be called 
 * @author Juan Ledezma
 */
function checkFileType(file, callback) {
    //file types to allow
    const filetypes = /jpeg|jpg|png/;
    //check file extension
    const extname = filetypes.test(path.extname(file.originalname));
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname){
        return callback(null, true);
    } else {
        callback("Error, can only upload images!")
    }
}
//****** IMAGE UPLOAD END *********


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
        let user = await RegisteredUser.authenticateUser(email, login_password).catch(function(err){
            console.error(`Business.loginUser() error: ${err}`)
        })
        return user
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
     * @param name {String} Search input. Max length of 40 alpha numeric characters.
     * @param category {Number} Search by category (category_id)
     * @param page {Number} Search results in a given page
     * @param sort {String} Sort results by price or newest first, default is by increasing price
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     * Jack Cole jcole2@mail.sfsu.edu
     * Ryan Jin
     */
    static async searchPosts(name , category , page , sort){
        category = parseInt(category)
        page = parseInt(page)
        let sort_column = Business.DEFAULT_SORT
        let sort_desc = Business.DEFAULT_SORT_DESCENDING
        let valid_search = /^([a-z0-9A-Z]{0,40})$/.test(name)

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
        if(valid_search === false)
        {
            console.error( `Invalid argument for controller.searchPosts() "${name}". Must be a valid search input`)
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

    /**
     * @description Sends a message to a specific post_id
     * @param messageInfo - contains all message info including post_id, message, date created and last date revised
     * @returns {Post}
     * @author Ryan Jin
     */
    static async sendMessage(messageInfo){
        let message = await Message.insertNewRecord(messageInfo).catch(function(err){
            console.error(`Business.sendMessage() error: ${err}`)
        })

        return message
    }

    /**
     * @description Gets all the messages for a specific post_id
     * @param post_id - contains all message info including post_id, message, date created and last date revised
     * @returns {Post}
     * @author Ryan Jin
     */
    static async getMessage(post_id){
        let getMessage = Message.getMessage(post_id).catch(function(err){
            console.error(`Business.getMessage() error: ${err}`)
        })

        return getMessage
    }

    static uploadImage(req, res){
        upload(req, res, (err) => {
            if (err) {
                console.log(err)
                res.json({success:false})
            } else {
                if (req.file == undefined) {
                    console.log("Error: no file selected")
                    res.json({success:false})
                } else {
                    let filePath = `images/posts/${req.file.filename}`
                    let thumbailPath =  `images/posts/${req.query.post_id}-${req.query.image_number}t` +
                    path.extname(req.file.filename)
    
                    //creating thumbnail
                    sharp('./'+filePath)
                        .resize(THUMBNAIL.width, THUMBNAIL.height)
                        .toFile('./'+thumbailPath, function (err, info) {
                            if (err) throw err;
                            console.log(info);
                        });
    
                    res.json({
                        sucess: true,
                        file: filePath,
                        thumbail: thumbailPath
                    });
                }
            }
        });
    }


}


/**
 * @description Resizes and reformats an image 
 * @param path The location of the image 
 * @param format The format to transform the image to 
 * @param width Width to resize
 * @param height Height to resize
 * @author Juan Ledezma
 */
//Currently not used
function resize(path, format, width, height) {
    let transform = sharp(path);

    //convert to provided format
    if (format) {
        transform = transform.toFormat(format)
    }

    //resize to thumbnail size
    if (width || height) {
        transform = transform.resize(width, height);
    }

    //create new thumbnail
    transform.toFile('/images/posts/test.jpg', function (err, info) {
        if (err) throw err;
        console.log(info);
    });
}

// Required. This specifies what will be imported by other files
module.exports = Business