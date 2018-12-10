/**
 * @file app.js
 * @description This is the controller for the ExpressJS application. It accepts HTTP requests and passes them on to the
 * business layer
 *
 */


const path = require('path')
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const multer  = require('multer')
const cookieParser = require('cookie-parser')
const session = require('express-session')

nunjucks.configure('views', {
  autoescape: true,
  express: app,

});

const SETTINGS = require('./settings')
const Business = require('./business')

const VIEWS_PATH = path.join(__dirname, '/views')
const STATIC_PATH = path.join(__dirname, '/static')
const IMAGE_PATH = path.join(__dirname, '/images')
const IMAGE_SIZE_LIMIT = 2000000 // 2MB

let port = SETTINGS.web.port

// initialize body-parser to parse requests to req.body
app.use(bodyParser.urlencoded({extended:true, limit: "100mb"}))
app.use(bodyParser.json())

//********* SESSIONS *********
// initialize cookie-parser for access to cookies stored in browser
app.use(cookieParser())

// initialize express-session to track logged-in users
app.use(session({
    key: "session_id",
    secret: "gtrTRDRcsc648", //replace with a random string or env variable
    resave: false,
    saveUninitialized: false,
    cookie: {expires: 600000}
}));

// log user out if cookie is saved in browser but user is not set
app.use(function(req, res, next) {
    if (req.cookies.session_id && !req.session.user) {
        res.clearCookie("session_id")
    }
    next()
})

//check for logged-in user
let checkSession = function(req, res, next) {
    if (req.session.user && req.cookies.session_id) {
        res.redirect('/account')
    } else {
        next()
    }
} 

//********* SESSIONS END *********

//******** MULTER ********
// configure upload middleware
const upload = multer({
    fileFilter: function(req, file, callback) {
        checkFileType(file, callback)
    }
})

// check files to be uploaded to only allow .jpeg .jpg .png
function checkFileType(file, callback) {
    //file types to allow
    const filetypes = /jpeg|jpg|png/;
    //check file extension
    const extname = filetypes.test(path.extname(file.originalname));
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname){
        return callback(null, true);
    } else {
        callback("Error, can only upload images!")
    }
}

//******** MULTER END ********

// -------
// -------
// APIs
// -------
// -------

/**
 * @description Returns all recently approved Posts
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 */
app.get('/api/post/recent',async function(req,res){
    let latestApprovedPost = await Business.getLatestApprovedPost()
    res.json(latestApprovedPost)
});

/**
 * @description Returns Posts based on queries passed in. The queries are "name", "category", "page", "sort", "direction"
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 * Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/api/post/search',async function (req,res){
    let name = req.query.name
    let category = req.query.category
    let page = req.query.page
    let sort = req.query.sort
    let direction = req.query.direction

    let searchResults = await Business.searchPosts(name, category, page, sort, direction)
    res.json(searchResults)
});

/**
 * @description Returns the full details of a single post based on its id.
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/api/post',async function(req, res){
    let id = req.query.id
    let post = await Business.getPost(id)
    res.json(post)
});

/**
 * @description Returns all pending posts
 * @author Juan Ledezma
 */
app.get('/api/post/pending', async function(req, res) {
    if (req.session.user && req.cookies.session_id) {
        if (req.session.user.account_type === 'administrator') {
            let pendingPosts = await Business.getAllPendingPosts()
            res.json(pendingPosts)
        } else {
            res.json({message:"Unauthorized user"})
        }
    } else {
        res.json({message:"Access denied"})
    }
})

/**
 * @description Change the status of a post, either approved or rejected
 * @author Juan Ledezma
 */
app.post('/api/post/statusChange', async function(req, res) {
    let post_id = req.query.post_id
    let status = req.query.status

    if (req.session.user && req.cookies.session_id) {
        if (req.session.user.account_type === 'administrator') {
            let post = await Business.changePostStatus(post_id, status)
            res.json(post)
        } else {
            res.json({message:"Unauthorized user"})
        }
    } else {
        res.json({message:"Access denied"})
    }
})

//****** TO DO: api to let user update post ****** NOT TOP PRIORITY ****

/**
 * @description Returns all Categories
 * @author Anthony Carrasco acarras4@mail.sfsu.edu
 */
app.get('/api/categories',async function(req,res){
    let allCategories = await Business.getAllCategories()
    res.json(allCategories)
});


/**
 * @description Creates a post for currently logged-in user and uploads images,
 *              data obtained from body of request
 * @author Juan Ledezma
 */
app.post('/api/post/create', upload.array('files', 5), async function(req,res){
    if (req.session.user && req.cookies.session_id) {
        let dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

        var newPost={
            "user_id":req.session.user.id,
            "category_id":req.body.category_id,
            "post_title":req.body.post_title,
            "post_description":req.body.post_description,
            "post_status":"pending",
            "price":req.body.price,
            "price_is_negotiable":req.body.price_is_negotiable,
            "last_revised":dateTime,
            "create_date":dateTime,
            "number_of_images":req.files.length,
        }

        let post = Business.createPost(newPost, req.files)
        res.json(post)
    } else {
        res.json({message:"Log in before submitting a post"})
    }
});


/**
 * @description Registers a new user, returns a confirmation
 * @author Juan Ledezma
 */
app.post('/api/register', async function(req, res){
    var newUser={
        "first_name":req.body.first_name,
        "last_name":req.body.last_name,
        "email":req.body.email,
        "login_password":req.body.login_password,
        "is_banned":0
    }

    let registeredUser = await Business.registerUser(newUser)
    res.json(registeredUser)
});

/**
 * @description Login for registered user, returns a confirmation and creates a session
 * @author Juan Ledezma
 */
app.post('/api/login', async function(req, res){
    let email = req.body.email
    let login_password = req.body.login_password

    let userLogin = await Business.loginUser(email, login_password)

    if ("user" in userLogin) {
        req.session.user = userLogin.user
        //console.log(req.session.user)
    }
    res.json(userLogin)
});

/**
 * @description Clears the cookie for the current session when user logs outs, and redirects to front page
 * @author Juan Ledezma
 */
app.get('/api/logout', function(req, res){
    if (req.session.user && req.cookies.session_id) {
        res.clearCookie("session_id")
        res.redirect("/")
    } else {
        res.redirect("/login")
    }
})

/**
 * @description Uploads an image for a post and generates a thumbnail
 * @author Juan ledezma
 */
app.post('/api/post/fileUpload', function (req, res){
    // REVIEW: This should be built into /api/post/create
    return newImage = Business.uploadImage(req, res)
});

/**
 * @description Returns a single message
 * @author Ryan Jin
 */
app.get('/api/message', async function(req, res){
    // REVIEW: Might not need this, so ignore this for now so comment out the code completely
    let message_id = req.query.id
    let message = await Business.getSingleMessage(message_id)

    res.json(message)

});

/**
 * @description Returns all the messages for a specific post
 * @author Ryan Jin
 */
app.get('/api/message/all', async function(req, res){
    let post_id = req.query.post_id
    // REVIEW: Needs session data. Only the messages to and from this user should be gathered
    let message = await Business.getAllMessages(post_id)
    res.json(message)

});

/**
 * @description Returns all the messages for a specific post that the user owns, returns messages.njk
 * @author Ryan Jin
 */
app.post('/api/message/send', async function(req, res){
    let dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    // REVIEW: Needs session data. The sender should always be the session's user_id
    var messageInfo = {
        "sender_id":req.body.sender_id,
        "recipient_id":req.body.recipient_id,
        "sent_date":dateTime,
        "post_id":req.body.post_id,
        "message":req.body.message
    }

    let sendMessage = await Business.sendMessage(messageInfo)
    res.json(sendMessage)
});

// -------
// -------
// PAGES
// -------
// -------

app.set('view engine', 'njk');
app.set('views', VIEWS_PATH);

/**
 * @description Home page of site. Renders index.njk
 * @author Jack Cole jcole2@mail.sfsu.edu
 */
app.get('/',function(req, res){
    let user = req.session.user
    res.render('index', {user:user});
})


/**
 * @description Search page. Renders search.njk
 * @author Jack Cole jcole2@mail.sfsu.edu
 * Anthony Carrasco acarras4@mail.sfsu.edu
 */
app.get('/search',function(req, res) {
    let name = req.query.name
    let page = req.query.page
    let sort = req.query.sort
    let direction = req.query.direction
    let user = req.session.user
    res.render('search', {
        name: name,
        page: page,
        sort: sort,
        direction: direction,
        user: user
    })
})

/**
 * @description About Page, returns about.njk
 * @author Ryan Jin
 */
app.get('/about', function(req, res){
    let user = req.session.user
    res.render('about', {user:user});
})

/**
 * @description Admin Page, returns admin.njk
 * @author Ryan Jin
 */
app.get('/admin', function(req, res){
    if (req.session.user && req.cookies.session_id) {
        if (req.session.user.account_type === 'administrator') {
            let user = req.session.user
            res.render('admin', {user:user})
        } else {
            res.json({message:"Unauthorized user"})
        }
    } else {
        res.json({message:"Access denied"})
    }
})

/**
 * @description User Page with ID, returns user.njk
 * @author Ryan Jin
 */
app.get('/user', function(req, res){
    if (req.session.user && req.cookies.session_id) {
        let user = req.session.user
        res.render('user', {user:user})
    } else {
        res.redirect('/login')
    }
})

/**
 * @description Login Page, returns login.njk
 * @author Ryan Jin
 */
app.get('/login', checkSession, function(req, res){
    res.render('login')
})

/**
 * @description Register Page, returns register.njk
 * @author Ryan Jin
 */
app.get('/register', checkSession, function(req, res){
    res.render('register');

})

/**
 * @description Create a post Page, returns createpost.njk
 * @author Ryan Jin
 */
app.get('/createpost', function(req, res){
    let user = req.session.user
    res.render('createpost', {user:user});
})

/**
 * @description Post Confirmation Page, returns postconfirm.njk
 * @author Ryan Jin
 */
app.get('/postconfirm', function(req, res){
    if (req.session.user && req.cookies.session_id) {
        let user = req.session.user
        res.render('postconfirm', {user:user});
    } else {
        res.json({message:"Must register for post to go live"})
    }
})

/**
 * @description Post Page with ID, returns post.njk
 * @author Ryan Jin
 */
app.get('/post', function(req, res){
    let user = req.session.user
    // REVIEW: Page no longer works because the id is not defined. URL has the parameter "id" that has to be passed to the post page.
    res.render('post', {
        id: id,
        user: user
    })
})


/**
 * @description User Account Page, returns account.njk
 * @author XiaoQian Huang
 * xhuang8@mail.sfsu.edu
 */
app.get('/account', function(req, res){
    if (req.session.user && req.cookies.session_id) {
        res.render('account', {user:req.session.user});
    } else {
        res.redirect('/login')
    }
})

/**
 * @description Help Page, returns help.njk
 * @author XiaoQian Huang
 * xhuang8@mail.sfsu.edu
 */
app.get('/help', function(req, res){
    let user = req.session.user
    res.render('help', {user:user});
})

// REVIEW: Missing documentation header
app.get('/contact', function(req, res){
    let post_id = req.query.post_id
    let user = req.session.user
   // REVIEW: Needs session data
    res.render('contact', {
        post_id:post_id,
        user:user,
    });


})


// -------
// -------
// STATIC
// -------
// -------

/**
 * @description Serves static routes in static directory
 * @author  Juan
 *          Jack Cole jcole2@mail.sfsu.edu
 */
app.use('/static',express.static(STATIC_PATH))

/**
 * @description Serves images from the image directory
 * @author     Jack Cole jcole2@mail.sfsu.edu
 */
app.use('/images',express.static(IMAGE_PATH))

/**
 * @description Initializes the application to listen on the HTTP port
 */
app.listen(port, () => {
    console.log('Server running on port ' + port)
})