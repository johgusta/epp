require('./main.css');
var page = require('page');
var queryString = require('query-string');

var HexagonBoard = require('./hexagonBoard.js');
var LoginPage = require('./loginPage.js');
var showLibraryPage = require('./libraryPage.js').showLibraryPage;
var ApiService = require('./apiService.js');

var _ = require('lodash');

var mainContent = document.getElementById('main-content');

page('/', index);
page('/edit', edit);
page('/library', library);
page('/login', login);
page('/login/callback', loginCallback);
page();

function index() {
    ApiService.getUser().then(function (user) {
        if (user) {
            page('/library');
        } else {
            page('/login');
        }
    });
}

function login() {
    var loginPage = new LoginPage(mainContent);
    loginPage.draw();
}

function loginCallback() {
    var parsedParams = queryString.parse(window.location.search);
    if (parsedParams.code === undefined) {
        console.error('Code missing for login callback!');
        return;
    }

    ApiService.loginWithGoogleCode(parsedParams.code).then(function () {
        page.redirect('/library');
    });
}

function edit() {
    ApiService.getUser().then(function (user) {
        if (user) {
            var hexagonBoard = new HexagonBoard(mainContent, user);
            window.Board = hexagonBoard;
            hexagonBoard.draw();
        } else {
            page('/login');
        }
    });
}

function library() {
    ApiService.getUser().then(function (user) {
        if (user) {
            showLibraryPage(mainContent, user);
        } else {
            page('/login');
        }
    });
}

window.GlobalApiService = ApiService;

