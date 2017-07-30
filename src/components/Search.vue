<template>
  <div class="searchPanel--wrapper">
    <div class="searchPanel--form">
      <form v-on:submit.prevent="fetchSearchResults">
        <div class="form--input">
          <label for="searchPanel-from">FROM</label>
          <input id="searchPanel-from" type="text" v-model="flyFrom">
        </div>
        <PlaceTab
          v-if="selectedPlaces.flyFrom"
          identifier='flyFrom'
          v-bind:tab="selectedPlaces.flyFrom"
          v-on:tab-closed="updatePlaces" />
        <div class="searchPanel--searchResults">
          <Places
            v-bind:flyFrom="flyFrom"
            v-bind:selectedPlaces="selectedPlaces.flyFrom"
            v-on:place-selected="updatePlaces"/>
        </div>
        <div class="form--input">
          <label for="searchPanel-to">TO</label>
          <input id="searchPanel-to" type="text" v-model="to">
        </div>
        <PlaceTab
          v-if="selectedPlaces.to"
          identifier='to'
          v-bind:tab="selectedPlaces.to"
          v-on:tab-closed="updatePlaces" />
        <div class="searchPanel--searchResults">
          <Places
            v-bind:to="to"
            v-bind:selectedPlaces="selectedPlaces.to"
            v-on:place-selected="updatePlaces"/>
        </div>
        <div class="form--date">
          <label for="searchPanel-dateFrom">DATE FROM</label>
          <input id="searchPanel-dateFrom" type="date" v-bind:min="dateFrom" v-model="dateFrom">
        </div>
        <div class="form--date">
          <label for="searchPanel-dateTo">DATE TO</label>
          <input id="searchPanel-dateTo" type="date" v-bind:min="dateTo" v-model="dateTo">
        </div>
        <div class="form--date">
          <label for="searchPanel-returnFrom">RETURN FROM</label>
          <input id="searchPanel-returnFrom" type="date" v-bind:min="minReturnFrom" v-model="returnFrom">
        </div>
        <div class="form--date">
          <label for="searchPanel-returnTo">RETURN TO</label>
          <input id="searchPanel-returnTo" type="date" v-bind:min="minReturnTo" v-model="returnTo">
        </div>
        <div class="form--submit">
          <input type="submit" value="Find flights">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import { bus } from '../utils.js';
import fetchFilterData from '../managers/filterManager.js';

// components
import Places from './Places';
import PlaceTab from './PlaceTab';

const DATE_FORMAT = 'YYYY-MM-DD';
const RESULTS_FETCHED = 'results-fetched';


export default {
  name: 'SearchPanel',
  data () {
    return {
      flyFrom: '',
      to: '',
      dateFrom: moment().format(DATE_FORMAT),
      dateTo: moment().add(1, 'M').format(DATE_FORMAT),
      returnFrom: '',
      returnTo: '',
      selectedPlaces: {}
    }
  },
  methods: {
    updatePlaces(spec, remove = false) {

      console.log(spec);

      // resolves to a value from 'to' or 'from' data properties
      const key = Object.keys(spec)[0];

      // if remove arg is provideds
      if (remove) {

        //then remove the appropriate key
        // and update the selectedPlaces data property
        const updatedPlaces = Object.assign({}, this.selectedPlaces);
        delete updatedPlaces[key];

        this.selectedPlaces = updatedPlaces;
        return;
      }

      // updates places data prop
      // whenever child component emits an event
      this.selectedPlaces = Object.assign({}, this.selectedPlaces, spec);

      // update to or flyFrom data property
      this[key] = ''
    },
    fetchSearchResults(e) {

      const queryParams = {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        returnFrom: this.returnFrom,
        returnTo: this.returnTo,
        selectedPlaces: this.formatedSelectedPlaces
      };

      fetchFilterData(queryParams)
        .then((respose) => bus.$emit(RESULTS_FETCHED, respose.data));
    }
  },
  computed: {
    minReturnFrom() {

      return moment().format(DATE_FORMAT);
    },
    minReturnTo() {

      return moment().add(1, 'M').format(DATE_FORMAT);
    },
    formatedSelectedPlaces() {

      return Object.keys(this.selectedPlaces)
        .map((key) => ({[key]: this.selectedPlaces[key].id}));
    }
  },
  components: {
    Places,
    PlaceTab
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .searchPanel--wrapper {
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
