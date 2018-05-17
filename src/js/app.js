import style from './main.scss';
import page from 'page';
import queryString from 'query-string';

import {HexagonBoard} from '../hexagons/hexagonBoard.js';
import {LoginPage} from '../login/loginPage.js';
import {showLibraryPage} from '../library/library.js';
import {showAddPatternPage} from '../library/add/addLibrary.js';
import {ApiService} from './apiService.js';
import {PatternHandler} from './patternHandler.js';

import _ from 'lodash';

var mainContent = document.getElementById('main-content');

page('/', index);
page('/pattern/:id', pattern);
page('/library', library);
page('/library/add', addPattern);
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

function pattern(ctx) {
    ApiService.getUser().then(function (user) {
        if (user) {
            var id = ctx.params.id;
            var hexagonBoard = new HexagonBoard(mainContent, user);
            window.Board = hexagonBoard;
//            hexagonBoard.draw();
            hexagonBoard.loadPattern(id);
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

function addPattern() {
    ApiService.getUser().then(function (user) {
        if (user) {
            showAddPatternPage(mainContent, user);
        } else {
            page('/login');
        }
    });

}

window.GlobalApiService = ApiService;

