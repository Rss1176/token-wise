import type { Tips } from '../../../shared/types'
import tips from '../../data/tips.json'

export function getTips(): Tips {
  return tips as unknown as Tips
}
