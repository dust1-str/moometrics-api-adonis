import { Resend } from 'resend'

export default class EmailService {
  private static client = new Resend(process.env.RESEND_API_KEY!)

  static async sendEmail({
    to,
    subject,
    html,
    from = 'noreply@paginachidota.lat',
  }: {
    to: string
    subject: string
    html: string
    from?: string
  }) {
    const { data, error } = await this.client.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Resend Email Error:', error)
      throw new Error('No se pudo enviar el email')
    }

    return data
  }
}
