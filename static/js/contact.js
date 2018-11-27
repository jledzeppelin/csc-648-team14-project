GatorTraderAPI.getPostDetails(CONSTANT_SEARCH.post,function(post){
    $("#title").val(post.post_title)
    $("#seller").val(post.user_id)
    console.debug("post", post)
})