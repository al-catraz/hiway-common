export function castVariable(variable) {
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
