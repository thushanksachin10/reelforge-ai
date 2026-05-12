import Script from '../models/Script.js'
import {
  generateTitle,
  generateHook,
  generateScript,
  generateScenes,
  generateCTA,
  generateHashtags,
  generateViralScore,
  generateThumbnailPrompt
} from '../services/geminiService.js'

// POST /api/scripts/generate
export const generateContent = async (req, res) => {
  try {
    const { topic, niche, platform, style } = req.body

    if (!topic || !niche || !platform || !style) {
      return res.status(400).json({ message: 'All fields are required: topic, niche, platform, style' })
    }

    // Run all Gemini prompts — each is a separate focused call
    const [title, hook, script, scenes, cta, hashtags, viralScore, thumbnailPrompt] =
      await Promise.all([
        generateTitle(topic, niche, platform, style),
        generateHook(topic, niche, platform, style),
        generateScript(topic, niche, platform, style),
        generateScenes(topic, niche, platform, style),
        generateCTA(topic, niche, platform, style),
        generateHashtags(topic, niche, platform, style),
        generateViralScore(topic, niche, platform, style),
        generateThumbnailPrompt(topic, niche, style)
      ])

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
      viralScore
    })

    res.status(201).json({ message: 'Content generated successfully', script: saved })
  } catch (error) {
    res.status(500).json({ message: 'Generation failed', error: error.message })
  }
}

// GET /api/scripts — get all scripts for logged-in user
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

// GET /api/scripts/:id — get single script
export const getScriptById = async (req, res) => {
  try {
    const script = await Script.findOne({ _id: req.params.id, userId: req.user._id })

    if (!script) {
      return res.status(404).json({ message: 'Script not found' })
    }

    res.json({ script })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// PUT /api/scripts/:id — edit script
export const updateScript = async (req, res) => {
  try {
    const { title, hook, script, scenes, cta, hashtags, folderId } = req.body

    const existing = await Script.findOne({ _id: req.params.id, userId: req.user._id })
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

// POST /api/scripts/:id/duplicate — duplicate a script
export const duplicateScript = async (req, res) => {
  try {
    const original = await Script.findOne({ _id: req.params.id, userId: req.user._id })
    if (!original) {
      return res.status(404).json({ message: 'Script not found' })
    }

    const duplicate = await Script.create({
      userId: req.user._id,
      topic: original.topic,
      niche: original.niche,
      platform: original.platform,
      style: original.style,
      title: `${original.title} (Copy)`,
      hook: original.hook,
      script: original.script,
      scenes: original.scenes,
      cta: original.cta,
      hashtags: original.hashtags,
      thumbnailPrompt: original.thumbnailPrompt,
      viralScore: original.viralScore,
      folderId: original.folderId
    })

    res.status(201).json({ message: 'Script duplicated', script: duplicate })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// DELETE /api/scripts/:id — delete script
export const deleteScript = async (req, res) => {
  try {
    const script = await Script.findOne({ _id: req.params.id, userId: req.user._id })
    if (!script) {
      return res.status(404).json({ message: 'Script not found' })
    }

    await Script.findByIdAndDelete(req.params.id)
    res.json({ message: 'Script deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}