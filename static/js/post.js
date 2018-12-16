/**
 *@Description get the post details
 *@author XiaoQian Huang
 *xhuang8@mail.sfsu.edu
 */

function addProductName(post){
    console.debug("addProductName(post)", post)
    // post.image_url = "/images/posts/"+post.id+"-1.jpg"; // Temp until we get image_url
    $("#_user").empty().append( post.registered_user.last_name);
    $("#post_description").empty().append(post.post_description);
    $("#price").empty().append("$"+ post.price.toFixed(2));
    $("#post_title").empty().append(post.post_title);
    $('#post_image').attr("src", post.image_location[0])
    $('#contact_seller a').attr("href", `/contact?user_id=${post.registered_user.id}&post_id=${post.id}`)
    $('#bookmark_post').attr("href", "#") // TODO: Replace with Bookmark Post URL
}


GatorTraderAPI.getPostDetails(Post.id,addProductName)
        .catch(function(err){
        console.error("Could not get posts", err);
    })
