"use strict";

function showLibraryPage(container) {
    var libraryPage = new LibraryPage(container);
    libraryPage.draw();
}

function LibraryPage(container) {
    this.container = container;
}

LibraryPage.prototype.draw = function draw() {
    var container = this.container;

    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }

    var libraryDiv = document.createElement('div');
    libraryDiv.innerText = 'Library';
    container.appendChild(libraryDiv);
};

module.exports = showLibraryPage;