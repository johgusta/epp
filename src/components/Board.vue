<template>
  <div id="outer-board-container">
    <div id="main-board"></div>
    <Overlay v-if="hexagonBoard" :board="hexagonBoard"/>
  </div>
</template>

<script>
import Overlay from '@/components/Overlay.vue';
import HexagonBoard from '@/hexagons/hexagonBoard';

export default {
  name: 'Board',
  components: {
    Overlay,
  },
  data() {
    return {
      hexagonBoard: undefined,
    };
  },
  computed: {
    pattern() {
      return this.$store.getters.pattern;
    },
  },
  mounted() {
    const mainBoardEl = this.$el.querySelector('#main-board');
    this.hexagonBoard = new HexagonBoard(mainBoardEl, this.pattern);
    this.hexagonBoard.drawBoard();
    window.Board = this.hexagonBoard;
  },
};
</script>

<style lang="scss">
#outer-board-container, #main-board, #board-container {
  width: 100%;
  height: 100%;
}
#board-container {
  canvas {
    position: absolute;
  }
}
</style>
