function addCategories(categories){
    console.debug("addCategories(categories)", categories)
    let ele = $("#category_menu")
    for(let i in categories)
    {
        let category = categories[i]
        let html = `<li role="presentation">
<a role="menuitem" tabindex="-1" href="#" class="text-capitalize" data-id="${category.id}">${category.category_name}</a>
</li>`
        ele.append(html)
    }


}

$(document).ready(function(){

    GatorTraderAPI.getAllCategories(addCategories)

})


//
// Login and Registration
//

function onSubmitRegistration(event){

    GatorTraderAPI.registerUser(new FormData(event.target), function(response){
        console.log(response)
        if(response.status)
        {
            window.location.href = "/login"
        }
        else
        {
            displayRegisterError(response.message)
        }
    })

    event.preventDefault()
}

function displayRegisterError(errorMsg){
    console.error(`Register error:`, errorMsg)
    $(".registerError").empty().append(errorMsg).removeClass("d-none")
}

function onSubmitLogin(event){

    GatorTraderAPI.userLogin(new FormData(event.target), function(response){
        console.log(response)
        if(response.status)
        {
            window.location.href = "/account"
        }
        else
        {
            displayLoginError(response.message)
        }
    })

    event.preventDefault()
}

function displayLoginError(errorMsg){
    console.error(`Login error:`, errorMsg)
    $(".loginError").empty().append(errorMsg).removeClass("d-none")
}

//
// Create Post
//


function onSubmitCreatePost(event){
    GatorTraderAPI.createPost(new FormData(event.target), function(response){
        console.log(response)
        if(response.message === "Log in before submitting a post")
        {
            window.location.href = "/login?creatingPost=true"
        }
        else
        {
            displayCreatePostError(response.message)
        }
    })

    event.preventDefault()
}

function displayCreatePostError(errorMsg){
    console.error(`Create Post error:`, errorMsg)
    $(".createPostError").empty().append(errorMsg).removeClass("d-none")
}

function populateCategories(categories){
    for(let cat in categories){
        cat = categories[cat]
        $('.category-select').append(`<option value="${cat.id}">${cat.category_name}</option>`)
    }
}

if(document.URL.indexOf("/createPost") > -1){
    GatorTraderAPI.getAllCategories(populateCategories)
}