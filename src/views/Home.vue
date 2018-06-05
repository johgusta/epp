<template>
  <MainContainer>
    <div class="home-header">
      <h1>English Paper Piecing</h1>
      <h2>Hexagons for everyone!</h2>
    </div>
    <LoadingSpinner v-if="loading"/>
    <div v-if="!loading" class="main-content">
      <mdc-button v-if="!currentUser" raised @click="signInWithGoogle">
        <i class="material-icons mdc-button__icon" aria-hidden="true">person</i>
        Sign in with Google
      </mdc-button>
      <div v-if="currentUser" class="logged-in">
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
      loading: true,
      currentUser: undefined,
    };
  },
  methods: {
    signInWithGoogle() {
      console.log('sign in with google');
      ApiService.login();
    },
    openPatternLibrary() {
      this.$router.push({ name: 'library'});
    },
    signOutUser() {
      this.loading = true;
      ApiService.logout().then(() => {
        this.loading = false;
        this.currentUser = this.$store.state.userFullName;
      });
    }
  },
  mounted() {
    ApiService.getUser().then((user) => {
      if (user) {
        this.$store.commit('loginUser', user.fullName);
      } else {
        this.$store.commit('logoutUser');
      }
      this.loading = false;
      this.currentUser = this.$store.state.userFullName
    });
  },
};
</script>

<style lang="scss">
.home-header {
  font-family: Tillana;
}
.logged-in {
  .mdc-button {
    margin: 5px;
  }
}
</style>
