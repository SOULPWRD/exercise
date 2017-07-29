<template>
  <div id="app">
    <Search />
    <FilterResults />
  </div>
</template>

<script>
import Search from './components/Search'
import FilterResults from './components/FilterResults';

export default {
  name: 'app',
  components: {
    Search,
    FilterResults
  }
}
</script>

<style>
</style>
