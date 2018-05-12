"use strict";

var axios = require('axios');
var queryString = require('query-string');

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

var api = axios.create({
    baseURL: 'http://localhost:8000'
//        baseURL: 'http://127.0.0.1:8000'
//        baseURL: 'http://johgusta.pythonanywhere.com'
});

function ApiService() {

}

ApiService.prototype.login = function login() {
    console.log('ApiService login called');
    getGoogleClientId().then(function (clientId) {
        redirectToGoogleLogin(clientId);
    }).catch(function (error) {
        console.error('Failed to login user', error);
        throw error;
    });
};

ApiService.prototype.logout = function logout() {
    return api.get('/api-auth/logout/').then(function () {
        console.log('Logout successful');
        //TODO: Reroute to logout/login page
        window.location = getCurrentUri();
    }).catch(function (error) {
        console.log('Logout error', error.response);
        throw error;
    });
};

ApiService.prototype.initializeUser = function initializeUser() {
    var parsedParams = queryString.parse(window.location.search);
    if (parsedParams.code !== undefined) {
        return loginUsingGoogleCode(parsedParams.code);
    }

    return api.get('user/').then(function (response) {
        var user = response.data;
        return user;
    }).catch(function (error) {
        var errorResponse = error.response;
        if (errorResponse && errorResponse.status === 403) {
            console.log('User is not logged in');
            return undefined;
        } else {
            console.error('Error getting user', error);
            throw error;
        }
    });
};

ApiService.prototype.getPatterns = function getPatterns() {
    return api.get('/patterns/').then(function (response) {
        var patterns = response.data;
        return patterns;
    }, function (error) {
        console.error('Failed loading user patterns!', error);
        throw error;
    });
};

ApiService.prototype.savePattern = function savePattern(patternId) {
    //TODO: Save or update pattern
};

function getGoogleClientId() {
    return api.get('google-client-id/').then(function (response) {
        var data = response.data;
        return data.client_id;
    }).catch(function (error) {
        console.error('Failed to fetch client id', error);
        throw error;
    })
}

function loginUsingGoogleCode(code) {
    console.log('Log in with google code');
    var currentUri = getCurrentUri();
    return api.post('api/login/social/session/', {
        redirect_uri: currentUri,
        provider: 'google-oauth2',
        code: code
    }).then(function (response) {
        console.log('Success api login', response);
        window.location = currentUri;
    }).catch(function (error) {
        console.error('Failed api login', error);
        throw error;
    });
}

function redirectToGoogleLogin(clientId) {
    var redirectUri = getCurrentUri();

    var url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += '?redirect_uri=' + encodeURIComponent(redirectUri);
    url += '&client_id=' + clientId;
    url += '&prompt=consent';
    url += '&response_type=code';
    url += '&scope=openid%20email%20profile';
    url += '&access_type=offline';

    window.location = url;
}

function getCurrentUri() {
    var currentLocation = window.location;
    var currentUri = currentLocation.protocol + '//' + currentLocation.hostname;
    if (currentLocation.port !== '') {
        currentUri += ':' + currentLocation.port;
    }
    return currentUri;
}

var apiService = new ApiService();
module.exports = apiService;