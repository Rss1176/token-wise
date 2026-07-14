import type { UseCases } from '../../../shared/types'
import useCases from '../../data/use-cases.json'

export function getUseCases(): UseCases {
  return useCases as unknown as UseCases
}
