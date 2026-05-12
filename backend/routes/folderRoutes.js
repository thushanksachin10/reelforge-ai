import express from 'express'
import { createFolder, getFolders, deleteFolder } from '../controllers/folderController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.post('/', createFolder)
router.get('/', getFolders)
router.delete('/:id', deleteFolder)

export default router