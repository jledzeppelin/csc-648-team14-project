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