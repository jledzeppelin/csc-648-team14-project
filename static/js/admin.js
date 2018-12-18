function setAdminPagePosts(posts){
    let postContainer = $(".admin-pending-posts").empty()
    if(posts.length === 0)
        postContainer.append(`<tr><td colspan="7" class="text-center"><span class="alert alert-success">No posts are pending approval</span></td></tr>`)
    posts.forEach(function(post){

        postContainer.append(`<tr class="admin-post" data-post-id="${post.id}">
            <th scope="row">1</th>
            <td class="post-status-set">
            <button type="button" class="btn btn-danger" onclick="setPostStatus(${post.id}, 'rejected')">Reject</button>
            <button type="button" class="btn btn-success" onclick="setPostStatus(${post.id}, 'approved')">Approve</button>

                </td>
            <td class="post-status-value"><span class=" post-status-${post.post_status}">${post.post_status}</span></td>
            <td>${post.post_title}</td>

            <td>${post.post_description}</td>
            <td><div class="thumbnail"><img src="${post.thumbnail_URL[0]}"></div></td>
            <td>${post.registered_user.first_name}</td>
        </tr>`)
    })
}

function setPostStatus(postId, status){

    GatorTraderAPI.changePostStatus(postId, status, function(response){
        if(response.status){
            console.log("Set post status to ${status}", response)
            removePostFromAdminList(postId,status)
        }
    })


}


function removePostFromAdminList(postId, status){
    let post_ele = $(`.admin-post[data-post-id="${postId}"]`)
    $(`.post-status-set`, post_ele).empty()
    $(`.post-status-value`, post_ele).empty().append(`<span class=" post-status-${status}">${status}</span>`)
}

GatorTraderAPI.getPendingPosts(function(response){
    setAdminPagePosts(response)

})