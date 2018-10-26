class GatorTraderAPI {

    /**
     * @description Grabs a list of posts from the database
     * @param title {string} The title of a post. Will do a partial match
     * @param category {String} The category ID. Set to 0 if looking through all categories
     * @param page {String} The page number. Starts at 1.
     * @param sort {String} The sorting method
     * @param callback {function} The function to be called after results are found
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static searchPosts(title, category, page, sort, callback){
        if(category.length === 0) category = "0"
        if(page.length === 0) page = "1"
        if(sort.length === 0) sort = "default"
        let url = '/api/post/search/'+title+'/'+category+'/'+page+'/'+sort
        return $.get(url,callback)
    }

    /**
     * @description Grabs a list of recent posts
     * @param callback {function} The function to be called after results are found
     * @author Jack Cole jcole2@mail.sfsu.edu
     */
    static getRecentPosts(callback){
        let url = 'api/post/recent'
        return $.get(url,callback)
    }


}