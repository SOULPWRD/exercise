<template>
  <div class="placeTab">
    <span class="placeTab--title">{{ tab && tab.name }}</span>
    <button class="btn btn-close" v-on:click="closePlaceTab">Close</button>
  </div>
</template>

<script>

const TAB_CLOSED = 'tab-closed';

export default {
  name: 'PlaceTab',
  props: {
    tab: Object,
    identifier: String
  },
  methods: {
    closePlaceTab(e) {

      e.preventDefault();

      const spec = {
        [this.identifier]: this.tab
      };

      this.$emit(TAB_CLOSED, spec, true);
    }
  }
}
</script>
