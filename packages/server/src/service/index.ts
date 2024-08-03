import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  storageBucket: 'keyo-archive.appspot.com',
});

export default admin;
