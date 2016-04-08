var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var auth = require('./auth.js');
var common = require('common');

/* SETUP */
var app = express();
app.set('views', 'src/views');
app.set('view engine', 'jade');

// Redirect all requests to https
app.use(common.herokuHttpsRedirect);
app.use('/static', express.static('src/static'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "TODO: DO THIS RIGHT"
    // TODO: cookie: { secure: true }
}));
app.use(bodyParser.urlencoded({ extended: false }));

/* PUBLIC PATHS */
app.get('/login', (req, res) => {
    res.render('login', {to: req.query.to});
});

app.post('/login', (req, res) => {
    auth.authenticateGoogleIdToken(req.body.id_token)
        .then(
            (data) => {
                req.session.apiToken = common.auth.signAPIAccessToken({
                    role: process.env.API_ROLE || 'qqpzgylo',
                    // TODO: Should fetch employee ID instead.
                    email: data.email
                });

                // TODO: Supplying google id_token too for now, until all apps
                // are changed over.
                req.session.id_token = req.body.id_token;
                res.redirect(
                    auth.validRedirect(app, req.query.to) ? req.query.to : '/'
                );
            },
            (err) => res.status(401).send(err)
        );
});


/* PRIVATE PATHS */
app.use(auth.requiresLogin);

// Get all registered apps.
var appRegs = require('./apps.json');

app.get('/', (req, res) => {
    res.render('index', {title: 'Forside', apps: appRegs});
});

// Set up paths for each registered app.
appRegs.forEach((appReg) => {
    app.get('/'+appReg.short_name+'*', (req, res) => {
        res.render('app', {
            title: appReg.name,
            script: appReg.script,
            // TODO: Remove google id_token once all apps are changed over.
            id_token: req.session.id_token,
            apiToken: req.session.apiToken,
            mail: req.session.mail,
            config: JSON.stringify(appReg.config),
            apps: appRegs
        });
    });
});

/* START SERVER */
var server = app.listen(process.env.PORT || 3000, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
