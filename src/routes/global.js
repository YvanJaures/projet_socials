import express from 'express'
import * as globalController from '../controllers/globalController.js'
import {deConnecterApi,connecterApi} from '../middlewares/auth.js'

const router=express.Router()

// routes
router.get('/icons',globalController.getIconsC)
router.get('/links',globalController.getLinksC)
router.get('/users',globalController.getUsersC)
router.get('/user/name',globalController.getUserByNameC)
router.get('/user/id',globalController.getUserByIdC)

router.post('/user/add',globalController.addUserC)
router.post('/link/add',globalController.addLinkC)

router.patch('/user/update',globalController.updateUserC)
router.patch('/user/update/password',globalController.updatePasswordC)
router.patch('/link/update',globalController.updateLinkC)

router.delete('/user/delete',globalController.deleteUserC)
router.delete('/link/delete',globalController.deleteLinkC)
// connexion, deconnexion
router.post('/connexion',deConnecterApi,globalController.connexion)
router.post('/deconnexion',connecterApi,globalController.deconnexion)

export default router