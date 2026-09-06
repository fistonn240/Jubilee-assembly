import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { checkDatabase, pool } from './db.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const fallbackServices = [
  { id: 1, day: 'Sunday', time: '9:00 AM', label: 'Celebration service' },
  { id: 2, day: 'Sunday', time: '11:30 AM', label: 'Celebration service' },
  { id: 3, day: 'Wednesday', time: '6:30 PM', label: 'Midweek gathering' },
]
const fallbackEvents = [
  { id: 1, title: 'Welcome Home Sunday', date: '2026-09-14', time: '9:00 AM & 11:30 AM' },
  { id: 2, title: 'Jubilee Night of Worship', date: '2026-09-21', time: '7:00 PM' },
  { id: 3, title: 'Serve the City', date: '2026-09-28', time: '10:00 AM' },
]

function databaseQuery(operation) {
  return Promise.race([
    operation(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Database query timed out')), 2500)),
  ])
}

app.use(cors({ origin: clientOrigin }))
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', async (_request, response) => {
  try {
    await checkDatabase()
    response.json({ ok: true, database: 'connected' })
  } catch {
    response.status(503).json({ ok: false, database: 'unavailable' })
  }
})

app.get('/api/services', async (_request, response) => {
  try {
    const [rows] = await databaseQuery(() => pool.query(
      'SELECT id, day_name AS day, service_time AS time, title AS label FROM services ORDER BY id',
    ))
    response.json(rows)
  } catch (error) {
    console.error(error.message)
    response.json(fallbackServices)
  }
})

app.get('/api/events', async (request, response) => {
  try {
    const limit = Math.min(Math.max(Number(request.query.limit) || 20, 1), 100)
    const [rows] = await databaseQuery(() => pool.execute(
      'SELECT id, title, event_date AS date, event_time AS time, description, image_url AS imageUrl FROM events WHERE event_date >= CURDATE() ORDER BY event_date LIMIT ?',
      [limit],
    ))
    response.json(rows)
  } catch (error) {
    console.error(error.message)
    response.json(fallbackEvents)
  }
})

app.post('/api/contact', async (request, response) => {
  const { name, email, subject = '', message } = request.body
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return response.status(400).json({ error: 'Name, email, and message are required.' })
  }
  try {
    const [result] = await databaseQuery(() => pool.execute(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim(), subject.trim(), message.trim()],
    ))
    response.status(201).json({ id: result.insertId, message: 'Thanks. Our team will be in touch soon.' })
  } catch (error) {
    console.error(error.message)
    response.status(202).json({ stored: false, message: 'Your message was received. The team will follow up soon.' })
  }
})

app.post('/api/chat', async (request, response) => {
  const question = request.body.question?.trim()
  if (!question) return response.status(400).json({ error: 'A question is required.' })

  try {
    if (process.env.OPENAI_API_KEY) {
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature: 0.4,
          messages: [
            { role: 'system', content: 'You are Jubilee Guide for Jubilee Assembly church. Be warm, concise, and accurate. If you do not know something, direct the visitor to the contact form. Church details: services Sunday at 9:00 AM and 11:30 AM, Wednesday at 6:30 PM; address 18 Jubilee Avenue, Riverside.' },
            { role: 'user', content: question },
          ],
        }),
      })
      if (!aiResponse.ok) throw new Error(`AI provider returned ${aiResponse.status}`)
      const data = await aiResponse.json()
      const answer = data.choices?.[0]?.message?.content
      if (answer) return response.json({ answer, source: 'ai' })
    }

    const searchTerm = `%${question.replace(/[\\%_]/g, '\\$&')}%`
    const [rows] = await databaseQuery(() => pool.execute(
      'SELECT answer FROM chat_questions WHERE question LIKE ? OR keywords LIKE ? ORDER BY id LIMIT 1',
      [searchTerm, searchTerm],
    ))
    response.json({ answer: rows[0]?.answer || 'That is a great question. Please use the contact form and our team will help you personally.', source: 'faq' })
  } catch (error) {
    console.error(error.message)
    response.json({ answer: fallbackAnswer(question), source: 'fallback' })
  }
})

function fallbackAnswer(question) {
  const lower = question.toLowerCase()
  if (lower.includes('service') || lower.includes('time')) return 'Our Sunday services are at 9:00 AM and 11:30 AM, with a midweek gathering on Wednesday at 6:30 PM.'
  if (lower.includes('kid') || lower.includes('child')) return 'Jubilee Kids is available during both Sunday services for children from nursery through grade 5.'
  if (lower.includes('where') || lower.includes('location') || lower.includes('address')) return 'We gather at 18 Jubilee Avenue, Riverside. There is free parking on site.'
  return 'That is a great question. Please use the contact form and our team will help you personally.'
}

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server.' })
})

app.listen(port, () => {
  console.log(`Jubilee API listening on http://localhost:${port}`)
})
