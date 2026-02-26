import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { GoogleGenAI } from '@google/genai'
import { fileURLToPath } from 'url'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_KEY })

app.post('/gemini', async (req, res) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-lite',
      history: req.body.history,
    })

    const msg = req.body.message

    const result = await chat.sendMessage({
      message: msg,
    })

    const response = result.text

    res.send(response)
  } catch (e) {
    if (e.status === 429) {
      return res.status(429).json({
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Quota limit exceeded. Please try again later.',
      })
    }

    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
  }
})

app.use((req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html')),
)

app.listen(3000, () => console.log('Server ready on port 3000.'))
