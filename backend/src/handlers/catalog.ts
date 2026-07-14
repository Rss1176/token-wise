import type { Catalog } from '../../../shared/types'
import models from '../../data/models.json'

export function getCatalog(): Catalog {
  return models as unknown as Catalog
}
