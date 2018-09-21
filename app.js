const express = require('express');
const settings = require('./settings');
const app = express();

var port = settings.web.port;

// Server the static files in the root directory
app.use(express.static('static'))

app.listen(port, () => {
    console.log('Server running on port ' + port)
});