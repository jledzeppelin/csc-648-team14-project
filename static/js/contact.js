function onSubmitMessageForm(event){
    GatorTraderAPI.sendPostMessages(new FormData(event.target), function(response){
        console.log(response)
        if(response.status){
            GatorTraderAPI.getPostMessages(CONSTANT_SEARCH.post_id, CONSTANT_SEARCH.user_id, populateMessages)
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
    messages.forEach(function(m){
        let otherUserId = m.post.user_id !== m.sender.id ? m.sender.id : m.recipient.id
        let html = `<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">${convertTimeToBetterFormat(m.sent_date)}</h6>
    <p class="card-text">${m.message} <span class="text-muted text-capitalize"> - ${m.sender.first_name}</span></p>

    </div>
</div>`
        container.append(html)
    })
}

GatorTraderAPI.getPostDetails(CONSTANT_SEARCH.post_id,function(post){
    $("#title").val(post.post_title)
    $("#seller").val(post.registered_user.first_name)
})

GatorTraderAPI.getPostMessages(CONSTANT_SEARCH.post_id, CONSTANT_SEARCH.user_id, populateMessages)