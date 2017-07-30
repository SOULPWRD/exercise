import Vue from 'vue';

/**
 * Vuejs PubSub
 */
const bus = new Vue();

/**
 * Flatten the object into the array
 *
 * @param {!Object} obj Object
 * @param {Function=} cb Optional callback
 * @returns
 */
function flattenObject(obj, cb) {

  return Object.keys(obj)
    .map((key) => {

      if (typeof cb === 'function') {
        return cb(key, obj[key]);
      }

      return {
        [key]: obj[key]
      };
    });
}

/**
 * Curry function.
 *
 * @param {Function} cb Callback function
 * @param {...any=} args1
 * @return {Function} Curried function
 */
function curry(cb, ...args1) {

  return (...args2) => cb(args1.concat(args2));
}


/**
 * Async sequential currier.
 * Runs sequentially pure function callbacks.
 *
 * @param {...any} params Arguments
 * @return {Function} Async function callback
 */
function runAsyncSequentially(...params) {

  return async function sequence(...cb) {

    let i = 0;
    let data = await cb[i](...params);

    for (i; i <= cb.length - 2; i++) {

      data = await cb[i + 1](data);
    }

    return data;
  };
}

/**
 * Sequential currier.
 * Runs sequentially pure and impure functions .
 *
 * @param {...any} params Arguments
 * @return {Function} callback
 */
function runSequentially(...params) {

  return (...cb) => {

    let i = 0;
    let data = cb[i](...params);

    for (i; i <= cb.length - 2; i++) {

      data = cb[i + 1](data);
    }

    return data;
  };
}

export {
  runSequentially,
  runAsyncSequentially,
  curry,
  flattenObject,
  bus
};
