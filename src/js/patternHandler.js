"use strict";

import {ApiService} from './apiService.js';

function PatternHandler() {

}

PatternHandler.prototype.addPattern = function addPattern(name, serializedPattern) {
    if (!serializedPattern) {
        serializedPattern = {};
    }
    var patternString = JSON.stringify(serializedPattern);

    var apiPattern = {
        title: name,
        data: patternString
    };

    return ApiService.addPattern(apiPattern);
};

PatternHandler.prototype.savePattern = function savePattern(patternId, patternName, serializedPattern) {
    var patternString = JSON.stringify(serializedPattern);

    var apiPattern = {
        title: patternName,
        data: patternString
    };

    return ApiService.updatePattern(patternId, apiPattern);
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

PatternHandler.prototype.getPatterns = function getPatterns() {
    return ApiService.getPatterns().then(function (apiPatterns) {
        var patterns = apiPatterns.map(parseApiPattern);
        return patterns;
    });
};

function parseApiPattern(apiPattern) {
    var pattern = {
        title: apiPattern.title,
        id: apiPattern.id
    };
    try {
        pattern.data = JSON.parse(apiPattern.data);
    } catch (e) {
        console.error('Error parsing saved pattern: ' + pattern.id, e);
    }

    return pattern;
}

var patternHandler = new PatternHandler();
export {patternHandler as PatternHandler};