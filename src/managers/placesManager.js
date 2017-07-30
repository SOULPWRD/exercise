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

export {
  parseDataPlaces
};
