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
     * @param callback {function} The function to be called after results are found
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static searchPosts(name, category, page, sort, callback){
        if(category.length === 0) category = "0"
        if(page.length === 0) page = "1"
        if(sort.length === 0) sort = "default"
        let params = $.param({name:name, category:category, page:page, sort:sort})
        let url = '/api/post/search?'+params
        return $.get(url,callback)
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
     * @description Creates a post
     * @param callback {function} The function to be called after results are found
     * @author Juan Ledezma
     */
    static createPost(callback){
        let url = '/api/post/create'
        return $.get(url, callback)
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
        let params = $.params({category_id: category_id})
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

    /**
     * @description Returns all the messages for a specifc post that the user owns
     * @param postid
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     */
    static getPostMessages(postid, callback){
        let params = $.params({postid: postid})
        let url = '/api/message/read/' + params
        return $.get(url, callback)
    }

    /**
     * @description Returns all the messages for a specifc post that the user owns
     * @param postid
     * @parma message
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     */
    static sendPostMessages(postid, message, callback){
        let params = $.params({postid: postid, message: message})
        let url = '/api/message/send/' + params
        return $.get(url, callback)
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
     * @param username
     * @param password
     * @param captcha
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     */
    static registerUser(username, password, captcha, callback){
        let params = $.params({username: username, password: password, captcha: captcha})
        let url = '/api/register' + params
        return $.get(url, callback)
    }

    /**
     * @description Logs the user into the site and stores their session as a cookie
     * @param username
     * @param password
     * @param callback {function} The function to be called after results are found
     * @author Ryan Jin
     */
    static userLogin(username, password, callback){
        let params = $.params({username: username, password: password})
        let url = '/api/login' + params
        return $.get(url, callback)
    }


}