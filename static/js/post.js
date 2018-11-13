/**
 *@Description get the post details
 *@author XiaoQian Huang
 *xhuang8@mail.sfsu.edu
 */

function addProductName(post){
    console.log(post)
    post.image_url = "/images/posts/"+post.id+"-1.jpg"; // Temp until we get image_url
    $("#_user").empty().append( post.user_id);
    $("#post_description").empty().append(post.post_description);
    $("#price").empty().append("$"+ post.price.toFixed(2));
    $("#post_title").empty().append(post.post_title);
    $('#post_image').attr("src", post.image_url)
    $('#contact_seller').attr("href", "#") // TODO: Replace with Contact Seller URL
    $('#bookmark_post').attr("href", "#") // TODO: Replace with Bookmark Post URL
}


$(document).ready(function(){
    GatorTraderAPI.getPostDetails(Post.id,addProductName)
        .catch(function(err){
        console.error("Could not get posts", err);
    })
})