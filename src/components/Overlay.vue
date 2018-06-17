<template>
  <div class="overlayDiv">
      <button @click="openMenu" class="mdc-fab material-icons menu-drawer-button"
              aria-label="Menu">
            <span class="mdc-fab__icon">
              menu
            </span>
      </button>
      <div class="copyMenu">
        <mdc-fab icon="file_copy" v-show="isSelecting" @click="copy"></mdc-fab>
        <mdc-fab icon="layers" v-show="isStamping" @click="stamp"></mdc-fab>
        <mdc-fab icon="close" v-show="isSelecting || isStamping" @click="stopSelection"></mdc-fab>
      </div>
      <color-selector :colors="colorsList" :current-color="currentColor"
        @color-changed="selectColor"/>
      <drawer :open.sync="drawerOpen" :board="board" :pattern="pattern" />
  </div>
</template>

<script>
import ColorSelector from '@/components/ColorSelector.vue';
import Drawer from '@/components/Drawer.vue';

export default {
  name: 'Overlay',
  components: {
    'color-selector': ColorSelector,
    drawer: Drawer,
  },
  props: {
    board: Object,
    pattern: Object,
  },
  data() {
    return {
      patternTitle: this.pattern.title,
      username: this.$store.state.userFullName,
      drawerOpen: false,
      colors: [],
    };
  },
  computed: {
    isSelecting() {
      return this.board.isSelecting();
    },
    isStamping() {
      return this.board.isStamping();
    },
    colorsList() {
      return this.board.getColorsList();
    },
    currentColor() {
      return this.board.getCurrentColor();
    },
  },
  methods: {
    openMenu() {
      this.drawerOpen = true;
    },
    copy() {
      this.board.copySelection();
    },
    stamp() {
      this.board.stampSelection();
    },
    stopSelection() {
      this.board.stopSelection();
    },
    selectColor(colorValue) {
      this.board.setCurrentColor(colorValue);
    },
  },
};
</script>

<style lang="scss">
@import "../js/colors.scss";

.overlayDiv {
  position: absolute;
  left: 0px;
  bottom: 0px;

  width: 100%;
  height: 100%;
  pointer-events: none;

  font-family: Segoe UI,Helvetica Neue,Helvetica,Arial,sans-serif;
  font-size: 12px;
}

.menu-drawer-button {
  margin: 4px;
  pointer-events: auto;
}

.copyMenu {
  button {
    margin: 2px;
    pointer-events: auto;
  }
}

.header-drawer-content {
  width: 100%;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drawer-logo {
  height: 100px;
  margin: 10px;
}

.header-text-content > div:first-child {
  font-size: 22px;
}

.header-text-content > div:not(:first-child) {
  font-size: 16px;
  opacity: 0.3;
}

.drawer-navigation-list i.mdc-list-item__graphic {
  color: $mdc-theme-secondary-light;
}

h3.drawer-sub-headers {
  color: $mdc-theme-on-primary;
  background-color: $mdc-theme-primary-light;

  margin: 0;
  padding: 0.75rem 16px;
  font-family: Tillana;
}

#save-as-pattern-dialog {
  pointer-events: auto;
}
</style>
