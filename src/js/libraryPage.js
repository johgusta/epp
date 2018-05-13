"use strict";

require('../css/library.css');
var testTemplate = require('../templates/library.html');
var Mustache = require('mustache');

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

module.exports = showLibraryPage;