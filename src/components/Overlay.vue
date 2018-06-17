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
                  <h3 class="mdc-list-group__subheader drawer-sub-headers">File</h3>
                  <ul class="mdc-list">
                      <li @click="save" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            save
                          </i>
                          Save
                      </li>
                      <li @click="saveAs" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            save_alt
                          </i>
                          Save As
                      </li>
                      <li @click="exportPattern" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            share
                          </i>
                          Export
                      </li>
                      <li @click="deletePattern" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            delete
                          </i>
                          Delete
                      </li>
                  </ul>

                  <hr class="mdc-list-divider">
                  <h3 class="mdc-list-group__subheader drawer-sub-headers">Other</h3>
                  <ul class="mdc-list">
                      <li @click="openLibrary" class="mdc-list-item">
                          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
                            list
                          </i>
                          Pattern Library
                      </li>
                      <li @click="signOut" class="mdc-list-item">
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
                      Save pattern as
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
import { MDCTemporaryDrawer } from '@material/drawer';
import { MDCDialog } from '@material/dialog';
import { MDCTextField } from '@material/textfield';

import FirebaseHelper from '@/js/firebaseHelper';
import ColorSelector from '@/components/ColorSelector.vue';

export default {
  name: 'Overlay',
  components: {
    'color-selector': ColorSelector,
  },
  props: {
    board: Object,
    pattern: Object,
  },
  data() {
    return {
      patternTitle: this.pattern.title,
      username: this.$store.state.userFullName,
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
      this.drawer.open = true;
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
    save() {
      this.board.savePattern().then(() => {
        this.drawer.open = false;
      });
    },
    saveAs() {
      this.saveAsPatternDialog.show();
    },
    exportPattern() {
      this.board.exportPattern();
      this.drawer.open = false;
    },
    deletePattern() {
      this.board.deletePattern().then(() => {
        this.openLibrary();
      });
    },
    openLibrary() {
      this.$router.push({ name: 'library' });
    },
    signOut() {
      FirebaseHelper.signOut().then(() => {
        this.$router.push({ name: 'home' });
      });
    },
    selectColor(colorValue) {
      this.board.setCurrentColor(colorValue);
    },
  },
  mounted() {
    const drawerContainer = this.$el.querySelector('#drawer-menu');
    this.drawer = new MDCTemporaryDrawer(drawerContainer);

    const saveAsPatternElm = this.$el.querySelector('#save-as-pattern-dialog');
    const patternNameField = new MDCTextField(saveAsPatternElm.querySelector('.mdc-text-field'));

    this.saveAsPatternDialog = new MDCDialog(saveAsPatternElm);
    this.saveAsPatternDialog.listen('MDCDialog:accept', () => {
      if (patternNameField.value) {
        this.board.savePatternAs(patternNameField.value).then((newPattern) => {
          this.$router.push({ name: 'pattern', params: { id: newPattern.id } });
        });
      }
    });
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
