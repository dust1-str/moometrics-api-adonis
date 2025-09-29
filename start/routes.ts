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
const ChannelsController = () => import('#controllers/channels_controller')
const MessagesController = () => import('#controllers/messages_controller')

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

// Rutas Channels (Chat)
router.group(() => {
  router.get('/', [ChannelsController, 'index'])
  router.post('/:id', [ChannelsController, 'store'])
  router.get('/:id', [ChannelsController, 'show'])
}).prefix('/channels').use(middleware.auth())

// Rutas Messages (Chat)
router.group(() => {
  router.get('/recent', [MessagesController, 'recent'])
  // router.get('/:id', [MessagesController, 'show'])
  // router.put('/:id', [MessagesController, 'update'])
  // router.delete('/:id', [MessagesController, 'destroy'])
}).prefix('/messages').use(middleware.auth())

// Rutas Messages por Channel (Chat)
router.group(() => {
  router.get('/:channelId/messages', [MessagesController, 'index'])
  router.post('/:channelId/messages', [MessagesController, 'store'])
}).prefix('/channels').use(middleware.auth())

