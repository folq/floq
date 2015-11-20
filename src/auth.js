var https = require('https');

// TODO: Remove whenever node gets native es6 promises.
var Promise = require('promise/lib/es6-extensions');

var googAuthUri = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='

function authenticate(req) {
    return new Promise((resolve, reject) => {
        if (!req.body.id_token) {
            reject('No token');
            return;
        }

        var token = req.body.id_token;

        var handleGoogleResponse = (data) => {
            if (data.error_description) {
                reject(data.error_description);
                return;
            }

            if (data.hd !== 'blankoslo.no') {
                reject('Wrong (or no) domain.');
                return;
            }

            // TODO: Get employee id.
            req.session.google_data = data;
            req.session.id_token = token;
            resolve();
        }

        var authReq = https.get(googAuthUri+token, (authRes) => {
            var body = '';

            authRes.on('data', (block) => {
                body += block;
            });

            authRes.on('end', () => {
                handleGoogleResponse(JSON.parse(body));
            });
        }).on('error', reject);
    });
}

function requiresLogin(req, res, next) {
    // TODO: Check if valid employee loaded.
    if (req.session.google_data && req.session.id_token) {
        next();
        return;
    }

    res.redirect('/login?to=' + req.originalUrl);
}

function validRedirect(app, path) {
    var routes = app._router.stack
        .filter((layer) => layer.route !== undefined);

    for (var route in routes) {
        var re = routes[route].regexp;
        if (re.test(path)) {
            return true;
        }
    }

    return false;
}

module.exports = {authenticate, requiresLogin, validRedirect};
