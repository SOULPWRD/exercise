<template>
  <div class="filterResults--wrapper" v-if="results">
    <div class="filterResults--controls">
      <button class="btn btn-hide" v-if="visible" v-on:click="setVisible(false)">hide</button>
      <button class="btn btn-show" v-else v-on:click="setVisible(true)">show</button>
    </div>
    <div class="filterResults" v-show="visible">
      <div class="filterResults--title">
        <h3>AVAILABLE FLIGHTS</h3>
      </div>
      <div class="filterResults--main">
        <div class="filterResulst--warning" v-show="results.length === 0">
          <span class="warning"> NO RESULTS FOUND</span>
        </div>
        <ul class="filterResults--list" v-show="results.length > 0">
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
import { bus } from '../utils.js';

const RESULTS_FETCHED = 'results-fetched';

export default {
  name: 'FilterResults',
  data() {
    return {
      visible: false,
      results: undefined
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

<style scoped>
  .filterResults--wrapper {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 14%;
  }

  .filterResults--list {
    position: absolute;
    max-height: 95%;
    overflow-y: auto;
    width: 100%;
  }

  .filterResults--item {
    margin: 5px 0 5px 0;
    padding: 5px 0 7px 0;
    border-bottom: 1px solid black;
  }

</style>

