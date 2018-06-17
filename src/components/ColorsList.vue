<template>
  <div class="currentColorsList mdc-elevation--z2">
    <div class="colorItem" v-for="color in colors" :key="color.id"
        :class="{'mdc-elevation--z4': isSelected(color), selected: isSelected(color)}"
        @click="selectColor(color.name)">
      <hexagon :width="16" :color="color.name" :selected="isSelected(color)"/>
      <span class="colorText">x {{color.count}}</span>
    </div>
  </div>
</template>

<script>
import Hexagon from '@/components/Hexagon.vue';

export default {
  name: 'ColorsList',
  components: {
    hexagon: Hexagon,
  },
  props: {
    colors: Array,
    currentColor: String,
  },
  methods: {
    selectColor(colorValue) {
      this.$emit('color-changed', colorValue);
    },
    isSelected(color) {
      return this.currentColor === color.name;
    },
  },
};
</script>

<style lang="scss">
.currentColorsList {
  background: #f6f6f6;
  border: 1px solid #c2c2c2;
  pointer-events: auto;

  font-size: 14px;
  font-family: Roboto sans-serif;

  max-height: calc(100vh - 150px);
  overflow-y: auto;

  .colorItem {
    border: 1px solid #c2c2c2;
    margin: 8px 4px;
    padding: 2px 4px;

    display: flex;
    align-items: center;
    cursor: pointer;

    &.selected {
      font-size: 18px;
    }
    .colorText {
      margin: 4px 6px;
    }
  }
}
</style>
