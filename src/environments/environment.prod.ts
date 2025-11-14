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
  api: 'http://localhost/cash-control-back',
  apiRest: 'api/',
  publicRest: 'public/',
  endpoints: {
    auth: {
      signIn: 'auth/sign-in',
    }
  },
  apiLiquidaciones: 'http://10.45.1.171/control-activos-masaris',
};
