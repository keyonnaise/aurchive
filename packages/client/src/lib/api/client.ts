import axios from 'axios';
import _ from 'lodash';

const API_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5002/keyo-archive/asia-northeast3/api/'
    : 'https://asia-northeast3-keyo-archive.cloudfunctions.net/api/';
// : 'http://localhost:5002/keyo-archive/us-central1/api/';

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  if (typeof localStorage !== 'undefined') {
    const idToken = localStorage.getItem('idToken');

    // console.log(`req: ${idToken}`);

    if (idToken !== null) {
      config.headers.Authorization = idToken;
    }
  }

  return config;
});

client.interceptors.response.use(async (response) => {
  if (typeof localStorage !== 'undefined') {
    const idToken = response.headers['authorization'];

    // console.log(`res: ${idToken}`);

    if (idToken !== undefined) {
      localStorage.setItem('idToken', idToken);
    }
  }

  return response;
});

export default client;
