/* global define */
const plansConfig = {
  free: {
    advancedAnalytics: false,
    basicAnalytics: true,
    campaignLimit: 1,
    customCss: false,
    name: 'Free',
    premiumSupport: false,
    price: 0,
    userLimit: 1000,
    userSegmentation: false,
    whiteLabel: false,
    widgetCustomization: true,
  },
  premium: {
    advancedAnalytics: true,
    basicAnalytics: true,
    campaignLimit: 10,
    customCss: true,
    name: 'Premium',
    premiumSupport: true,
    price: 29,
    userLimit: 5000,
    userSegmentation: true,
    whiteLabel: true,
    widgetCustomization: true,
  },
};

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
    plansConfig,
  });

  Object.defineProperty(exports, '__esModule', { value: true });
}));
