import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { handleQuery } from './utils/queryHandler'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/query', async (req, res) => {
  try {
    const { query } = req.body
    const response = await handleQuery(query)
    res.json({ response })
  } catch (error) {
    console.error('Query error:', error)
    res.status(500).json({ error: 'Failed to process query' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 