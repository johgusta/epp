

// import page from 'page';
import axios from 'axios';
import Cookie from 'js-cookie';

const csrfTokenName = 'customcsrftoken';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = csrfTokenName;
axios.defaults.withCredentials = true;

console.log(`Using API_URL as ${process.env.VUE_APP_API_URL}`);
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // Configured in environment variables
});

// Add a response interceptor
api.interceptors.response.use((response) => {
  const accessToken = response.headers['access-token'];
  Cookie.set(csrfTokenName, accessToken);
  return response;
});

const callbackSuffix = '/login/callback';

function ApiService() {

}

function getGoogleClientId() {
  return api.get('google-client-id/').then((response) => {
    const data = response.data;
    return data.client_id;
  }).catch((error) => {
    console.error('Failed to fetch client id', error);
    throw error;
  });
}

function getCurrentUri() {
  const currentLocation = window.location;
  let currentUri = `${currentLocation.protocol}//${currentLocation.hostname}`;
  if (currentLocation.port !== '') {
    currentUri += `:${currentLocation.port}`;
  }
  return currentUri;
}

function redirectToGoogleLogin(clientId) {
  const redirectUri = getCurrentUri() + callbackSuffix;

  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?redirect_uri=${encodeURIComponent(redirectUri)}`;
  url += `&client_id=${clientId}`;
  url += '&prompt=consent';
  url += '&response_type=code';
  url += '&scope=openid%20email%20profile';
  url += '&access_type=offline';

  window.location = url;
}

ApiService.prototype.login = function login() {
  console.log('ApiService login called');
  getGoogleClientId().then((clientId) => {
    redirectToGoogleLogin(clientId);
  }).catch((error) => {
    console.error('Failed to login user', error);
    throw error;
  });
};

ApiService.prototype.logout = function logout() {
  return api.get('/api-auth/logout/').then(() => {
    console.log('Logout successful');
    // page('/login');
  }).catch((error) => {
    console.log('Logout error', error.response);
    throw error;
  });
};

ApiService.prototype.loginWithGoogleCode = function loginWithGoogleCode(code) {
  console.log('Log in with google code');
  const redirectUri = getCurrentUri() + callbackSuffix;
  return api.post('api/login/social/session/', {
    redirect_uri: redirectUri,
    provider: 'google-oauth2',
    code,
  }).then((response) => {
    console.log('Success api login', response);
    return response;
  }).catch((error) => {
    console.error('Failed api login', error);
    throw error;
  });
};

ApiService.prototype.getUser = function getUser() {
  return api.get('user/').then((response) => {
    const apiUser = response.data;

    const user = {
      id: apiUser.id,
      username: apiUser.username,
      firstName: apiUser.first_name,
      lastName: apiUser.last_name,
      email: apiUser.email,
    };
    user.fullName = `${user.firstName} ${user.lastName}`;
    return user;
  }).catch((error) => {
    const errorResponse = error.response;
    if (errorResponse && errorResponse.status === 403) {
      console.log('User is not logged in');
      return undefined;
    }
    console.error('Error getting user', error);
    throw error;
  });
};

ApiService.prototype.getPatterns = function getPatterns() {
  return api.get('/patterns/').then((response) => {
    const patterns = response.data;
    return patterns;
  }, (error) => {
    console.error('Error loading user patterns', error);
    throw error;
  });
};

ApiService.prototype.addPattern = function addPattern(pattern) {
  return api.post('/patterns/', pattern).then((response) => {
    const apiPattern = response.data;
    console.log(`Added pattern: ${apiPattern.id}`);
    return apiPattern;
  }).catch((error) => {
    console.error('Error adding pattern', error);
    throw error;
  });
};

ApiService.prototype.getPattern = function getPattern(id) {
  return api.get(`/patterns/${id}/`).then((response) => {
    const patterns = response.data;
    return patterns;
  }, (error) => {
    console.error(`Error fetching pattern: ${id}`, error);
    throw error;
  });
};

ApiService.prototype.updatePattern = function updatePattern(id, pattern) {
  return api.put(`/patterns/${id}/`, pattern).then((response) => {
    const apiPattern = response.data;
    console.log(`Update pattern: ${apiPattern.id}`);
    return apiPattern;
  }, (error) => {
    console.error(`Error updating pattern: ${id}`, error);
    throw error;
  });
};

ApiService.prototype.deletePattern = function deletePattern(id) {
  return api.delete(`/patterns/${id}/`).then(() => {
    console.log(`Deleted pattern: ${id}`);
    return undefined;
  }).catch((error) => {
    console.error(`Error deleting pattern: ${id}`, error);
    throw error;
  });
};

const apiService = new ApiService();

export default apiService;
