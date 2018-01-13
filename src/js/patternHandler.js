"use strict";

var HEXAGON_BOARD_STORAGE_KEY = 'HexagonBoard';
var SAVED_PATTERNS_KEY = 'HexagonPatterns';
var SAVED_PATTERN_PREFIX = 'HexagonPattern-';

function PatternHandler() {

}

PatternHandler.prototype.storeCurrent = function storeCurrent(serializedBoard) {
    if (!window.localStorage) {
        return;
    }

    var serializedString = JSON.stringify(serializedBoard);
    window.localStorage.setItem(HEXAGON_BOARD_STORAGE_KEY, serializedString);
};

PatternHandler.prototype.loadCurrent = function loadCurrent() {
    if (!window.localStorage) {
        return;
    }

    var serializedString = window.localStorage.getItem(HEXAGON_BOARD_STORAGE_KEY);
    var serializedObject;
    try {
        serializedObject= JSON.parse(serializedString);
    } catch (e) {
        console.error('Error loading stored board!', e);
        window.localStorage.removeItem(HEXAGON_BOARD_STORAGE_KEY);
        return;
    }
    return serializedObject;
};

PatternHandler.prototype.clearCurrent = function clearCurrent() {
    if (!window.localStorage) {
        return;
    }

    window.localStorage.removeItem(HEXAGON_BOARD_STORAGE_KEY);
};

PatternHandler.prototype.savePattern = function savePattern(name, serializedObject) {
    if (!window.localStorage) {
        return;
    }

    var serializedPattern = JSON.stringify(serializedObject);
    var savedPatterns = this.getSavedPatterns();

    var newPatterns = [];
    //Remove duplicates
    savedPatterns.forEach(function (pattern) {
        if (pattern.name !== name) {
            newPatterns.push(pattern);
        }
    });
    newPatterns.push({
        name: name
    });

    this.storeSavedPatterns(newPatterns);

    window.localStorage.setItem(SAVED_PATTERN_PREFIX + name, serializedPattern);
};

PatternHandler.prototype.loadPattern = function loadPattern(name) {
    if (!window.localStorage) {
        return;
    }

    var serializedString = window.localStorage.getItem(SAVED_PATTERN_PREFIX + name);
    var serializedObject;
    try {
        serializedObject= JSON.parse(serializedString);
    } catch (e) {
        console.error('Error loading stored pattern!', e);
        window.localStorage.removeItem(SAVED_PATTERN_PREFIX + name);
        return;
    }

    return serializedObject;
};

PatternHandler.prototype.deletePattern = function deletePattern(name) {
    if (!window.localStorage) {
        return;
    }

    var oldPatterns = this.getSavedPatterns();
    var newPatterns = [];
    oldPatterns.forEach(function (pattern) {
        if (pattern.name !== name) {
            newPatterns.push(pattern);
        }
    });

    this.storeSavedPatterns(newPatterns);

    window.localStorage.removeItem(SAVED_PATTERN_PREFIX + name);
};

PatternHandler.prototype.getSavedPatterns = function getSavedPatterns() {
    if (!window.localStorage) {
        return [];
    }

    var savedPatternsString = window.localStorage.getItem(SAVED_PATTERNS_KEY);
    var savedPatterns = [];

    try {
        savedPatterns = JSON.parse(savedPatternsString);
    } catch (e) {
        console.error('Error parsing saved patterns', e);
        return [];
    }

    if (!Array.isArray(savedPatterns)) {
        savedPatterns = [];
    }

    return savedPatterns;
};

PatternHandler.prototype.storeSavedPatterns = function storeSavedPatterns(savedPatterns) {
    if (!window.localStorage) {
        return;
    }

    var savedPatternsString = JSON.stringify(savedPatterns);
    window.localStorage.setItem(SAVED_PATTERNS_KEY, savedPatternsString);
};

module.exports = PatternHandler;