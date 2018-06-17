<template>
  <div class="colorSelectionContainer">
    <color-picker v-show="colorPickerOpen" class="colorPicker"
      :value="selectedColor" @input="selectColor($event.hex)" disableAlpha/>
    <div class="currentColors">
      <button class="currentColorButton mdc-fab" @click="colorPickerOpen = !colorPickerOpen"
        :style="'background-color: ' + selectedColor">
      </button>
      <colors-list v-show="colors.length > 0" :colors="colors"
        :current-color="selectedColor" @color-changed="selectColor"/>
    </div>
  </div>
</template>

<script>
import { Chrome } from 'vue-color';
import ColorsList from '@/components/ColorsList.vue';

export default {
  name: 'ColorSelector',
  components: {
    'color-picker': Chrome,
    'colors-list': ColorsList,
  },
  props: {
    colors: Array,
    currentColor: String,
  },
  data() {
    return {
      selectedColor: this.currentColor,
      colorPickerOpen: false,
    };
  },
  watch: {
    currentColor(newColor) {
      this.selectedColor = newColor;
    },
  },
  methods: {
    selectColor(colorValue) {
      console.log('color has changed!', colorValue);
      this.$emit('color-changed', colorValue);
    },
  },
};
</script>

<style lang="scss">

.colorSelectionContainer {
  position: absolute;
  right: 0px;
  bottom: 0px;

  display: flex;
  align-items: flex-end;

  .colorPicker {
    margin: 6px 4px;
    pointer-events: auto;
  }

  .currentColors {
    width: 100px;
    margin: 6px;

    .currentColorButton {
      display: block;
      margin: 6px auto;
      pointer-events: auto;
      cursor: pointer;
    }
  }
}
</style>
