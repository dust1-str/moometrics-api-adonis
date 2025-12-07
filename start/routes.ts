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
const StablesController = () => import('#controllers/stables_controller')
const ChatbotController = () => import('#controllers/chatbot_controller')
const DataGeneratorController = () => import('#controllers/data_generator_controller')

// Rutas Auth
router.group(() => {
  router.post('/register', [AuthController, 'register']) 
  router.post('/login', [AuthController, 'login'])
}).prefix('/auth')

// Ruta de verificación OTP (sin protección)
router.post('/auth/verify-otp', [AuthController, 'verifyOtp'])

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
  router.post('/', [ChannelsController, 'store'])
  router.get('/:id', [ChannelsController, 'show'])
  router.put('/:id', [ChannelsController, 'update'])
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

// Rutas Stables
router.group(() => {
  router.get('/', [StablesController, 'index'])
  router.post('/', [StablesController, 'store'])
  router.get('/active', [StablesController, 'active'])
  router.get('/:id', [StablesController, 'show'])
  router.put('/:id', [StablesController, 'update'])
  router.delete('/:id', [StablesController, 'destroy'])
  router.get('/:id/channels', [StablesController, 'channels'])
}).prefix('/stables').use(middleware.auth())

// Rutas Chatbot
router.group(() => {
  router.post('/command', [ChatbotController, 'sendCommand'])
}).prefix('/chatbot').use(middleware.auth())

// Rutas Data Generator (Generación de datos de prueba)
router.group(() => {
  router.post('/inventory', [DataGeneratorController, 'generateInventory'])
  router.post('/events', [DataGeneratorController, 'generateEvents'])
  router.delete('/clear', [DataGeneratorController, 'clearData'])
}).prefix('/data-generator').use(middleware.auth())

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

