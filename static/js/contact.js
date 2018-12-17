function onSubmitMessageForm(event){
    GatorTraderAPI.sendPostMessages(new FormData(event.target), function(response){
        console.log(response)
        if(response.status){
            GatorTraderAPI.getPostMessages(CONSTANT_SEARCH.post_id, populateMessages)
            $('textarea#message').val("")
        }
        else {
            displayMessageError(response.message)
        }
    })

    event.preventDefault()
}

function displayMessageError(error){
    $('.messageError').empty().append(error)
}

function populateMessages(messages){
    let container = $(".previousMessagesContainer")
    container.empty();
    messages.forEach(function(message){
        container.append(`
<div class="card" style="width: 18rem;">
<div class="card-body">
<h5 class="card-title">${message.sender_id === CONSTANT_SEARCH.user_id ? "Received" : "Sent"}</h5>
<p class="card-text">${message.message}</p>
</div>`)
    })
}

GatorTraderAPI.getPostDetails(CONSTANT_SEARCH.post_id,function(post){
    $("#title").val(post.post_title)
    $("#seller").val(post.registered_user.last_name)
})

GatorTraderAPI.getPostMessages(CONSTANT_SEARCH.post_id, populateMessages)