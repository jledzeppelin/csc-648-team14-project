const express = require('express');
const settings = require('./settings');
const app = express();

var port = settings.web.port;

//app.get('/', (req, res) => {
//    res.send('CSC 648 Team 14 Project')
//});

//TO DO serve the static files
app.use(express.static('static'))

app.listen(port, () => {
    console.log('Server running on port ' + port)
});