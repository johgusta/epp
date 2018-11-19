<template>
    <div class="start-full-page">
        <div class="header">
            <span class="menu-title">
                <img class="menu-logo" src="@/assets/logo.png">
                <h3 class="title">Hexagons Of Awesome</h3>
            </span>

            <span class="navigation-menu">
                <mdc-button v-show="userDisplayName" raised @click="openPatternLibrary">
                    Open pattern library
                </mdc-button>
                <span class="login-button">
                    <mdc-button v-show="!userDisplayName" raised @click="logIn">
                        Log in
                    </mdc-button>

                    <mdc-button v-show="userDisplayName" raised @click="logOut">
                        Log out
                    </mdc-button>
                </span>
            </span>
        </div>
        <div class="main-content">
            <h1>Hexagons of awesome</h1>
            <div>
                Much information about english paper piecing
            </div>
        </div>


        <div class="footer">
            Footer
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
    },
  },
};
</script>

<style lang="scss">
@import "@/js/colors.scss";

.start-full-page {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
}
.header {
    height: 105px;
    flex: none;
    background-color: $mdc-theme-primary-light;
    color: $mdc-theme-on-primary;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .menu-logo {
        width: 40px;
        margin: 0 20px -12px 0;
    }
    .menu-title {
        margin: 0 40px;

        .title {
            display: inline-block;
        }
    }
    .navigation-menu {
        margin: 0 40px;
    }

    button.mdc-button {
        margin: 0 10px;
        background-color: $mdc-theme-secondary;
        color: $mdc-theme-on-secondary;
    }
}
.main-content {
    flex: auto;
    background-color: #fdfdfd;
}
.footer {
    flex: none;
    height: 100px;
    background-color: $mdc-theme-primary;
    color: $mdc-theme-on-primary;
}
</style>
