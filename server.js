// set up ========================
var express  = require('express');
var app      = express();                        // create our app w/ express
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/node_modules'));           // set the static files location /node_modules/angular will be /angular for users
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

// listen (start app with node server.js) ======================================
app.listen(9090);
console.log("App listening on port http://localhost:9090/");