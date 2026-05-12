import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Helper: get model and run a prompt, return clean text
const runPrompt = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text().trim()
}

// 1. Generate video title
export const generateTitle = async (topic, niche, platform, style) => {
  const prompt = `
You are a viral short-form content strategist.
Generate ONE compelling, click-worthy video title for the following:
- Topic: ${topic}
- Niche: ${niche}
- Platform: ${platform}
- Content Style: ${style}

Rules:
- Maximum 10 words
- Make it curiosity-driven or emotionally charged
- Optimized for ${platform} algorithm
- No quotes, no hashtags, just the title
- Output only the title, nothing else
`
  return await runPrompt(prompt)
}

// 2. Generate hook (first 3 seconds)
export const generateHook = async (topic, niche, platform, style) => {
  const prompt = `
You are an expert short-form video scriptwriter.
Write a powerful hook for the FIRST 3 SECONDS of a video.
- Topic: ${topic}
- Niche: ${niche}
- Platform: ${platform}
- Content Style: ${style}

Rules:
- 1-2 sentences max
- Must stop the scroll immediately
- Use pattern interrupts, bold statements, or shocking questions
- Written as spoken words (conversational)
- Output only the hook text, nothing else
`
  return await runPrompt(prompt)
}

// 3. Generate full short-form script
export const generateScript = async (topic, niche, platform, style) => {
  const prompt = `
You are a professional short-form video scriptwriter.
Write a complete spoken script for a 60-90 second ${platform} video.
- Topic: ${topic}
- Niche: ${niche}
- Content Style: ${style}

Rules:
- Written in natural spoken language
- Engaging, punchy sentences
- No filler words
- Include a smooth flow: hook → value → insight → close
- Do NOT include scene labels or directions, just the spoken words
- Aim for 150-200 words
- Output only the script, nothing else
`
  return await runPrompt(prompt)
}

// 4. Generate scene breakdown
export const generateScenes = async (topic, niche, platform, style) => {
  const prompt = `
You are a video director for short-form ${platform} content.
Create a scene-by-scene breakdown for a 60-90 second video.
- Topic: ${topic}
- Niche: ${niche}
- Content Style: ${style}

Format each scene like this (do all 4-6 scenes):
Scene 1 (0-5s): [What happens visually + what is said]
Scene 2 (5-15s): [What happens visually + what is said]
...and so on

Rules:
- Be specific about visuals and spoken words per scene
- Keep each scene description to 1-2 sentences
- Output only the scene breakdown, nothing else
`
  return await runPrompt(prompt)
}

// 5. Generate Call to Action
export const generateCTA = async (topic, niche, platform, style) => {
  const prompt = `
You are a conversion-focused content strategist.
Write a strong Call to Action (CTA) for the END of a ${platform} video.
- Topic: ${topic}
- Niche: ${niche}
- Content Style: ${style}

Rules:
- 1-2 sentences max
- Should drive: follow, comment, share, or save
- Must feel natural, not salesy
- Written as spoken words
- Output only the CTA text, nothing else
`
  return await runPrompt(prompt)
}

// 6. Generate hashtags
export const generateHashtags = async (topic, niche, platform, style) => {
  const prompt = `
You are a social media growth expert.
Generate the best hashtags for a ${platform} video.
- Topic: ${topic}
- Niche: ${niche}
- Content Style: ${style}

Rules:
- Generate exactly 15 hashtags
- Mix of: 5 broad/trending + 5 niche-specific + 5 micro/long-tail
- No spaces inside hashtags
- Output ONLY a comma-separated list of hashtags with # symbol
- Example format: #productivity,#mindset,#morningroutine
- Nothing else, no explanations
`
  const raw = await runPrompt(prompt)
  // Clean and parse into array
  return raw
    .split(',')
    .map(tag => tag.trim().replace(/\s+/g, ''))
    .filter(tag => tag.startsWith('#'))
    .slice(0, 15)
}

// 7. Generate viral score
export const generateViralScore = async (topic, niche, platform, style) => {
  const prompt = `
You are a viral content analyst with expertise in ${platform} trends.
Analyze the viral potential of this content concept and give it a score.
- Topic: ${topic}
- Niche: ${niche}
- Platform: ${platform}
- Content Style: ${style}

Rules:
- Score it from 1 to 100
- Consider: trend alignment, emotional pull, shareability, niche demand
- Output ONLY a single integer number between 1 and 100
- No explanation, no text, just the number
`
  const raw = await runPrompt(prompt)
  const score = parseInt(raw.replace(/\D/g, ''), 10)
  return isNaN(score) ? 70 : Math.min(100, Math.max(1, score))
}

// 8. Generate thumbnail prompt (for image generation)
export const generateThumbnailPrompt = async (topic, niche, style) => {
  const prompt = `
You are a professional thumbnail designer and prompt engineer.
Write a detailed image generation prompt for a YouTube/Reel thumbnail.
- Topic: ${topic}
- Niche: ${niche}
- Content Style: ${style}

Rules:
- Describe the scene, colors, mood, text overlay, and composition
- Make it visually striking and click-worthy
- Include style cues: lighting, color palette, font style for text
- Keep it under 100 words
- Output only the image prompt, nothing else
`
  return await runPrompt(prompt)
}