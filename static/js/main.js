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
    })

    event.preventDefault()
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