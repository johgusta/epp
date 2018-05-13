"use strict";

import style from '../css/library.css';

import testTemplate from '../templates/library.html';

import Mustache from 'mustache';

function showLibraryPage(container, user) {
    var libraryPage = new LibraryPage(container, user);
    libraryPage.draw();
}

function LibraryPage(container, user) {
    this.container = container;
    this.user = user;
}

LibraryPage.prototype.draw = function draw() {
    var container = this.container;

    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }

    var rendered = Mustache.render(testTemplate, {fullName: this.user.fullName});

    var libraryDiv = document.createElement('div');
    libraryDiv.innerHTML = rendered;
    container.appendChild(libraryDiv);


    console.log('loaded test template', testTemplate);
};

export {showLibraryPage};