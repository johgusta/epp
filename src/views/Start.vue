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
            <div class="section">
                <p>
                    An online design tool for English Paper Piecing.
                </p>
            </div>
            <div class="section section-with-image">
                <div class="text-image">Pattern image here</div>
                <p class="image-text">
                    Create your own patterns and calculate the number of pieces required.
                </p>
            </div>

            <div class="section">
                <p>This simple, online design tool just works.</p>
                <ul>
                    <li>Set out colors to make the patterns in your head.</li>
                    <li>See the total piece count for each color so you can plan out
                        your materials.</li>
                    <li>Save your pattern to edit later.</li>
                    <li>Export a .png image of your pattern to save and print at home.</li>
                </ul>

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
    min-height: 100vh;

    font-size: 20px;

    display: flex;
    flex-direction: column;
}
.header {
    height: 150px;
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
    flex: 1;
    background-color: #f8f8ff;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 5px;

    p {
        margin: 0;
    }

    .section {
        max-width: 600px;
        margin: 20px 5px;
        align-self: center;

        ul {
            margin: 0;
            padding: 20px;
            list-style-type: none;
            font-size: 0.8em;

            li {
                margin-bottom: 5px;
            }
            li:before {
                display: inline-block;
                content: "-";
                width: 1em;
                margin-left: -1em;
            }
        }
    }

    .section-with-image {
        display: flex;
        flex-direction: column;

        @media (min-width: 500px) {
            flex-direction: row;
        }
        .text-image {
            flex: none;
            align-self: center;
            width: 220px;
            height: 220px;
            background-color: #cdcdcd;
        }
        .image-text {
            margin: 20px;
        }
    }
}
.footer {
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
