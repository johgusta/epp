"use strict";

import {ApiService} from './apiService.js';

var HEXAGON_BOARD_STORAGE_KEY = 'HexagonBoard';

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

PatternHandler.prototype.addPattern = function addPattern(name) {
    var emptyPattern = {
        board: {}
    };
    var serializedPattern = JSON.stringify(emptyPattern);

    var apiPattern = {
        title: name,
        data: serializedPattern
    };

    return ApiService.addPattern(apiPattern);
};

PatternHandler.prototype.savePattern = function savePattern(name, serializedObject) {
    var serializedPattern = JSON.stringify(serializedObject);

    var apiPattern = {
        title: name,
        data: serializedPattern
    };

    return ApiService.addPattern(apiPattern);
};

PatternHandler.prototype.loadPattern = function loadPattern(id) {
    return ApiService.getPattern(id).then(function (apiPattern) {
        var pattern = parseApiPattern(apiPattern);
        return pattern;
    });
};

PatternHandler.prototype.deletePattern = function deletePattern(id) {
    return ApiService.deletePattern(id);
};

PatternHandler.prototype.getSavedPatterns = function getSavedPatterns() {
    return ApiService.getPatterns().then(function (apiPatterns) {
        var patterns = apiPatterns.map(parseApiPattern);
        return patterns;
    });
};

function parseApiPattern(apiPattern) {
    var pattern = {
        name: apiPattern.title,
        id: apiPattern.id
    };
    try {
        var patternData = JSON.parse(apiPattern.data);
        pattern.board = patternData;
    } catch (e) {
        console.error('Error parsing saved pattern: ' + pattern.id, e);
    }

    return pattern;
}

var patternHandler = new PatternHandler();
export {patternHandler as PatternHandler};