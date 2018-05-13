"use strict";

import style from './login.css';
import loginTemplate from './login.html';

import Mustache from 'mustache';

import {ApiService} from '../js/apiService.js';

function LoginPage(container) {
    this._container = container;
}

LoginPage.prototype.draw = function draw() {
    var container = this._container;

    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }

    var rendered = Mustache.render(loginTemplate);

    container.innerHTML = rendered;

    var button = document.getElementById('google-login-button');

    button.addEventListener('click', function () {
        ApiService.login();
    });
};

export {LoginPage};