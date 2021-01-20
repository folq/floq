var Promise = require('promise/lib/es6-extensions');
var GoogleAuth = require('google-auth-library');
var common = require('common');
var ga = new GoogleAuth();
var jwtClient = new ga.JWTClient();

var aud = '1085640931155-0f6l02jv973og8mi4nb124k6qlrh470p.apps.googleusercontent.com';
var acceptedEmailDomains =
  (process.env.FLOQ_ACCEPTED_EMAIL_DOMAINS || 'folq.no').split(",");

const TOKEN_BUFFER_SECONDS = 3600 * 12;

function requiresLogin(req, res, next) {
    // TODO: Check if valid employee loaded.
    if (req.session.apiToken) {
        common.auth.verifyAPIAccessToken(req.session.apiToken)
            .then(
                (data) => {
                    var date = new Date();
                    var currentTime = date.getTime() / 1000;

                    if (data.exp - currentTime < TOKEN_BUFFER_SECONDS) {
                        res.redirect('login?to=' + req.originalUrl);
                    }
                },
                (err) => res.status(401).send(err)
            );
        return next();
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

function authenticateGoogleIdToken(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject('No token');
            return;
        }

        var callback = (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            var payload = data.getPayload();

            if (payload.aud !== aud) {
                reject('Unrecognized client.');
                return;
            }

            if (payload.iss !== 'accounts.google.com'
                    && payload.iss !== 'https://accounts.google.com') {
                reject('Wrong issuer.');
                return;
            }

            if (acceptedEmailDomains.indexOf(payload.hd) === -1) {
                reject('Wrong hosted domain: ' + payload.hd);
                return;
            }

            resolve(payload);
        }

        jwtClient.verifyIdToken(token, aud, callback);
    });
}

module.exports = {
    requiresLogin,
    validRedirect,
    authenticateGoogleIdToken
};
