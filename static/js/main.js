
function convertTimeToBetterFormat(time){
    let date = new Date(time)

    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

//
//  Search bar
//


function addCategories(categories){
    console.debug("addCategories(categories)", categories)
    let ele = $(".category-select")
    for(let i in categories)
    {
        let category = categories[i]
        let html = `<option value="${category.id}">${category.category_name}</option>`
        ele.append(html)
    }

    if(typeof search !== "undefined" && typeof search.category_id !== "undefined")
        $(".category-select").val(search.category_id)

}

$(document).ready(function(){

    GatorTraderAPI.getAllCategories(addCategories)

})


//
//  Front Page
//

function addRecentPostsToFrontPage(posts){
    let container = $("#recent-posts")
    container.empty()
    let i = 0
    for(let p in posts){
        i+= 1
        let post = posts[p]
        container.append(
            `<div class="item">
            <div class="thumbnail"><a href="/post?id=${post.id}"><img src="${post.thumbnail_URL[0]}" class="img-list-item img-thumbnail m" alt="${post.post_title} Image"></a></div>
            <button class="link"></button><button class="btn default"><span class="caption"><b>$${post.price.toFixed(2)}</b></span></button>
            </div>`
        )
        if(i > 5) break
    }
}

if(location.pathname === "/"){
    GatorTraderAPI.getRecentPosts(addRecentPostsToFrontPage)
}


//
// Login and Registration
//

function onSubmitRegistration(event){

    GatorTraderAPI.registerUser(new FormData(event.target), function(response){
        console.log(response)
        if(document.URL.indexOf("creatingPost=true") > -1)
        {
            createStoredPost()
        }
        else if(response.status)
        {
            window.location.href = "/account"
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
        if(document.URL.indexOf("creatingPost=true") > -1)
        {
            createStoredPost()
        }
        else if(response.status)
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

function createStoredPost(){
    GatorTraderAPI.createStoredPost(function(response){
        if(response.message === "Log in before submitting a post")
        {
            window.location.href = "/login?creatingPost=true"
        }
        else{
            forwardToCreatePostSuccess(response.data.insertId)
        }
    })

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
        else if("data" in response){
            forwardToCreatePostSuccess(response.data.insertId)
        }
        else
        {
            displayCreatePostError(response.message)
        }
    })

    event.preventDefault()
}

function onLazyRegister(){
    GatorTraderAPI.createStoredPost(function(response){
        console.log("lazy register", response)
    })
}

function forwardToCreatePostSuccess(id){
    window.location.href = "/postSuccess?id="+id
}

function displayCreatePostError(errorMsg){
    console.error(`Create Post error:`, errorMsg)
    $(".createPostError").empty().append(errorMsg).removeClass("d-none")
}

