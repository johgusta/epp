
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const firebaseConfig = {
  apiKey: 'AIzaSyDbDHT11Hha_paOSzu35XcejJ-31qlo8jc',
  authDomain: 'english-paper-piecing.firebaseapp.com',
  databaseURL: 'https://english-paper-piecing.firebaseio.com',
  projectId: 'english-paper-piecing',
  storageBucket: 'english-paper-piecing.appspot.com',
  messagingSenderId: '36350522881',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

let firestore;

const firestoreInitializedCallbacks = [];

function firestoreInitialized() {
  firestore = firebase.firestore();
  firestoreInitializedCallbacks.forEach(callback => callback());
}

function getFirestoreInstance() {
  return new Promise((resolve) => {
    if (firestore) {
      resolve(firestore);
    } else {
      firestoreInitializedCallbacks.push(() => resolve(firestore));
    }
  });
}

const settings = { timestampsInSnapshots: true };
firebase.firestore().settings(settings);
firebaseApp.firestore()
  .enablePersistence()
  .then(() => {
    // Initialize Cloud Firestore through firebase
    firestoreInitialized();
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
      console.warn('Firebase already enabled in another tab');
      firestoreInitialized();
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
      console.warn('Browser does not support offline persistence');
      firestoreInitialized();
    }
  });

const CLIENT_ID =
  '36350522881-c9nukpad4d36fqvrsklm1e7kup7uqm6m.apps.googleusercontent.com';
const uiConfig = {
  signInFlow: 'redirect',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      authMethod: 'https://accounts.google.com',
      clientId: CLIENT_ID,
    },
  ],
  callbacks: {
    // Called when the user has been successfully signed in.
    // Avoid redirect after sign in
    signInSuccessWithAuthResult(authResult) {
      if (authResult.user && authResult.additionalUserInfo) {
        console.log('sign in success');
        if (authResult.additionalUserInfo.isNewUser) {
          console.log('sign in new user!');
          const user = authResult.user;
          const userProfile = authResult.additionalUserInfo.profile;
          const userId = user.uid;
          const newUser = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          };
          if (userProfile.given_name) {
            newUser.given_name = userProfile.given_name;
          }
          if (userProfile.family_name) {
            newUser.family_name = userProfile.family_name;
          }
          firestore.collection('users').doc(userId).set(newUser);
        }
      }
      return false;
    },
  },
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

const authStateChangedCallbacks = [];

let currentUserUid;

firebase.auth().onAuthStateChanged((user) => {
  currentUserUid = user ? user.uid : undefined;
  console.log(`on auth state changed: ${currentUserUid}`);

  authStateChangedCallbacks.forEach((callback) => {
    callback.call(this, user);
  });
});

const FirebaseHelper = {
  getFirebase() {
    return firebase;
  },
  getFirestore() {
    return new Promise((resolve, reject) => {
      if (currentUserUid) {
        resolve(getFirestoreInstance());
      } else {
        const callbackPosition = authStateChangedCallbacks.push(() => {
          authStateChangedCallbacks.splice(callbackPosition - 1, 1);
          if (currentUserUid) {
            resolve(getFirestoreInstance());
          } else {
            reject(new Error('No user available'));
          }
        });
      }
    });
  },
  getAuthUi() {
    return ui;
  },
  getCurrentUser() {
    return firebase.auth().currentUser;
  },
  getServerTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  },
  signOut() {
    return firebase.auth().signOut();
  },
  onAuthStateChanged(callback) {
    authStateChangedCallbacks.push(callback);
  },
  startAuthUi(elementSelector) {
    ui.start(elementSelector, uiConfig);
  },
  isPendingRedirect() {
    return ui.isPendingRedirect();
  },
};

export default FirebaseHelper;
