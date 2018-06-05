<template>
  <div class="main-page">
    <div class="main-container mdc-elevation--z2">
      <div class="main-header">
        <img class="logo" src="@/assets/logo.png">
        <div class="main-header-text mdc-typography--headline4">
          English Paper Piecing
        </div>
        <div class="main-header-sub-text mdc-typography--headline5">
          Hexagons for everyone!
        </div>
      </div>
      <slot class="main-content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainContainer',
  data() {
    return {
      currentUserFullName: undefined,
    };
  },
  mounted() {
    this.currentUserFullName = this.$store.state.userFullName;
  },
};
</script>

<style lang="scss">
.main-page {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #efefef;
  background-image: url('/img/hexagon_tile.png');
  background-repeat: repeat;

  .main-container {
    width: 90%;
    max-width: 450px;
    margin: 0 20px;
    padding: 10px;

    text-align: center;

    background-color: #ffffff;
    overflow-y: auto;
    max-height: 95%;

    .main-header {
      margin: 5px;
      .logo {
        height: 150px;
      }
      .main-header-text, .main-header-sub-text {
        font-family: Tillana;
      }
    }
  }
}
</style>
