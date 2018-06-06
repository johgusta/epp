import ApiService from '@/js/apiService';

function parseApiPattern(apiPattern) {
  const pattern = {
    title: apiPattern.title,
    id: apiPattern.id,
    updated: apiPattern.updated.toDate(),
  };
  try {
    pattern.data = JSON.parse(apiPattern.data);
  } catch (e) {
    console.error(`Error parsing saved pattern: ${pattern.id}`, e);
  }

  return pattern;
}

function PatternHandler() {}

PatternHandler.prototype.addPattern = function addPattern(name, serializedPattern) {
  const patternString = JSON.stringify(serializedPattern || {});

  const apiPattern = {
    title: name,
    data: patternString,
  };

  return ApiService.addPattern(apiPattern);
};

PatternHandler.prototype.savePattern =
function savePattern(patternId, patternName, serializedPattern) {
  const patternString = JSON.stringify(serializedPattern);

  const apiPattern = {
    title: patternName,
    data: patternString,
  };

  return ApiService.updatePattern(patternId, apiPattern);
};

PatternHandler.prototype.loadPattern = function loadPattern(id) {
  return ApiService.getPattern(id).then((apiPattern) => {
    const pattern = parseApiPattern(apiPattern);
    return pattern;
  });
};

PatternHandler.prototype.deletePattern = function deletePattern(id) {
  return ApiService.deletePattern(id);
};

PatternHandler.prototype.getPatterns = function getPatterns() {
  return ApiService.getPatterns().then((apiPatterns) => {
    const patterns = apiPatterns.map(parseApiPattern);
    return patterns;
  });
};

const patternHandler = new PatternHandler();
export default patternHandler;
