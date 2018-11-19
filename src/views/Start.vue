<template>
    <div class="start-full-page">
        Hello Start

        <mdc-button v-show="userDisplayName" raised @click="openPatternLibrary">
            Open pattern library
        </mdc-button>

        <div class="login-button">
            <mdc-button v-show="!userDisplayName" raised @click="logIn">
                Log in
            </mdc-button>

            <mdc-button v-show="userDisplayName" raised @click="logOut">
                Log out
            </mdc-button>
        </div>
    </div>
</template>

<script>
import FirebaseHelper from '@/js/firebaseHelper';

export default {
  name: 'start',
  computed: {
    userDisplayName() {
      return this.$store.getters.userDisplayName;
    },
  },
  methods: {
    logIn() {
      this.$router.push({ name: 'login' });
    },
    logOut() {
      FirebaseHelper.signOut();
    },
    openPatternLibrary() {
      this.$router.push({ name: 'library' });
    }
  }
};
</script>

<style lang="scss">
.start-full-page {
    width: 100%;
    height: 100%;
    background-color: orange;
}
.login-button {
    float: right;
    margin: 10px;
}
</style>
