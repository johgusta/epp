"use strict";

import style from './addLibrary.css';

import addTemplate from './addLibrary.html';

import Mustache from 'mustache';
import page from 'page';

import {PatternHandler} from '../../js/patternHandler.js';


function showAddPatternPage(container, user) {
    var addPatternPage = new AddPatternPage(container, user);
    addPatternPage.draw();
}

function AddPatternPage(container, user) {
    this.container = container;
    this.user = user;
}

AddPatternPage.prototype.draw = function draw() {
    var container = this.container;

    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }

//    var rendered = Mustache.render(addTemplate, {
//        fullName: this.user.fullName,
//        patterns: this.patterns
//    });

    var libraryDiv = document.createElement('div');
    libraryDiv.innerHTML = addTemplate;
    container.appendChild(libraryDiv);

    var addPatternForm = container.querySelector('#add-pattern-form');
    var patternNameInput = container.querySelector('#pattern-name');

    addPatternForm.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('Submit button!');
        if (patternNameInput.value) {
            PatternHandler.addPattern(patternNameInput.value).then(function (pattern) {
                page.redirect('/pattern/' + pattern.id);
            })
        }
    });
};

export {showAddPatternPage};