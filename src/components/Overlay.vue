<template>
  <div class="overlayDiv">
      <button id="menu-drawer-button" class="mdc-fab material-icons menu-drawer-button"
              aria-label="Menu">
            <span class="mdc-fab__icon">
              menu
            </span>
      </button>
      <div class="colorSelectionContainer">
          <div class="mdc-elevation--z2 currentColorSelector">
              <span>Current color:</span>
              <input type="text" class="colorPicker" style="display: none;">
          </div>
          <canvas id="colorsCanvas" class="mdc-elevation--z2" width="80" height="36"></canvas>
      </div>
      <aside id="drawer-menu" class="mdc-drawer mdc-drawer--temporary mdc-typography">
          <nav class="mdc-drawer__drawer">
              <header class="mdc-drawer__header mdc-theme--primary-bg mdc-theme--on-primary">
                  <div class="mdc-drawer__header-content">
                      <div class="header-drawer-content">
                          <div class="logo-container">
                              <img class="drawer-logo" src="@/assets/logo.png">
                          </div>
                          <div class="header-text-content">
                              <div class="active-pattern-text">
                                  Active pattern:
                              </div>
                              <div class="current-pattern">
                                  {{patternTitle}}
                              </div>
                          </div>
                      </div>
                  </div>
              </header>

              <div class="mdc-list-group mdc-drawer__content drawer-navigation-list">
                  <h3 class="mdc-list-group__subheader drawer-sub-headers">Tools</h3>
                  <ul class="mdc-list">
                      <li id="drawer-item-save" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            save
                          </i>
                          Save
                      </li>
                      <li id="drawer-item-save-as" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            save_alt
                          </i>
                          Save As
                      </li>
                      <li id="drawer-item-export" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            share
                          </i>
                          Export
                      </li>
                      <li id="drawer-item-delete" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            delete
                          </i>
                          Delete
                      </li>
                  </ul>

                  <hr class="mdc-list-divider">
                  <h3 class="mdc-list-group__subheader drawer-sub-headers">Settings</h3>
                  <ul class="mdc-list">
                      <li id="drawer-item-library" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            list
                          </i>
                          Pattern Library
                      </li>
                      <li id="drawer-item-sign-out" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            account_circle
                          </i>
                          Log Out
                      </li>
                  </ul>
              </div>
          </nav>
      </aside>
      <aside id="save-as-pattern-dialog"
             class="mdc-dialog"
             role="alertdialog"
             aria-labelledby="save-as-pattern-dialog-label"
             aria-describedby="save-as-pattern-dialog-description">
          <div class="mdc-dialog__surface">
              <header class="mdc-dialog__header">
                  <h2 id="save-as-pattern-dialog-label" class="mdc-dialog__header__title">
                      Rename pattern
                  </h2>
              </header>
              <section id="create-pattern-dialog-description" class="mdc-dialog__body">
                  <div class="mdc-text-field mdc-text-field--fullwidth">
                      <input class="mdc-text-field__input"
                             type="text"
                             placeholder="Pattern name"
                             aria-label="Pattern name">
                  </div>
              </section>
              <footer class="mdc-dialog__footer">
                  <button type="button" class="mdc-button mdc-dialog__footer__button
                    mdc-dialog__footer__button--cancel">Cancel</button>
                  <button type="button" class="mdc-button mdc-button--unelevated
                    mdc-dialog__footer__button mdc-dialog__footer__button--accept">Save</button>
              </footer>
          </div>
          <div class="mdc-dialog__backdrop"></div>
      </aside>
  </div>
</template>

<script>
import Overlay from '@/hexagons/overlay';

export default {
  name: 'Overlay',
  props: {
    board: Object,
    pattern: Object,
  },
  data() {
    return {
      patternTitle: this.pattern.title,
      username: this.$store.state.userFullName,
    };
  },
  mounted() {
    this.overlay = new Overlay(this.$el, this.board);
    this.$emit('overlay-ready');
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

.colorSelectionContainer {
  position: absolute;
  right: 10px;
  bottom: 10px;
  pointer-events: auto;
}

.currentColorSelector {
  width: 80px;
  min-height: 25px;
  margin-bottom: 6px;
  padding: 5px;

  background: #f6f6f6;
  border: 1px solid #c2c2c2;
}

#colorsCanvas {
  background: #f6f6f6;
  border: 1px solid #c2c2c2;
}

div.colorInput {
  display: table;
  background: #ffffff;
  border-color: #c2c2c2;
  border-radius: 4px;
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
