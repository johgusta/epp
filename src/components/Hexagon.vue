<template>
  <img :src="imageDataUrl"/>
</template>

<script>
import Hexagon from '@/hexagons/hexagon';

const selectedSizeRatio = 1.4;

export default {
  name: 'Hexagon',
  props: {
    color: String,
    width: Number,
    selected: Boolean,
  },
  data() {
    return {
      imageDataUrl: this.createImageData(),
    };
  },
  watch: {
    selected() {
      this.imageDataUrl = this.createImageData();
    },
  },
  methods: {
    createImageData() {
      const width = this.selected ? Math.round(this.width * selectedSizeRatio) : this.width;
      const color = this.color;
      const hexagon = Hexagon.calculateHexagon(width);

      const canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = Math.ceil(hexagon.height);
      const context = canvas.getContext('2d');

      const borderColor = 'rgba(0, 0, 0, 0.2)';
      Hexagon.drawHexagon(context, 0, 0, width, borderColor, color);

      const dataUrl = canvas.toDataURL();
      return dataUrl;
    },
  },
};
</script>
