"use strict";

import style from './library.css';

import testTemplate from './library.html';

import Mustache from 'mustache';

import {PatternHandler} from '../js/patternHandler.js';

function showLibraryPage(container, user) {
    var libraryPage = new LibraryPage(container, user);
    libraryPage.draw();

    PatternHandler.getSavedPatterns().then(function (patterns) {
        libraryPage.updatePatterns(patterns);
    })
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

    var rendered = Mustache.render(testTemplate, {fullName: this.user.fullName, patterns: this.patterns});

    var libraryDiv = document.createElement('div');
    libraryDiv.innerHTML = rendered;
    container.appendChild(libraryDiv);

    console.log('loaded test template', testTemplate);
};

LibraryPage.prototype.updatePatterns = function updatePatterns(patterns) {
    this.patterns = patterns;
    this.draw();
};

export {showLibraryPage};