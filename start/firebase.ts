import admin from 'firebase-admin'
import env from '#start/env'

const serviceAccount = JSON.parse(env.get('FIREBASE_SERVICE_ACCOUNT')!)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin
