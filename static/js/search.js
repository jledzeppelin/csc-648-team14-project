function addPostsToPage(posts){

    for(let i = 0; i < posts.length; i++)
    {
        let post = posts[i];
        let price = post.price.toFixed(2);
        let html = $(`<div class="col-md-4 offset-md-1 text-right post">
            <li class="list-inline list-unstyled">
                <a href="#"><img src="#" class="post-img w-100"></a>
                <div class="product-info">
                    <h4 class="product-name">
                        <a href="#" class="text-capitalize">${post.post_title}</a></h4>
                    <div class="price-box">
                        <span class="regular-price">
                            <span class="price">$${price}</span></span>
                    </div>
                </div>
            </li>
        </div>`);
        $("#posts").append(html);
    }
}


function setResultCount(first, last, total, searchTerm)
{
    let totalformat = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    $("#post-result-count").empty().append(`results ${first}~${last} of ${totalformat} "${searchTerm}"`);
}

function clearAllPosts(){
    $("#posts").empty();
}