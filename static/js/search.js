/**
 * @description Adds the specified Posts to the DOM.
 * @param posts {[Object]} The Posts to be added to the page
 * @author XiaoQian Huang
 * Jack Cole jcole2@mail.sfsu.edu
 */
function addPostsToPage(posts){

    for(let i = 0; i < posts.length; i++)
    {
        let post = posts[i];
        let url = `/post?id=${post.id}`
        let price = post.price.toFixed(2);
        let image_url = "/static/img/no_image_avaliable.png";
        if(post.thumbnail_URL.length > 0)
            image_url = post.thumbnail_URL[0]
        let html = $(`
            <div class="col-md-4 offset-md-1 post">
                <div class="text-left"><div class="thumbnail"><a href="${url}"><img src="${image_url}"></a></div></div>
                
                <div><h4 class="text-capitalize text-left">${post.post_title}</h4></div>
                <div class="text-left"><h5><span class="price">$${price}</span></div>
             
                    <!--<div class="row">-->
                    
                    <!--<div class="col-md-4 text-left">
                         
                         <span class="price">$${price}</span>
                    </div>-->
                <div class="text-left"><a class="btn btn-success"  href="${url}">More Info</a>&nbsp;&nbsp;&nbsp;<a class="btn btn-warning" href="/contact?user_id=${post.registered_user.id}&post_id=${post.id}">Contact<a/></div>
                <br>
        </div>`);
        $("#posts").append(html);
    }
}

/**
 * @description Updates the result count on the page's DOM.
 * The output should look like "results first~last of total "searchTerm"
 * @param first {Number} The index of the first result
 * @param last {Number} The index of the last result
 * @param total {Number} The total number of results for the entire query
 * @param searchTerm {String} The term that was used to search
 * @author XiaoQian Huang
 * Jack Cole jcole2@mail.sfsu.edu
 */
function setResultCount(first, last, total, searchTerm)
{
    let totalformat = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $(".post-result-count-text").empty().append(`results ${first}~${last} of ${totalformat} "${searchTerm}"`)
        $(".post-result-count").show();
}

/**
 * @description Deletes all Posts on page
 * @author XiaoQian Huang
 */
function clearAllPosts(){
    $("#posts").empty();
}

/**
 * @description When the page loads, the search parameters of the page will be used to look up the Posts that need to be displayed
 * If no search is specified, retrieve the latest posts.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
$(document).ready(function(){
    // get search data if search made
    if(search.name)
        GatorTraderAPI.searchPosts(search.name, search.category, search.page, search.sort, search.direction, function(results){
            //when search no results, get recent posts.
            //XiaoQian Huang (xhuang8@mail.sfsu.edu)
            if(results.length == 0)
            {
                GatorTraderAPI.getRecentPosts(function(results){
                    addPostsToPage(results);
                    setResultCount(0, 0, 0, search.name)
                    console.log("Fetched results", results);
                }).catch(function(err){
                    console.error("Could not get posts", err);
                })
            }
            //else show the results if it has results.
            else{
                addPostsToPage(results);
                setResultCount(0, results.length, results.length, search.name)
            }
            console.log("Fetched results", results);
        }).catch(function(err){
            console.error("Could not get posts", err);
        })
    // Get any posts if no search has been made
    else
        GatorTraderAPI.getRecentPosts(function(results){
            addPostsToPage(results);
            setResultCount(0, results.length, results.length, "")
            console.log("Fetched results", results);
        }).catch(function(err){
            console.error("Could not get posts", err);
        })
})