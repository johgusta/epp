<template>
  <div id="pattern-container">
    <LoadingSpinner v-if="!pattern"/>
    <Board v-if="pattern"/>
  </div>
</template>

<script>
import Board from '@/components/Board.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { types } from '@/store';

export default {
  components: {
    Board,
    LoadingSpinner,
  },
  computed: {
    pattern() {
      return this.$store.getters.pattern;
    },
  },
  methods: {
    loadPattern(patternId) {
      this.$store.dispatch(types.LOAD_PATTERN, patternId);
    },
  },
  beforeRouteUpdate(to) {
    this.$store.commit(types.LOAD_PATTERN, null);
    this.loadPattern(to.params.id);
  },
  mounted() {
    this.$store.commit(types.LOAD_PATTERN, null);
    this.loadPattern(this.$route.params.id);
  },
};
</script>

<style lang="scss">
#pattern-container {
  width: 100%;
  height: 100%;
  text-align: start;
}
</style>
