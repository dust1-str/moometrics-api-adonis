import fs from 'fs'
import admin from 'firebase-admin'
import env from '#start/env'

const path = env.get('FIREBASE_SERVICE_ACCOUNT_PATH')!
const serviceAccount = JSON.parse(fs.readFileSync(path, 'utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin
