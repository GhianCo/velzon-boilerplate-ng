export const environment = {
  production: false,
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
  api: 'http://localhost/cash-control-back',
  apiRest: 'api/',
  publicRest: 'public/',
  endpoints: {
    auth: {
      signIn: 'auth/sign-in',
    }
  },
  apiLiquidaciones: 'https://10.45.1.171/control-activos-masaris',
  apiWorkers: 'https://10.45.1.171/workers',
};
