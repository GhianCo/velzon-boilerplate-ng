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
  api: 'http://masaris.pe/cash-control-api',
  apiRest: 'api/',
  publicRest: 'public/',
  jwtSecret: 'D3v3lop3rQullqi2022@!*!',
  endpoints: {
    auth: {
      signIn: 'auth/sign-in',
    }
  },
  apiControlActivos: 'http://masaris.pe/control-activos-masaris',
  apiWorkers: 'http://masaris.pe/workers',
};
