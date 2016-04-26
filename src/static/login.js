function onSuccess(googleUser) {
    // POST session to backend, which does the redirect.
    var form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/login?to=' + escape(document.getElementById("targetLocation").content));

    var token_field = document.createElement('input');
    token_field.setAttribute('type', 'hidden');
    token_field.setAttribute('name', 'id_token');
    token_field.setAttribute('value', googleUser.getAuthResponse().id_token);

    form.appendChild(token_field);

    document.body.appendChild(form);
    form.submit();
}

function onFailure(error) {
    // TODO: Show error to user.
    console.log(error);
}

function renderButton() {
    gapi.signin2.render('goog-signin-button', {
        'scope': 'profile',
        'width': 250,
        'height': 50,
        'longtitle': true,
        'theme': 'light',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}