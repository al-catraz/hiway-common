/* global define */
import castVariable from './castVariable';
import getUID from './getUID';

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
  Object.assign(exports, {
    castVariable,
    getUID,
  });
  Object.defineProperty(exports, '__esModule', { value: true });
}));
