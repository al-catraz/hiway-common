(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.acorn = {}));
}(this, function (exports) {
  function castVariable(variable) {
    let isJson = false;

    try {
      isJson = typeof JSON.parse(variable) === 'object';
    } catch (e) {
      // eslint-disable-line
    }

    if (
      typeof variable === 'string'
      && (variable.match(/^(\d)+$/)
        || variable.match(/^(\d)+\.(\d)+$/)
        || variable.match(/^true|false$/)
        || isJson)
    ) {
      return JSON.parse(variable);
    }

    return variable;
  }

  function getUID() {
    function S4() {
       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return S4() + S4() + S4() + S4();
  }

  exports.castVariable = castVariable;
  exports.getUID = getUID;

  Object.defineProperty(exports, '__esModule', { value: true });
}));
