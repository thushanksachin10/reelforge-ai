import Folder from '../models/Folder.js'
import Script from '../models/Script.js'

// POST /api/folders
export const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body

    if (!folderName) {
      return res.status(400).json({ message: 'Folder name is required' })
    }

    const folder = await Folder.create({
      userId: req.user._id,
      folderName
    })

    res.status(201).json({ message: 'Folder created', folder })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET /api/folders
export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json({ folders })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// DELETE /api/folders/:id
export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user._id })
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' })
    }

    // Unassign all scripts in this folder
    await Script.updateMany({ folderId: req.params.id }, { folderId: null })

    await Folder.findByIdAndDelete(req.params.id)
    res.json({ message: 'Folder deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}