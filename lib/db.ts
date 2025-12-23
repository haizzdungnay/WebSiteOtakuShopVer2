import { Pool } from 'pg'

const DEBUG_DB = process.env.NODE_ENV === 'development' && process.env.DEBUG_DB === 'true'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'otakushop',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
})

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    if (DEBUG_DB) console.warn('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export const getClient = async () => {
  const client = await pool.connect()
  const originalQuery = client.query.bind(client)
  const originalRelease = client.release.bind(client)

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
  }, 5000)

  // Override release to clear timeout
  client.release = () => {
    clearTimeout(timeout)
    client.query = originalQuery
    return originalRelease()
  }

  return client
}

export default pool
