/**
 *@Description get the account listing
 *@author XiaoQian Huang
 *xhuang8@mail.sfsu.edu
 */

//let message = ["This is my favorite products", "selling my books", "my favorite books"];

/*function getMessage(messages){

    let message = ["This is my favorite products", "selling my books", "my favorite books"];
    var text = "";
    for (let i=0; i<message.length; i++)
    {
        text += message[i];
    }
    $('.message').append(text);
}

message("this is my books");*/



/*function getAccountPosts(post){

    console.debug("getAccountPosts(post)", post)
    post.image_url = "/images/posts/"+post.id+"-1.jpg";
    $("#_user").empty().append(post.post_id);
    $("#price").empty().append("$"+ post.price.toFixed(2));
    $("#post_title").empty().append(post.post_title);
    $('#post_image').attr("src", post.image_url)
}

$(document).ready(function(){
    GatorTraderAPI.getPostMessages(Post.id,getAccountPosts)
        .catch(function(err){
            console.error("Could not get posts", err);
        })
})*/

function getAccountMessages(messages){
    let ele = $('.account-messages-tab').empty()
    if(messages.length ===0)
        ele.append(`<span class="alert alert-warning">You have no messages</span>`)
    messages.forEach(function(m){
        let otherUserId = parseInt(GLOBAL_USER_ID) !== m.sender.id ? m.sender.id : m.recipient.id
        let html = `<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">${m.post.post_title}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${convertTimeToBetterFormat(m.sent_date)}</h6>
    <p class="card-text">${m.message} <span class="text-muted text-capitalize"> - ${m.sender.first_name}</span></p>

    <span href="#" class="text-muted text-capitalize"></span>
        <a href="/contact?user_id=${otherUserId}&post_id=${m.post.id}" class="card-link">Continue Conversation</a>
  </div>
</div>`
        ele.append(html)
    })
}

GatorTraderAPI.getLatestMessages(function(response){
    console.log(response)
    getAccountMessages(response)
})


function getAccountPosts(posts){
    let ele = $('.account-posts-tab').empty()
    if(posts.length ===0)
        ele.append(`<span class="alert alert-warning">You have no Posts</span>`)
    posts.forEach(function(p){
        let html = `<div class="col col-md-4 mx-auto">

                    <h4>${p.post_title}</h4>
                    Status <span class=" post-status-${p.post_status}">${p.post_status}</span>

                    <div class="text-right">
                        <a href="/post?id=${p.id}"><img src="${p.image_location[0]}" class="account-img" id="post_image"></a>
                    </div>


                    <div class="text-right" id="price">
                        <p>$${p.price}</p>
                    </div>
                    
                    

                </div>`
        ele.append(html)
    })
}

GatorTraderAPI.getAllPosts(function(response){
    console.log(response)
    getAccountPosts(response)
})