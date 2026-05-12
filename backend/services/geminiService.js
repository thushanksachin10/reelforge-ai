import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

// OpenRouter client — uses OpenAI SDK with a different base URL
const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

const MODEL = 'openai/gpt-3.5-turbo'

// Helper: send a prompt and return clean text
const runPrompt = async (prompt) => {
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 1200,
  })

  const text = completion.choices?.[0]?.message?.content?.trim()

  if (!text) throw new Error('Empty response from AI model')

  return text
}

// Helper: parse JSON safely from AI response
// AI sometimes wraps JSON in markdown code blocks — this strips that
const parseJSON = (raw) => {
  const cleaned = raw
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error(`AI returned invalid JSON: ${cleaned.slice(0, 200)}`)
  }
}

// ─────────────────────────────────────────────
// GROUP 1: Title + Hook
// One request, returns both fields as JSON
// ─────────────────────────────────────────────
export const generateHooksAndTitle = async (topic, niche, platform, style) => {
  const prompt = `
You are a viral short-form content strategist specializing in ${platform}.

Generate a video title and hook for this content:
- Topic: ${topic}
- Niche: ${niche}
- Platform: ${platform}
- Style: ${style}

Return ONLY a valid JSON object with exactly these two fields:
{
  "title": "a click-worthy video title, max 10 words, no hashtags",
  "hook": "a powerful 1-2 sentence hook for the first 3 seconds, written as spoken words, must stop the scroll"
}

No explanation. No markdown. No extra text. Only the JSON object.
`
  const raw  = await runPrompt(prompt)
  const data = parseJSON(raw)

  return {
    title: data.title?.trim() || 'Untitled Video',
    hook:  data.hook?.trim()  || 'Watch this before you scroll...',
  }
}

// ─────────────────────────────────────────────
// GROUP 2: Script + Scenes + CTA + Viral Score
// One request, returns all four as JSON
// ─────────────────────────────────────────────
export const generateScriptAndScenes = async (topic, niche, platform, style) => {
  const prompt = `
You are a professional short-form video scriptwriter and director for ${platform}.

Write complete video content for:
- Topic: ${topic}
- Niche: ${niche}
- Platform: ${platform}
- Style: ${style}

Return ONLY a valid JSON object with exactly these four fields:
{
  "script": "a full spoken script for a 60-90 second video, 150-200 words, natural conversational language, no scene labels, just the words to speak",
  "scenes": "scene breakdown with 4-6 scenes in this format — Scene 1 (0-5s): visual + spoken words. Scene 2 (5-15s): visual + spoken words. and so on",
  "cta": "a 1-2 sentence call to action for the end of the video, drives follow/comment/share, natural not salesy, spoken words",
  "viralScore": a single integer between 1 and 100 representing viral potential based on trend alignment, emotional pull, and shareability
}

No explanation. No markdown. No extra text. Only the JSON object.
`
  const raw  = await runPrompt(prompt)
  const data = parseJSON(raw)

  const score = parseInt(data.viralScore, 10)

  return {
    script:     data.script?.trim()  || '',
    scenes:     data.scenes?.trim()  || '',
    cta:        data.cta?.trim()     || '',
    viralScore: isNaN(score) ? 70 : Math.min(100, Math.max(1, score)),
  }
}

// ─────────────────────────────────────────────
// GROUP 3: Hashtags + Thumbnail Prompt
// One request, returns both as JSON
// ─────────────────────────────────────────────
export const generateHashtagsAndThumbnail = async (topic, niche, platform, style) => {
  const prompt = `
You are a social media growth expert and thumbnail designer for ${platform}.

Generate hashtags and a thumbnail prompt for:
- Topic: ${topic}
- Niche: ${niche}
- Platform: ${platform}
- Style: ${style}

Return ONLY a valid JSON object with exactly these two fields:
{
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10", "#tag11", "#tag12", "#tag13", "#tag14", "#tag15"],
  "thumbnailPrompt": "a detailed image generation prompt under 100 words describing the thumbnail scene, colors, mood, text overlay, composition, lighting, and visual style — make it click-worthy"
}

Rules for hashtags:
- Exactly 15 hashtags as a JSON array of strings
- Each starts with #
- No spaces inside a hashtag
- Mix broad trending + niche specific + micro tags

No explanation. No markdown. No extra text. Only the JSON object.
`
  const raw  = await runPrompt(prompt)
  const data = parseJSON(raw)

  // Validate and clean hashtags array
  const hashtags = Array.isArray(data.hashtags)
    ? data.hashtags
        .map(t => t.trim().replace(/\s+/g, ''))
        .filter(t => t.startsWith('#'))
        .slice(0, 15)
    : []

  const thumbnailPrompt = data.thumbnailPrompt?.trim() || ''
  const thumbnailUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(thumbnailPrompt)}?width=1280&height=720&nologo=true`

  return {
    hashtags,
    thumbnailPrompt,
    thumbnailUrl,
  }
}

// ─────────────────────────────────────────────
// Named exports that scriptController.js calls
// These wrap the grouped functions and return
// individual values — controller stays unchanged
// ─────────────────────────────────────────────
export const generateTitle = async (topic, niche, platform, style) => {
  const { title } = await generateHooksAndTitle(topic, niche, platform, style)
  return title
}

export const generateHook = async (topic, niche, platform, style) => {
  const { hook } = await generateHooksAndTitle(topic, niche, platform, style)
  return hook
}

export const generateScript = async (topic, niche, platform, style) => {
  const { script } = await generateScriptAndScenes(topic, niche, platform, style)
  return script
}

export const generateScenes = async (topic, niche, platform, style) => {
  const { scenes } = await generateScriptAndScenes(topic, niche, platform, style)
  return scenes
}

export const generateCTA = async (topic, niche, platform, style) => {
  const { cta } = await generateScriptAndScenes(topic, niche, platform, style)
  return cta
}

export const generateHashtags = async (topic, niche, platform, style) => {
  const { hashtags } = await generateHashtagsAndThumbnail(topic, niche, platform, style)
  return hashtags
}

export const generateViralScore = async (topic, niche, platform, style) => {
  const { viralScore } = await generateScriptAndScenes(topic, niche, platform, style)
  return viralScore
}

export const generateThumbnailPrompt = async (topic, niche, style) => {
  const { thumbnailPrompt } = await generateHashtagsAndThumbnail(topic, niche, 'general', style)
  return thumbnailPrompt
}