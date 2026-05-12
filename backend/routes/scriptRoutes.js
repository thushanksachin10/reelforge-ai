import express from 'express'
import {
  generateContent,
  getAllScripts,
  getScriptById,
  updateScript,
  duplicateScript,
  deleteScript
} from '../controllers/scriptController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// All script routes are protected
router.use(protect)

router.post('/generate', generateContent)
router.get('/', getAllScripts)
router.get('/:id', getScriptById)
router.put('/:id', updateScript)
router.post('/:id/duplicate', duplicateScript)
router.delete('/:id', deleteScript)

export default router