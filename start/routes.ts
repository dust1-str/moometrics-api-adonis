/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const RolesController = () => import('#controllers/roles_controller')

// Rutas Auth
router.group(() => {
  router.post('/register', [AuthController, 'register']) 
  router.post('/login', [AuthController, 'login'])        
}).prefix('/auth')

// Rutas Users
router.group(() => {
  router.get('/', [UsersController, 'index'])      
  router.post('/', [UsersController, 'store'])
  router.get('/:id', [UsersController, 'show'])    
  router.put('/:id', [UsersController, 'update'])  
  router.delete('/:id', [UsersController, 'destroy'])
}).prefix('/users').use(middleware.auth())

// Rutas Roles
router.group(() => {
  router.get('/', [RolesController, 'index'])
  router.post('/', [RolesController, 'store'])
  router.get('/:id', [RolesController, 'show'])
  router.put('/:id', [RolesController, 'update'])
  router.delete('/:id', [RolesController, 'destroy'])      
}).prefix('/roles').use(middleware.auth())


