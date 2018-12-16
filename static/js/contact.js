GatorTraderAPI.getPostDetails(CONSTANT_SEARCH.post_id,function(post){
    $("#title").val(post.post_title)
    $("#seller").val(post.registered_user.last_name)
    $("#user_id").val(post.user_id)
    $("#post_id").val(post.post_id)
    console.debug("post", post)
})