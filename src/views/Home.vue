<template>
  <MainContainer>
    <LoadingSpinner v-show="loading"/>
    <div v-show="!loading" class="home-content">
      <div id="firebaseui-container"></div>
      <div v-show="userDisplayName" class="logged-in">
        <div>
          <mdc-button raised @click="openPatternLibrary">
            Open Pattern Library
          </mdc-button>
        </div>
        <div>
          <mdc-button outlined @click="signOutUser">
            Log out {{userDisplayName}}
          </mdc-button>
        </div>
      </div>
    </div>
  </MainContainer>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import MainContainer from '@/components/MainContainer.vue';
import FirebaseHelper from '@/js/firebaseHelper';
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
      authStarted: false,
    };
  },
  computed: {
    userDisplayName() {
      return this.$store.getters.userDisplayName;
    },
  },
  watch: {
    userDisplayName() {
      this.startSignInContainer();
    },
  },
  methods: {
    signInWithGoogle() {
      ApiService.login();
    },
    openPatternLibrary() {
      this.$router.push({ name: 'library' });
    },
    signOutUser() {
      this.loading = true;
      FirebaseHelper.signOut().then(() => {
        this.loading = false;
      });
    },
    startSignInContainer() {
      if (!this.userDisplayName && !this.authStarted) {
        FirebaseHelper.startAuthUi('#firebaseui-container');
        this.authStarted = true;
      }
    },
  },
  mounted() {
    this.startSignInContainer();
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
