import Script from '../models/Script.js'
import {
  generateHooksAndTitle,
  generateScriptAndScenes,
  generateHashtagsAndThumbnail,
} from '../services/geminiService.js'

// Small delay to space out grouped API requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// POST /api/scripts/generate
export const generateContent = async (req, res) => {
  try {
    const { topic, niche, platform, style } = req.body

    if (!topic || !niche || !platform || !style) {
      return res.status(400).json({
        message: 'All fields are required: topic, niche, platform, style'
      })
    }

    // 3 grouped AI requests instead of 8 separate ones
    const [group1, group2, group3] = await Promise.all([
      generateHooksAndTitle(topic, niche, platform, style),
      generateScriptAndScenes(topic, niche, platform, style),
      generateHashtagsAndThumbnail(topic, niche, platform, style),
    ])

    const { title, hook }                        = group1
    const { script, scenes, cta, viralScore }    = group2
    const { hashtags, thumbnailPrompt, thumbnailUrl }          = group3

    // Save to DB
    const saved = await Script.create({
      userId: req.user._id,
      topic,
      niche,
      platform,
      style,
      title,
      hook,
      script,
      scenes,
      cta,
      hashtags,
      thumbnailPrompt,
      thumbnailUrl,
      viralScore,
    })

    res.status(201).json({ message: 'Content generated successfully', script: saved })

  } catch (error) {
    console.error('GENERATE ERROR:', error.message)

    // Send helpful message to frontend based on error type
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return res.status(429).json({
        message: 'AI is busy right now. Please wait 30 seconds and try again.'
      })
    }

    if (error.message.includes('invalid JSON')) {
      return res.status(500).json({
        message: 'AI returned unexpected output. Please try again.'
      })
    }

    res.status(500).json({
      message: 'Generation failed. Please try again.',
      error: error.message,
    })
  }
}

// GET /api/scripts
export const getAllScripts = async (req, res) => {
  try {
    const scripts = await Script.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('folderId', 'folderName')

    res.json({ scripts })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET /api/scripts/:id
export const getScriptById = async (req, res) => {
  try {
    const script = await Script.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!script) {
      return res.status(404).json({ message: 'Script not found' })
    }

    res.json({ script })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// PUT /api/scripts/:id
export const updateScript = async (req, res) => {
  try {
    const { title, hook, script, scenes, cta, hashtags, folderId } = req.body

    const existing = await Script.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!existing) {
      return res.status(404).json({ message: 'Script not found' })
    }

    const updated = await Script.findByIdAndUpdate(
      req.params.id,
      { title, hook, script, scenes, cta, hashtags, folderId },
      { new: true, runValidators: true }
    )

    res.json({ message: 'Script updated', script: updated })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// POST /api/scripts/:id/duplicate
export const duplicateScript = async (req, res) => {
  try {
    const original = await Script.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!original) {
      return res.status(404).json({ message: 'Script not found' })
    }

    const duplicate = await Script.create({
      userId:          req.user._id,
      topic:           original.topic,
      niche:           original.niche,
      platform:        original.platform,
      style:           original.style,
      title:           `${original.title} (Copy)`,
      hook:            original.hook,
      script:          original.script,
      scenes:          original.scenes,
      cta:             original.cta,
      hashtags:        original.hashtags,
      thumbnailPrompt: original.thumbnailPrompt,
      viralScore:      original.viralScore,
      folderId:        original.folderId,
    })

    res.status(201).json({ message: 'Script duplicated', script: duplicate })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// DELETE /api/scripts/:id
export const deleteScript = async (req, res) => {
  try {
    const script = await Script.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!script) {
      return res.status(404).json({ message: 'Script not found' })
    }

    await Script.findByIdAndDelete(req.params.id)
    res.json({ message: 'Script deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}