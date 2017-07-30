import moment from 'moment';
import { flattenObject, runSequentially} from '../utils';
import axios from 'axios';

const FILTER_URL = 'https://api.skypicker.com/flights?v=2&locale=en&';

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
function createFilterQuery(spec) {

  const { dateFrom, dateTo, returnFrom, returnTo, selectedPlaces } = spec;

  const datesQuery = runSequentially({
    dateFrom,
    dateTo,
    returnFrom,
    returnTo
  })(formatDates, flattenObject, parametrize, querify);

  const placesQuery = runSequentially(selectedPlaces)(parametrize, querify);

  return `${placesQuery}&${datesQuery}`;
}

/**
 * Encodes URI string.
 *
 * @param {!string} uri URI
 */
function encodeQueryURI(uri) {


  return encodeURI(`${FILTER_URL}${uri}`);
}

/**
 * Sends XHR
 *
 * @param {!string} uri URI
 * @returns {Promise.<Object>} Data promise
 */
function sendFilterRequest(uri) {

  return axios.get(uri);
}

/**
 * Fetching data from filter API
 *
 * @param {!Object} spec Specification object
 * @returns
 */
function fetchFilterData(spec) {

  const queryString = createFilterQuery(spec);
  return runSequentially(queryString)(encodeQueryURI, sendFilterRequest);
}

export default fetchFilterData;
