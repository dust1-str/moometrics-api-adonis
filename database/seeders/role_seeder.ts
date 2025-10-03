import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    // Crear roles básicos del sistema
    await Role.updateOrCreateMany('name', [
      {
        name: 'admin',
        description: 'Administrador del sistema con acceso completo'
      },
      {
        name: 'dev',
        description: 'Desarrollador con permisos de desarrollo y testing'
      },
      {
        name: 'user',
        description: 'Usuario con permisos básicos'
      }
    ])
  }
}