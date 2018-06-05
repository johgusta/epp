<template>
  <MainContainer>
    <div class="library">
      <div class="library-header mdc-theme--primary-bg mdc-theme--on-primary">
        Pattern Library
      </div>

      <mdc-list interactive bordered two-line class="patterns-list">
        <mdc-list-item v-for="pattern in patterns" :key="pattern.id" :id="pattern.id"
                        @click="openPattern(pattern.id)">
          <span>{{pattern.title}}</span>
          <span slot="secondary">Saved: {{pattern.updated}}</span>
        </mdc-list-item>
      </mdc-list>
      <div v-if="patterns.length ===0" class="no-patterns">
        Create your first pattern!
      </div>
      <mdc-fab class="back-button" icon="arrow_back" @click="goBack"></mdc-fab>
      <mdc-fab class="add-pattern" icon="add" @click="addPattern"></mdc-fab>
    </div>
    <aside id="create-pattern-dialog"
           class="mdc-dialog"
           role="alertdialog"
           aria-labelledby="create-pattern-dialog-label"
           aria-describedby="create-pattern-dialog-description">
      <div class="mdc-dialog__surface">
        <header class="mdc-dialog__header">
          <h2 id="create-pattern-dialog-label" class="mdc-dialog__header__title">
            Create new pattern
          </h2>
        </header>
        <section id="create-pattern-dialog-description" class="mdc-dialog__body">
          <mdc-textfield id="pattern-name" fullwidth required
                helptext="Name is required" helptext-validation
                v-model="newPatternName" label="Pattern name"/>
        </section>
        <footer class="mdc-dialog__footer">
          <mdc-button class="mdc-dialog__footer__button--cancel">
            Cancel
          </mdc-button>
          <mdc-button unelevated class="mdc-dialog__footer__button--accept">
            Create
          </mdc-button>
        </footer>
      </div>
      <div class="mdc-dialog__backdrop"></div>
    </aside>
  </MainContainer>
</template>

<script>
import MainContainer from '@/components/MainContainer.vue';
import moment from 'moment';
import { MDCDialog } from '@material/dialog';
import PatternHandler from '@/js/patternHandler';

export default {
  name: 'Library',
  components: {
    MainContainer,
  },
  data() {
    return {
      patterns: [],
      newPatternName: '',
    };
  },
  methods: {
    openPattern(id) {
      console.log(`open pattern id ${id}`);
      this.$router.push({ name: 'pattern', params: { id } });
    },
    addPattern(evt) {
      this.dialog.lastFocusedTarget = evt.target;
      const patternNameTextField = this.$el.querySelector('#pattern-name');
      if (patternNameTextField) {
        patternNameTextField.__vue__.focus();
      }
      this.dialog.show();
    },
    goBack() {
      this.$router.push({ name: 'home' });
    },
  },
  mounted() {
    PatternHandler.getPatterns().then((patterns) => {
      this.patterns = patterns.map(pattern => ({
        id: pattern.id,
        title: pattern.title,
        updated: moment(pattern.updated).fromNow(),
      }));
    });

    const createPatternEl = this.$el.querySelector('#create-pattern-dialog');
    this.dialog = new MDCDialog(createPatternEl);

    this.dialog.listen('MDCDialog:accept', () => {
      if (this.newPatternName) {
        PatternHandler.addPattern(this.newPatternName).then((pattern) => {
          this.openPattern(pattern.id);
        });
      }
    });
    this.dialog.listen('MDCDialog:cancel', () => {
      this.newPatternName = '';
    });
  },
};
</script>

<style lang="scss">

.library {
  .library-header {
    font-size: 22px;
    margin-top: 40px;
    padding: 20px;
    font-family: Tillana;
  }
  .patterns-list {
    padding-top: 0;
    text-align: start;
  }
  .no-patterns {
    opacity: 0.3;
    padding: 15px;
  }
  .back-button {
    float: left;
    margin: 10px;
  }
  .add-pattern {
    float: right;
    margin: 10px;
  }
}
</style>
