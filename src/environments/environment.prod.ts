export const environment = {
  production: true,
  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  // -------------------------------\\
  api: 'http://10.45.1.171:84/cash-control-api',
  apiRest: 'api/',
  publicRest: 'public/',
  jwtSecret: 'D3v3lop3rQullqi2022@!*!',
  endpoints: {
    auth: {
      signIn: 'auth/sign-in',
    }
  },
  apiControlActivos: 'https://10.45.1.171/control-activos-masaris',
  apiWorkers: 'https://10.45.1.171/workers',
};
