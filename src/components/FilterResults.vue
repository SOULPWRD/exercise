<template>
  <div class="filterResults--wrapper" v-if="results.length > 0">
    <div class="filterResults--controls">
      <button class="btn btn-hide" v-if="visible" v-on:click="setVisible(false)">show</button>
      <button class="btn btn-show" v-else v-on:click="setVisible(true)">show</button>
    </div>
    <div class="filterResults" v-show="visible">
      <div class="filterResults--title">
        <h3>AVAILABLE FLIGHTS</h3>

      </div>
      <div class="filterResults--main">
        <ul>
          <li class="filterResults--item" v-bind:key="result.id" v-for="result in results">
            <div class="item--attribute">
              <span>
                FROM: {{ result.cityFrom }}
              </span>
            </div>
            <div class="item--attribute">
              <span>
                TO: {{ result.cityTo }}
              </span>
            </div>
            <div class="item--attribute">
              <span>
                PRICE: {{ result.price }} EUR
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from './helpers.js';

const RESULTS_FETCHED = 'results-fetched';

export default {
  name: 'FilterResults',
  data() {
    return {
      visible: false,
      results: []
    };
  },
  methods: {
    updateResults(response) {

      this.visible = true;
      this.results = response.data;
    },
    setVisible(value, e) {

      if (e) {
        e.preventDefault();
      }

      this.visible = value;
    }
  },
  created() {
    bus.$on(RESULTS_FETCHED, this.updateResults);
  }
}
</script>

