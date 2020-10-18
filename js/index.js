/* global define */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else {
    global = global || window;

    factory(global.acorn = {});
  }
}(this, function (exports) { // eslint-disable-line prefer-arrow-callback
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
      // eslint-disable-next-line no-bitwise
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return S4() + S4() + S4() + S4();
  }

  exports.castVariable = castVariable;
  exports.getUID = getUID;

  Object.defineProperty(exports, '__esModule', { value: true });
}));
