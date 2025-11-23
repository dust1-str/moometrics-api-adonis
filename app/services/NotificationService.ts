import admin from '#start/firebase'

export default class NotificationService {
  static async sendToToken(token: string, title: string, body: string, data: any = {}) {
    return admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
      data,
    })
  }

  static async sendToMany(tokens: string[], title: string, body: string, data: any = {}) {
    return admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      data,
    })
  }
}
