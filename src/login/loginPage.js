"use strict";

import {ApiService} from '../js/apiService.js';

function LoginPage(container) {
    this._container = container;
}

LoginPage.prototype.draw = function draw() {
    var container = this._container;

    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }

    var loginDiv = document.createElement('div');
    loginDiv.style.width = '200px';
    container.appendChild(loginDiv);

    var loginText = document.createElement('span');
    loginText.innerText = 'Login';
    loginDiv.appendChild(loginText);

    var button = document.createElement('div');
    button.innerText = 'Login with google';
    button.style.border = '1px solid grey';
    button.style.cursor = 'pointer';
    loginDiv.appendChild(button);

    button.addEventListener('click', function () {
        ApiService.login();
    });
};

export {LoginPage};