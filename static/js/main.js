
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
            `<div class="front-page-item">
               <span class="">${post.post_title}</span>
            <div class="thumbnail"><a href="/post?id=${post.id}"><img src="${post.thumbnail_URL[0]}" alt="${post.post_title} Image"></a></div>
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

    grecaptcha.ready(function() {
        grecaptcha.execute('6LcE-4IUAAAAAH0xgp3klPw-sVsd76X2axtTJp-Z', {action: 'action_name'})
            .then(function(token) {
                console.log(token)
            });
    });
    return
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

// Fixes issue with filename in the form not updating when selecting a file
$('input[type="file"]').change(function(e){
    let fileName = e.target.files[0].name;
    $('.custom-file-label').html(fileName);
});