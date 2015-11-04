var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

// Session config.
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "TODO: DO THIS RIGHT"
    // TODO: cookie: { secure: true }
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    //if (!req.session.id_token) res.redirect('/');
    res.send('TOKEN: ' + req.session.id_token);
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', function(req, res) {
    req.session.id_token = req.body.id_token;
    res.redirect('/');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
