/**
 *@Description get the post details
 *@author XiaoQian Huang
 *xhuang8@mail.sfsu.edu
 */

function addProductName(post){

    let name = post.post_title;
    post.image_url = "/images/posts/3-1.jpg";
    let productDescription = post.post_description;
    let productPrice = post.price;
    let userName = post._user;
    $("#_user").empty().append(userName);
    $("#post_description").empty().append(productDescription);
    $("#price").empty().append("$"+ productPrice);
    $("#post_title").empty().append(name);
}


/*$(document).ready(function(){
    if(product.name)
        GatorTraderAP.getPostDetails(product.name,addProductName){
            console.log("Fetched results", results);
        }).catch(function(err){
            console.error("Could not get posts", err);
        })
})*/