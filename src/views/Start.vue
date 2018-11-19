<template>
    <div class="start-full-page">
        <div class="header">
            <span class="menu-title">
                <img class="menu-logo" src="@/assets/logo.png">
                <h3 class="title">Hexagons of Awesome</h3>
            </span>

            <span class="navigation-menu">
                <span class="login-button">
                    <mdc-button v-show="!userDisplayName" raised @click="logIn">
                        Log in
                    </mdc-button>

                    <mdc-button v-show="userDisplayName" raised @click="logOut">
                        Log out
                    </mdc-button>
                </span>
                <mdc-button v-show="userDisplayName" raised @click="openPatternLibrary">
                    Open patterns
                </mdc-button>
            </span>
        </div>
        <div class="main-content">
            <h1>Hexagons of Awesome</h1>
            <div>
                Much information about english paper piecing
            </div>
        </div>


        <div class="footer">
            <div>Contact at:</div>
            <div>hexagons@ofawesome.se</div>
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

    .menu-title {
        margin-left: 20px;

        .menu-logo {
            width: 40px;
            margin: 12px 20px -12px 0;
        }
        .title {
            display: inline-block;
        }
    }
    .navigation-menu {
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    button.mdc-button {
        margin: 5px;
        background-color: $mdc-theme-secondary;
        color: $mdc-theme-on-secondary;
        white-space: nowrap;
    }
}
.main-content {
    flex: auto;
    background-color: #fdfdfd;
}
.footer {
    flex: none;
    height: 60px;
    font-size: 14px;
    background-color: $mdc-theme-primary;
    color: $mdc-theme-on-primary;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
