import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUseCases } from '../backend/src/handlers/useCases'
import { CACHE_HEADER } from '../backend/src/routes'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', CACHE_HEADER)
  res.status(200).json(getUseCases())
}
