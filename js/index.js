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

  exports.castVariable = castVariable;

  Object.defineProperty(exports, '__esModule', { value: true });
}));
