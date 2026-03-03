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
  jwtSecret: 'D3v3lop3rQullqi2022@!*!',
  endpoints: {
    auth: {
      signIn: 'auth/sign-in',
    }
  },
  apiControlActivos: 'http://localhost/dev_masaris/control-activos-masaris',
  apiWorkers: 'http://localhost/dev_masaris/workers',
};
