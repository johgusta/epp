<template>
  <div id="outer-board-container">
    <div id="main-board"></div>
    <Overlay v-if="hexagonBoard" :board="hexagonBoard" :pattern="pattern"
            v-on:overlay-ready="overlayReady"/>
  </div>
</template>

<script>
import Overlay from '@/components/Overlay.vue';
import HexagonBoard from '@/hexagons/hexagonBoard.js';

export default {
  name: 'Board',
  props: {
    pattern: Object,
  },
  components: {
    Overlay,
  },
  data() {
    return {
      hexagonBoard: undefined,
    }
  },
  methods: {
    overlayReady() {
      this.hexagonBoard.draw();
    },
  },
  mounted() {
    const mainBoardEl = this.$el.querySelector('#main-board');
    this.hexagonBoard = new HexagonBoard(mainBoardEl, this.pattern);
    window.Board = this.hexagonBoard;
  },
};
</script>

<style lang="scss">
#outer-board-container, #main-board {
  width: 100%;
  height: 100%;
}
</style>
