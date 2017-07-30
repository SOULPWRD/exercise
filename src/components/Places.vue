<template>
  <div class="places--wrapper">
    <div class="places" v-show="places && places.length > 0">
      <ul>
        <li v-for="place in places" v-bind:key="place.id" class="place--wrapper">
          <label>
            <input type="radio" v-bind:value="place.id" v-model="selectedPlace">
            <span class="place--name">{{ place.name }}</span>
          </label>
        </li>
      </ul>
    </div>
    <div class="places--warning" v-show="places && places.length === 0">
      <span>
        No results
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { parseDataPlaces } from '../managers/placesManager';

const PLACE_SELECTED = 'place-selected';

export default {
  name: 'Places',
  props: {
    to: String,
    flyFrom: String,
    selectedPlaces: Object
  },
  data() {
    return {
      places: undefined,
      selectedPlace: '',
      axiosSource: undefined
    }
  },
  methods: {
    updatePlaces(response) {

      const { data } = response;

      this.places = parseDataPlaces(data);
    },
    fetchPlaces(value) {
      //reset places
      this.places = undefined;

      //if request is running cancel it
      if (this.axiosSource) {
        this.axiosSource.cancel();
      }

      // when no input value
      // set axiousSource to default
      if (!value) {
        this.axiosSource = undefined;
        return;
      }

      // else
      // create new axios token
      this.axiosSource = axios.CancelToken.source();

      // and start requesting the server
      axios.get(`https://api.skypicker.com/places?term=${value}&v=2&locale=en`, {
        cancelToken: this.axiosSource.token
      })
      .then(this.updatePlaces)
      // when promise is canceled, axios throws an error
      // handle the error silent way
      .catch(() => { });
    }
  },
  watch: {
    // wathces flyFrom prop
    flyFrom(value) {
      this.fetchPlaces(value)
    },
    /**
     */
    to(value) {
      this.fetchPlaces(value)
    },
    selectedPlace(value, previousValue) {

      if (!value) {
        return;
      }

      const place = this.places.find((item) => item.id === value);

      if (this.to) {
        this.$emit(PLACE_SELECTED, Object.freeze({
          to: place
        }));

        return;
      }

      this.$emit(PLACE_SELECTED, Object.freeze({
        flyFrom: place
      }));
    },
    selectedPlaces(value) {

      if (!value) {
        this.selectedPlace = '';
      }
    }
  }
};
</script>
