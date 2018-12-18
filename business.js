const Post = require('./models/Post.js')
const RegisteredUser = require('./models/RegisteredUser.js')
const Category = require('./models/Category')
const Message = require('./models/Message.js')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const https = require("https");

const THUMBNAIL = {height:150, width:150}
const MAIN_IMAGE = {height:800, width:800}

const IMAGE_SIZE_LIMIT = 15000000 // 15MB
const SETTINGS = require('./settings')

//****** IMAGE UPLOAD *********

/**
 * @description Defines the storage destination and filename for uploaded images
 * @author Juan Ledezma
 */
const storage = multer.diskStorage({
    destination: './images/posts/',
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); //temporary name
    }
});

function verifyCaptcha(token, ip){

    var secret = SETTINGS.CAPTCHA_SECRET;
    // req.connection.remoteAddress will provide IP address of connected user.
    var verificationUrl =
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}&remoteip=${ip}`;
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    return new Promise((resolve, reject)=> {
        https.get(verificationUrl, function (http_res) {
            var data = "";

            http_res.on("data", function (chunk) {
                // append this chunk to our growing `data` var
                data += chunk;
            });

            http_res.on("end", function () {
                // you can use res.send instead of console.log to output via express
                try {
                    resolve(JSON.parse(data));
                }
                catch(e){
                    reject(e)
                }
            });
        })
    })
}


/**
 * @description Configures the multer upload middleware
 * @author Juan Ledezma
 */
const upload = multer({
    storage: storage,
    //limits: {fileSize: IMAGE_SIZE_LIMIT}, // maybe try {files: IMAGE_SIZE_LIMIT}
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }
}).array('postImages', 5); //name in form, 5 images max

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
          console.error(`Business.getPost() error: ${err}`)
        })

        return post

    }

    /**
     * @description returns all pending posts, for admin
     * @author Juan Ledezma
     */
    static async getAllPendingPosts() {
        let pendingPosts = await Post.getAllPending().catch(function(err) {
            console.error(`Business.getAllPendingPosts() error: ${err}`)
        })
        return pendingPosts
    }

    /**
     * @description Changes the status of a post
     * @param post_id 
     * @param status Either change to "approved" or "rejected"
     * @author Juan Ledezma
     */
    static async changePostStatus(post_id, status) {
        let statuses = new Set( ["pending","approved", "rejected"])
        if (!statuses.has(status)) {
            throw `Invalid argument in Business.changePostStatus():  ${post_id}. Must one of the following: ${Array.from(statuses)}`
        }

        let post = await Post.changeStatus(post_id, status).catch(function(err) {
            console.error(`Business.changePostStatus() error: ${err}`)
        })
        return post
    }

    /**
     * @description Registers a new user, returns a confirmation
     * @param newUser Full details of a new user
     *
     * @param ip {String} The IP address of the user registering
     * @param token {String} The recapcha token
     * @returns {RegisteredUser}
     * @author Juan Ledezma
     */
    static async registerUser(newUser, ip, token){
        let captchaResponse = await verifyCaptcha("abc", "192.168.1.1")

        if(captchaResponse.success !== true)
        {
            console.error(`Business.registerUser() error: invalid captcha ${captchaResponse['error-codes']}`)
            return
        }


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
     * @descirption Returns posts under the specified user id, with messages attached
     * @param user_id {Number} The user ID
     * @author Jack Cole jcole@mail.sfsu.edu
     */
    static async getUserPosts(user_id){

        user_id = parseInt(user_id)

        if(!Number.isInteger(user_id))
        {
            console.error(`Invalid argument for controller.getUserPosts() "${user_id}". Must be an integer`)
            return []
        }

        let userPosts = Post.getUserPosts(user_id).catch(function(err){
            console.error(`Business.getUserPosts() error: ${err}`)
        })


        return userPosts
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
     * @param direction {String} determines the direction of the posts
     * @author Anthony Carrasco acarras4@mail.sfsu.edu
     * Jack Cole jcole2@mail.sfsu.edu
     * Ryan Jin
     */
    static async searchPosts(name , category , page , sort, direction){
        category = parseInt(category)
        page = parseInt(page)
        let sort_column = Business.DEFAULT_SORT
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
           `post_title LIKE '%${name}%' AND post_status = 'approved'`,
        ]

        // If category is not 0, then apply category filter
        if(category !== 0)
            filters.push(`category_id = '${category}'`)

        // Creates Post Object
        let searchResults = await Post.getMultipleByFilters(Post, {filters : filters, page: page, sort: sort_column, direction: direction, table2:"registered_user", table1_col:"user_id", table2_col:"id"})
            .catch(function(err){
            console.error(`Business.getCategory() error: ${err}`)
        })
        return searchResults
    }

    /**
     * @description Creates a new post, returns confirmation
     * @param newPost All details for a new post
     * @param files {Array} An array of files to be saved to the server
     * @returns {Post}
     * @author Ryan Jin
     */
    static async createPost(newPost, files){
        // TO DO: validation? user exists in db

        let post = await Post.insertNewRecord(newPost).catch(function(err) {
            console.error(`Business.createPost() error: ${err}`)
        })
        // If successful, create the images
            .then(function(post){
                // Create each image
                for (let i = 0; i < files.length; i++) {
                    let file = files[i]
                    let location = `./images/posts/${post.data.insertId}-`

                    console.log("Generating Images")
                    // Thumbnail
                    sharp(file)
                        .resize({width: THUMBNAIL.width, height: THUMBNAIL.height, fit: "inside"})
                        .toFile(`${location}${(i+1)}t.jpg`, function (err, info) {
                            if (err)
                            {   console.error("Error generating thumbnail", err)
                                throw err;
                            }
                            console.log("Thumbnail successfully created for post",post.data.insertId, info);
                        });

                    // Main Image
                    sharp(file)
                        .resize({width: MAIN_IMAGE.width, height: MAIN_IMAGE.height, fit: "inside"}) //
                        .toFile(`${location}${(i+1)}.jpg`, function (err, info) {
                            if (err)
                            {
                                console.error("Error generating main image", err)
                                throw err;
                            }
                            console.log("Image successfully created for post",post.data.insertId, info);
                        });
                }
                return post
            }).catch(function(err){return {message:"Error creating images"}})
        return post
    }

    /**
     * @description Sends a message to a specific post_id
     * @param messageInfo - contains all message info including post_id, message, date created and last date revised
     * @returns {Message}
     * @author Ryan Jin
     */
    static async sendMessage(messageInfo){
        let message = await Message.insertNewRecord(messageInfo).catch(function(err){
            console.error(`Business.sendMessage() error: ${err}`)
        })

        return message
    }

    /**
     * @description Gets a single message for a specific message_id
     * @param message_id
     * @returns {Message}
     * @author Ryan Jin
     */
    static async getSingleMessage(message_id){
        let getMessage = Message.getSingleMessage(message_id).catch(function(err){
            console.error(`Business.getSingleMessage() error: ${err}`)
        })

        return getMessage
    }

    /**
     * @description Gets all the messages for a specific post_id
     * @param post_id
     * @param user_id
     * @param other_user_id
     * @returns {Message}
     * @author Ryan Jin
     * Jack Cole jcole2@mail.sfsu.edu
     */
    static async getAllMessages(post_id, user_id,other_user_id){
        user_id = parseInt(user_id)
        other_user_id = parseInt(other_user_id)
        post_id = parseInt(post_id)

        if(!Number.isInteger(user_id))
        {
            console.error(`Invalid argument for controller.getAllMessages() "${user_id}". Must be an integer`)
            return []
        }

        if(!Number.isInteger(post_id))
        {
            console.error(`Invalid argument for controller.getAllMessages() "${post_id}". Must be an integer`)
            return []
        }

        if(!Number.isInteger(other_user_id))
        {
            console.error(`Invalid argument for controller.getAllMessages() "${other_user_id}". Must be an integer`)
            return []
        }
        let getMessage = Message.getAllMessages(post_id, user_id, other_user_id).catch(function(err){
            console.error(`Business.getAllMessages() error: ${err}`)
        })

        return getMessage
    }

    /**
     * @description Gets all the latest messages for each post
     * @param user_id {String}
     * @returns {Message}
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static async getLatestMessages(user_id){

        user_id = parseInt(user_id)

        if(!Number.isInteger(user_id))        {
            console.error(`Invalid argument for controller.getLatestMessages() "${user_id}". Must be an integer`)
            return []
        }

        let getMessage = Message.getLatestMessages([user_id]).catch(function(err){
            console.error(`Business.getAllMessages() error: ${err}`)
        })

        return getMessage
    }

    /**
     * @description Uploads an image and its thumbnail to images/posts/
     * @param req 
     * @param res
     * @author Juan Ledezma 
     */
    static uploadImage(req, res){
        let result = {}
        upload(req, res, (err) => {
            if (err) {
                console.log(err)
                result.status = false
            } else {
                if (req.files == undefined) {
                    console.log("Error: no files selected")
                    result.status = false
                } else {
                    // create post first because the post id is needed for image name
                    let dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

                    let newPost={
                        "user_id":req.session.user.id,
                        "category_id":req.body.category_id,
                        "post_title":req.body.post_title,
                        "post_description":req.body.post_description,
                        "post_status":"pending",
                        "price":req.body.price,
                        "price_is_negotiable":req.body.price_is_negotiable,
                        "last_revised":dateTime,
                        "create_date":dateTime,
                        "number_of_images":req.body.number_of_images
                    }
                    // ************ post variable is undefined, dont know what to do ******************
                    let post = Business.createPost(newPost)
                    console.log("POST ID: " + post)

                    let filePaths = []
                    let thumbnailPaths = []
                    let i

                    for (i = 0; i < req.files.length; i++) {
                        // rename files to fit our format "post_id-image_number"
                        let newFileName = `${post.id}-${(i+1)}`
                        console.log("NEW FILE NAME: " + newFileName)
                        console.log("FILE PATH: " + req.files[i].path)
                        fs.rename(req.files[i].path, req.files[i].destination + newFileName + path.extname(req.files[i].filename), function(err){
                            if (err) {
                                console.log(err)
                            }
                        })

                        let filePath = `images/posts/${newFileName}`
                        let thumbnailPath = `images/posts/${newFileName}t` + path.extname(req.files[i].filename)
                        filePaths.push(filePath)
                        thumbnailPaths.push(thumbnailPath)

                        // creating thumbnail
                        sharp('./'+filePath)
                            .resize(THUMBNAIL.width, THUMBNAIL.height)
                            .toFile('./'+thumbnailPath, function (err, info) {
                                if (err) throw err;
                                console.log(info);
                            });
                    }

                    result.post = post
                    result.image = {
                        status:true,
                        files:filePaths,
                        thumbnails:thumbnailPaths
                    }
                    /*
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
    
                    result.success = true
                    result.file = filePath
                    result.thumbail = thumbailPath
                    */
                }
            }
        });
        return result
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