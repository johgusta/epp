require('./main.css');
var HexagonBoard = require('./hexagonBoard.js');
var LoginPage = require('./loginPage.js');
var ApiService = require('./apiService.js');

var _ = require('lodash');

var mainContent = document.getElementById('main-content');

window.GlobalApiService = ApiService;

ApiService.initializeUser().then(function (user) {
    if (user) {
        var hexagonBoard = new HexagonBoard(mainContent);
        window.Board = hexagonBoard;
        hexagonBoard.draw();
    } else {
        console.log('Time to login!');
        var loginPage = new LoginPage(mainContent);
        loginPage.draw();
//        ApiService.login();
    }
});

