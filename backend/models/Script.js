import mongoose from 'mongoose'

const scriptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true
    },
    niche: {
      type: String,
      required: [true, 'Niche is required'],
      trim: true
    },
    platform: {
      type: String,
      required: [true, 'Platform is required'],
      enum: ['Instagram', 'YouTube Shorts', 'TikTok', 'LinkedIn', 'Twitter/X']
    },
    style: {
      type: String,
      required: [true, 'Content style is required'],
      enum: ['Educational', 'Entertaining', 'Motivational', 'Storytelling', 'Tutorial']
    },
    title: { type: String, default: '' },
    hook: { type: String, default: '' },
    script: { type: String, default: '' },
    scenes: { type: String, default: '' },
    cta: { type: String, default: '' },
    hashtags: { type: [String], default: [] },
    thumbnailPrompt: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    viralScore: { type: Number, default: 0 },
    isSaved: { type: Boolean, default: true }
  },
  { timestamps: true }
)

const Script = mongoose.model('Script', scriptSchema)
export default Script