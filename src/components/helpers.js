import moment from 'moment';

/**
 * Parses fetched data from search places API.
 *
 * @param {Array} data Array of places
 * @return {Array} Parsed array
 */
function parseDataPlaces(data) {

  return data.map((place) => {

    const { id, value: name } = place;

    return Object.freeze({
      id,
      name
    });
  });
}

/**
 * Formats dates object into specific format
 *
 * @param {!Object} spec Dates spec object
 * @param {string=} [format='DD/MM/YYYY']
 * @return {Object} Formated dates object
 */
function formatDates(spec, format = 'DD/MM/YYYY') {

  const newDates = {};

  Object.keys(spec).forEach((key) => {

    const date = spec[key];

    if (!date) {
      return;
    }

    newDates[key] = moment(date).format(format);
  });

  return Object.freeze(newDates);
}

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
 * Paramtrizes key value pair of object
 *
 * @param {Array} arr Array of object
 * @return {Array} Array of string params
 */
function parametrize(arr) {

  let paramArr = [];

  arr.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      paramArr.push(`${key}=${obj[key]}`);
    });
  });

  return paramArr;
}

/**
 * Creates query from array of params
 *
 * @param {any} arr Array of params
 * @return {string} Query string
 */
function querify(arr) {

  return arr.join('&');
}



/**
 * Creates parametrized string for search query.
 *
 * @param {!Object} spec Spec object
 */
function createSearchQuery(spec) {

  const { dateFrom, dateTo, returnFrom, returnTo, selectedPlaces } = spec;

  const runDates = runSequentially({
    dateFrom,
    dateTo,
    returnFrom,
    returnTo
  });

  const runPlaces = runSequentially(selectedPlaces);

  const datesQuery = runDates(formatDates, flattenObject, parametrize, querify);
  const placesQuery = runPlaces(parametrize, querify);

  return `${placesQuery}&${datesQuery}`;
}


/**
 * Async sequential currier.
 * Runs sequentially pure function callbacks.
 *
 * @param {...any} params Arguments
 * @return {Function} Async function callback
 */
// function runAsyncSequentially(...params) {

//   return async function sequence(...cb) {

//     let i = 0;
//     let data = await cb[i](...params);

//     for (i; i <= cb.length - 2; i++) {

//       data = await cb[i + 1](data);
//     }

//     return data;
//   };
// }

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
  parseDataPlaces,
  createSearchQuery,
  runAsyncSequentially,
  runSequentially,
  curry
};
