"use strict";

var page = require('page');
var axios = require('axios');

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.withCredentials = true;

var api = axios.create({
    baseURL: 'http://localhost:8000'
//        baseURL: 'http://127.0.0.1:8000'
//        baseURL: 'http://johgusta.pythonanywhere.com'
});

var callbackSuffix = '/login/callback';

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
        page('/login');
    }).catch(function (error) {
        console.log('Logout error', error.response);
        throw error;
    });
};

ApiService.prototype.loginWithGoogleCode = function loginWithGoogleCode(code) {
    console.log('Log in with google code');
    var redirectUri = getCurrentUri() + callbackSuffix;
    return api.post('api/login/social/session/', {
        redirect_uri: redirectUri,
        provider: 'google-oauth2',
        code: code
    }).then(function (response) {
        console.log('Success api login', response);
        return response;
    }).catch(function (error) {
        console.error('Failed api login', error);
        throw error;
    });
};

ApiService.prototype.getUser = function getUser() {
    return api.get('user/').then(function (response) {
        var apiUser = response.data;

        var user = {
            id: apiUser.id,
            username: apiUser.username,
            firstName: apiUser.first_name,
            lastName: apiUser.last_name,
            email: apiUser.email
        };
        user.fullName = user.firstName + ' ' + user.lastName;
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
        console.error('Error loading user patterns', error);
        throw error;
    });
};

ApiService.prototype.addPattern = function addPattern(pattern) {
    return api.post('/patterns/', pattern).then(function (response) {
        var apiPattern = response.data;
        console.log('Added pattern: ' + apiPattern.id);
        return apiPattern;
    }).catch(function (error) {
        console.error('Error adding pattern', error);
        throw error;
    });
};

ApiService.prototype.getPattern = function getPattern(id) {
    return api.get('/patterns/' + id + '/').then(function (response) {
        var patterns = response.data;
        return patterns;
    }, function (error) {
        console.error('Error fetching pattern: ' + id, error);
        throw error;
    });
};

ApiService.prototype.updatePattern = function updatePattern(id, pattern) {
    return api.put('/patterns/' + id + '/', pattern).then(function (response) {
        var apiPattern = response.data;
        console.log('Update pattern: ' + apiPattern.id);
        return apiPattern;
    }, function (error) {
        console.error('Error updating pattern: ' + id, error);
        throw error;
    });
};

ApiService.prototype.deletePattern = function deletePattern(id) {
    return api.delete('/patterns/' + id + '/').then(function () {
        console.log('Deleted pattern: ' + id);
        return undefined;
    }).catch(function (error) {
        console.error('Error deleting pattern: ' + id, error);
        throw error;
    });
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

function redirectToGoogleLogin(clientId) {
    var redirectUri = getCurrentUri() + callbackSuffix;

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