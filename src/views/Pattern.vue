<template>
  <div id="pattern-container">
    <LoadingSpinner v-if="!pattern"/>
    <Board v-if="pattern" :pattern="pattern"/>
  </div>
</template>

<script>
import Board from '@/components/Board.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import PatternHandler from '@/js/patternHandler';

export default {
  components: {
    Board,
    LoadingSpinner,
  },
  data() {
    return {
      pattern: undefined,
    };
  },
  mounted() {
    PatternHandler.loadPattern(this.$route.params.id).then((pattern) => {
      this.pattern = pattern;
    });
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
