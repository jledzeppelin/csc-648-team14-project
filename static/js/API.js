/**
 * @description This API allows the front end to communicate with the backend through simple functions.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
class GatorTraderAPI {

    /**
     * @description Grabs a list of posts from the database
     * @param name {string} The title of a post. Will do a partial match
     * @param category {String} The category ID. Set to 0 if looking through all categories
     * @param page {String} The page number. Starts at 1.
     * @param sort {String} The sorting method
     * @param direction {String} The direction of posts. Set to ASC if no sort is defined
     * @param callback {function} The function to be called after results are found
     * @author Jack Cole jcole2@mail.sfsu.edu
     * Anthony Carrasco acarras4@mail.sfsu.edu
     */
    static searchPosts(name, category, page, sort, direction, callback){
        if(typeof category === "undefined" || category.length === 0) category = "0"
        if(typeof page === "undefined" || page.length === 0) page = "1"
        if(typeof sort === "undefined" || sort.length === 0) sort = "price"
        if(typeof direction === "undefined" || direction.length === 0) direction = "ASC"
        let params = $.param({name:name, category:category, page:page, sort:sort, direction: direction})
        let url = '/api/post/search?'+params
        return $.get(url,callback)
    }

    /**
     * @description Uploads an image to file system and creates a thumbnail
     * @param post_id {Number}
     * @param image_number {Number} A specific image to upload (1 through number of total images to upload) 
     * @param callback {function} The function to be called after results are found
     * @author Juan Ledezma
     */
    static uploadImage(post_id, image_number, callback) {
        let params = $.param({post_id:post_id, image_number:image_number})
        let url = '/api/post/fileUpload?'+params
        return $.post(url, callback)
    }

    /**
     * @description Grabs a list of recent posts
     * @param callback {function} The function to be called after results are found
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static getRecentPosts(callback){
        let url = '/api/post/recent'
        return $.get(url,callback)
    }

    /**
     * @description Creates a post, uses data inside the body of the request
     * @param formData {FormData} The data to submit
     * @param callback {function} The function to be called after results are found
     * @author Juan Ledezma
     * Jack Cole jcole2@mail.sfsu.edu
     */
    static createPost(formData, callback){
        let url = '/api/post/create'
        return $.ajax({
            type: "POST",
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            success: callback,
        });
    }

    /**
     * @description Attempts to create a post from the stored post data.
     * @param callback {function} The function to be called after the post is created
     * @author Juan Ledezma
     * Jack Cole jcole2@mail.sfsu.edu
     */
    static createStoredPost(callback){
        let url = '/api/post/createStored'
        return $.ajax({
            type: "GET",
            url: url,
            success: callback,
        });
    }

    /**
     * @description Gets all posts with the status "pending"
     * @param callback {function} The function to be called after results are found
     * @author Juan Ledezma
     */
    static getPendingPosts(callback) {
        let url = '/api/post/pending'
        return $.get(url, callback)
    }

    /**
     * @description Changes the status of a post; posts are initially "pending" and changed
     *              to "accepted" or "rejected" by an admin
     * @param post_id {Number}
     * @param newStatus {String} Either "accepted" or "rejected"
     * @param callback {function} The function to be called after results are found
     * @author Juan Ledezma
     */
    static changePostStatus(post_id, newStatus, callback) {
        let params = $.param({post_id:post_id, status:newStatus})
        let url = '/api/post/statusChange?' + params
        return $.post(url, callback)
    }

    /**
     * @description Gets the Post Details based on ID
     * @param id
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     */
    static getPostDetails(id, callback){
        let params = $.param({id:id})
        let url = '/api/post?'+params
        return $.get(url,callback)
    }

    /**
     * @description Gets the Posts based on category_id
     * @param category_id
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     */
    static getAllPostsByCategory(category_id, callback) {
        let params = $.param({category_id: category_id})
        let url = '/api/category/' + params
        return $.get(url, callback)
    }

    /**
     * @description Returns all the current logged in user's posts
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     */
    static getAllPosts(callback){
        let url = '/api/post/self'
        return $.get(url, callback)
    }

    /**
     * @description Returns all messages for any active posts for the currently logged in user
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     */
    static getActivePostMessages(callback){
        let url = '/api/message/read'
        return $.get(url, callback)
    }

    static getLatestMessages(callback){
        let url = '/api/message/allLatest'
        return $.get(url, callback)
    }

    /**
     * @description Gets the details of a single message, using the message id
     * @param message_id 
     * @param callback {function} The function to be called after results are found
     * @author Juan Ledezma
     */
    static getMessage(message_id, callback) {
        let param = $.param({id:message_id})
        let url = '/api/message?' + param
        return $.get(url, callback)
    }

    /**
     * @description Returns all the messages for a specifc post
     * @param post_id
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     */
    static getPostMessages(post_id, user_id,callback){
        let params = $.param({post_id: post_id, user_id: user_id})
        let url = '/api/message/all?' + params
        return $.get(url, callback)
    }

    /**
     * @description Sends a message to the user under the Post
     * @param formData {FormData} The data of the message
     * @param callback {function} The function to be called after sending the message
     * @author Ryan Jin
     */
    static sendPostMessages(formData, callback){
        let url = '/api/message/send/'
        return $.ajax({
            type: "POST",
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            success: callback,
        });
    }

    /**
     * @description Returns all the categories
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     */
    static getAllCategories(callback){
        let url = '/api/categories'
        return $.get(url, callback)
    }

    /**
     * @description Logs the user into the site and stores their session as a cookie
     * @param formData {FormData} The form data to send to the server
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     * Jack Cole jcole2@mail.sfsu.edu
     */
    static registerUser(formData, callback){
        let url = '/api/register'
        return $.ajax({
            type: "POST",
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            success: callback,
        });
    }

    /**
     * @description Logs the user into the site and stores their session as a cookie
     * @param formData {FormData} The form data to send to the server
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     * Jack Cole jcole2@mail.sfsu.edu
     */
    static userLogin(formData, callback){
        let url = '/api/login'
        return $.ajax({
            type: "POST",
            url: url,
            data: formData,
            contentType: false,
            processData: false,
            success: callback,
        });
    }

    /**
     * @description Logs out the currently logged in user, clears their cookie, and redirects to
     *              home page. If no user if logged in, this redirects to login page
     * @param callback {function} The function to be called after results are found
     * @author Juan Ledezma
     * Jack Cole jcole2@mail.sfsu.edu
     */
    static userLogout(callback) {
        let url = '/api/logout'
        return $.get(url, callback)
    }

}