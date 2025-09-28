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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Authentication Routes
router.group(() => {
  router.post('/register', [AuthController, 'register']) 
  router.post('/login', [AuthController, 'login'])        
}).prefix('/auth')

// CRUD Routes para Users
router.group(() => {
  router.get('/', [UsersController, 'index'])      
  router.post('/', [UsersController, 'store'])
  router.get('/:id', [UsersController, 'show'])    
  router.put('/:id', [UsersController, 'update'])  
  router.delete('/:id', [UsersController, 'destroy'])
}).prefix('/users').use(middleware.auth())


