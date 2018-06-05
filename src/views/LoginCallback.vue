<template>
  <MainContainer>
    <h3 v-if="!error">Processing login... </h3>
    <div v-if="error" class="login-callback-error">
      <h3>{{error}}</h3>
      <mdc-button raised @click="goHome">
        Home
      </mdc-button>
    </div>
  </MainContainer>
</template>

<script>
import queryString from 'query-string';
import ApiService from '@/js/apiService.js';
import MainContainer from '@/components/MainContainer.vue';

export default {
  name: 'LoginCallback',
  components: {
    MainContainer,
  },
  data() {
    return {
      error: undefined,
    };
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'home' });
    }
  },
  mounted() {
    console.log('Hello world');
    const parsedParams = queryString.parse(window.location.search);
    const code = parsedParams.code;
    if (code === undefined) {
        this.error = 'Code missing for login callback!';
        return;
    }

    ApiService.loginWithGoogleCode(code).then(() => {
      this.$router.replace({ name: 'home' });
    }, () => {
      this.error = 'Error logging in!';
    });
  },
}
</script>

<style lang="scss">
.login-callback-error {
  color: red;
}
</style>
