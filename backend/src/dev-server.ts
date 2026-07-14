import { createServer } from 'node:http'
import { routes } from './routes'

/**
 * Tiny local stand-in for the Vercel serverless functions in /api.
 * Vite proxies /api requests here during `npm run dev`.
 */
const PORT = 3001

createServer((req, res) => {
  const path = (req.url ?? '').split('?')[0]
  const handler = routes[path]

  if (!handler) {
    res.writeHead(404, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: `no route for ${path}` }))
    return
  }

  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify(handler()))
})
  .once('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `Port ${PORT} is already in use — is another \`npm run dev\` still running? ` +
          `Stop it (or \`kill $(lsof -ti :${PORT})\`) and try again.`,
      )
      process.exit(1)
    }
    throw error
  })
  .listen(PORT, () => {
    console.log(`tokenwise api ready on http://localhost:${PORT}`)
  })
