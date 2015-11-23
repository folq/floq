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

module.exports = {requiresLogin, validRedirect};
