function addPostsToPage(posts){

    for(let i = 0; i < posts.length; i++)
    {
        let post = posts[i];
        let price = post.price.toFixed(2);
        let image_url = "/static/img/no_image_avaliable.png";
        let html = $(`<div class="col-md-4 offset-md-1 text-right post">
            <li class="list-inline list-unstyled">
                <a href="#"><img src="${image_url}" class="post-img w-100"></a>
                <div class="product-info">
                    <h4 class="product-name">
                        <a href="#" class="text-capitalize">${post.post_title}</a></h4>
                    <div class="price-box">
                        <span class="regular-price">
                            <span class="price">$${price}</span></span>
                    </div>
                </div>
            </li>
        </div>`);
        $("#posts").append(html);
    }
}


function setResultCount(first, last, total, searchTerm)
{
    let totalformat = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $(".post-result-count-text").empty().append(`results ${first}~${last} of ${totalformat} "${searchTerm}"`)
        $(".post-result-count").show();
}

function clearAllPosts(){
    $("#posts").empty();
}

$(document).ready(function(){
    // get search data if search made
    if(search.name)
        GatorTraderAPI.searchPosts(search.name, search.category, search.page, search.sort, function(results){
            addPostsToPage(results);
            setResultCount(0, results.length, results.length, search.name)
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