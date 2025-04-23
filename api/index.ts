require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { GoogleGenAI } = require('@google/genai')

const app = express()

app.use(cors())
app.use(express.json())

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_KEY })

app.post('/gemini', async (req, res) => {
  const chat = ai.chats.create({
    model: 'gemini-2.0-flash',
    history: req.body.history,
  })

  const msg = req.body.message

  const result = await chat.sendMessage({
    message: msg,
  })
  const response = result.text

  res.send(response)
})

app.use((req, res) => res.send('<h1>Hello World</h1>'))

app.listen(3000, () => console.log('Server ready on port 3000.'))

module.exports = app
