<template>
  <MainContainer>
    <LoadingSpinner v-show="loading"/>
    <div v-show="!loading" class="home-content">
      <mdc-button v-show="currentUser" raised @click="deleteUser">
        <i class="material-icons mdc-button__icon" aria-hidden="true">person</i>
        Delete user
      </mdc-button>
      <div id="firebaseui-container"></div>
      <div v-show="currentUser" class="logged-in">
        <div>
          <mdc-button raised @click="openPatternLibrary">
            Open Pattern Library
          </mdc-button>
        </div>
        <div>
          <mdc-button outlined @click="signOutUser">
            Log out {{currentUser}}
          </mdc-button>
        </div>
      </div>
    </div>
  </MainContainer>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import MainContainer from '@/components/MainContainer.vue';
import ApiService from '@/js/apiService';

export default {
  name: 'home',
  components: {
    LoadingSpinner,
    MainContainer,
  },
  data() {
    return {
      loading: false,
      currentUser: undefined,
    };
  },
  methods: {
    signInWithGoogle() {
      console.log('sign in with google');
      ApiService.login();
    },
    deleteUser() {
      console.log('delete user');
      this.$firebase.auth().currentUser.delete();
    },
    openPatternLibrary() {
      this.$router.push({ name: 'library' });
    },
    signOutUser() {
      this.loading = true;
      ApiService.logout().then(() => {
        this.loading = false;
        this.currentUser = undefined;
      });
    },
  },
  mounted() {
    this.$firebase.auth().onAuthStateChanged(() => {
      this.loading = false;
      this.currentUser = this.$store.state.userFullName;

      if (!this.$store.state.userFullName) {
        this.$authUi.start('#firebaseui-container', this.$authUiConfig);
      }
    });
  },
};
</script>

<style lang="scss">
.home-content {
  margin: 20px;
  .logged-in {
    .mdc-button {
      margin: 5px;
    }
  }
}
</style>
