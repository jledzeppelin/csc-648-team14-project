let posts = [
    {"id":1,"user_id":1,"category_id":1,"create_date":"2018-10-24T05:15:19.000Z","post_title":"Test Post Title","post_description":"Here is the description of this post. This post is a test. ","post_status":"approved","price":5,"last_revised":"2018-10-24T05:15:17.000Z"},
    {"id":2,"user_id":1,"category_id":1,"create_date":"2018-10-22T05:15:19.000Z","post_title":"Second Test Post Title","post_description":"Here is the description of this second post. This post is another test. ","post_status":"approved","price":6,"last_revised":"2018-10-22T05:15:17.000Z"},
]



//addPostsToPage(posts)

//<div class="col-lg-4 text-right">
//             <li class="list-inline list-unstyled">
//                 <a href="#"><img src="#" class="w-100"></a>
//                 <div class="product-info">
//                     <h4 class="product-name">
//                         <a href="#" class="text-capitalize">headphones</a></h4>
//                     <div class="price-box">
//                         <span class="regular-price">
//                             <span class="price">US$ 299.00</span></span>
//                     </div>
//                 </div>
//         </div>

function addPostsToPage(posts){

    for(let i = 0; i < posts.length; i++)
    {
        let post = posts[i];
        let price = post.price.toFixed(2);
        let html = $(`<div class="col-lg-4 text-right">
            <li class="list-inline list-unstyled">
                <a href="#"><img src="#" class="w-100"></a>
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