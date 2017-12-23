function onSuccess(googleUser) {
    // POST session to backend, which does the redirect.
    var form = document.createElement('form');
    form.setAttribute('method', 'POST');
    var trgtLoc = document.getElementById('targetLocation');
    var toUrl = trgtLoc ? escape(trgtLoc.content) : '/' ;
    form.setAttribute('action', '/login?to=/');
    var token_field = document.createElement('input');
    token_field.setAttribute('type', 'hidden');
    token_field.setAttribute('name', 'id_token');
    token_field.setAttribute('value', googleUser.getAuthResponse().id_token);

    form.appendChild(token_field);

    document.body.appendChild(form);
    form.submit();
}

function handleSuccess(a){
    var profile = a.getBasicProfile();
    var email = profile.getEmail();
    if(email.endsWith('@blank.no'))
    {
        if(confirm('Fullfør innlogging som ' + email + '? Avbryt for å prøve med en annen konto. ')){
            onSuccess(a);
        }
    }else{
        alert(email + ' er ikke en @blank.no-konto :/');
    }                   
}

function onFailure(error) {
    // FIXME
    console.log(error);
}

function renderButton() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: '1085640931155-0f6l02jv973og8mi4nb124k6qlrh470p.apps.googleusercontent.com',
            prompt : 'select_account'
        }).then(function() {
            gapi.signin2.render('goog-signin-button', {
                'width': 250,
                'height': 50,
                'longtitle': true,
                'onsuccess': handleSuccess,
                'onfailure': onFailure
            });
        });
    });
}