import { defineConfig } from '@adonisjs/auth'
import { sessionUserProvider } from '@adonisjs/auth/session'
import { JwtGuard } from '../app/auth/guards/jwt.js'
import env from '#start/env'

const jwtConfig = {
  secret: env.get('APP_KEY'),
  expiresIn: '30m',
}
const userProvider = sessionUserProvider({
  model: () => import('#models/user'),
})

const authConfig = defineConfig({
  default: 'jwt',
  guards: {
    jwt: (ctx) => {
      return new JwtGuard(ctx, userProvider, jwtConfig)
    },
  },
})

export default authConfig