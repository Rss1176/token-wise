/**
 * Guardrail for community data PRs: every JSON file in backend/data must be
 * internally consistent. If you're adding a model, use case, or tip and this
 * test fails, the message should tell you exactly what to fix.
 */
import { describe, expect, it } from 'vitest'
import { getCatalog } from '../src/handlers/catalog'
import { getUseCases } from '../src/handlers/useCases'
import { getTips } from '../src/handlers/tips'

const catalog = getCatalog()
const useCases = getUseCases()
const tips = getTips()

const TIERS = ['flagship', 'balanced', 'fast', 'budget']
const ROLES = ['best', 'budget', 'fastest']
const TIP_CATEGORIES = ['model-choice', 'prompting', 'caching', 'context', 'output']

function expectUnique(ids: string[], what: string) {
  const seen = new Set<string>()
  for (const id of ids) {
    expect(seen.has(id), `duplicate ${what} id: "${id}"`).toBe(false)
    seen.add(id)
  }
}

describe('models.json', () => {
  it('has a valid updated date', () => {
    expect(catalog.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('has unique provider and model ids', () => {
    expectUnique(
      catalog.providers.map((p) => p.id),
      'provider',
    )
    expectUnique(
      catalog.providers.flatMap((p) => p.models.map((m) => m.id)),
      'model',
    )
  })

  it('every model is well-formed', () => {
    for (const provider of catalog.providers) {
      expect(provider.name, `provider ${provider.id} needs a name`).toBeTruthy()
      expect(provider.color, `provider ${provider.id} needs a color`).toMatch(/^#[0-9a-f]{6}$/i)
      expect(provider.models.length, `provider ${provider.id} has no models`).toBeGreaterThan(0)

      for (const model of provider.models) {
        const label = `model ${model.id}`
        expect(model.name, `${label} needs a name`).toBeTruthy()
        expect(model.blurb, `${label} needs a blurb`).toBeTruthy()
        expect(TIERS, `${label} has unknown tier "${model.tier}"`).toContain(model.tier)
        expect(model.bestFor.length, `${label} needs at least one bestFor entry`).toBeGreaterThan(0)

        for (const [meter, value] of Object.entries(model.meters)) {
          expect(
            value >= 1 && value <= 5,
            `${label} meter "${meter}" must be 1–5, got ${value}`,
          ).toBe(true)
        }

        if (model.pricing) {
          expect(model.pricing.input, `${label} input price must be > 0`).toBeGreaterThan(0)
          expect(model.pricing.output, `${label} output price must be > 0`).toBeGreaterThan(0)
        }
        if (model.context !== null) {
          expect(model.context, `${label} context must be > 0`).toBeGreaterThan(0)
        }
      }
    }
  })
})

describe('use-cases.json', () => {
  const modelIds = new Set(catalog.providers.flatMap((p) => p.models.map((m) => m.id)))

  it('has unique category and subcase ids', () => {
    expectUnique(
      useCases.categories.map((c) => c.id),
      'category',
    )
    expectUnique(
      useCases.categories.flatMap((c) => c.subcases.map((s) => s.id)),
      'subcase',
    )
  })

  it('every pick points at a model that exists in models.json', () => {
    for (const category of useCases.categories) {
      for (const subcase of category.subcases) {
        for (const pick of subcase.picks) {
          expect(
            modelIds.has(pick.modelId),
            `${category.id}/${subcase.id} picks unknown model "${pick.modelId}"`,
          ).toBe(true)
        }
      }
    }
  })

  it('every subcase has each role exactly once, with a why', () => {
    for (const category of useCases.categories) {
      for (const subcase of category.subcases) {
        const label = `${category.id}/${subcase.id}`
        const roles = subcase.picks.map((p) => p.role)
        expect(roles.slice().sort(), `${label} must have best/budget/fastest`).toEqual(
          ROLES.slice().sort(),
        )
        for (const pick of subcase.picks) {
          expect(pick.why, `${label} (${pick.role}) needs a "why"`).toBeTruthy()
        }
      }
    }
  })

  it('every category and subcase has search keywords', () => {
    for (const category of useCases.categories) {
      expect(category.keywords.length, `category ${category.id} needs keywords`).toBeGreaterThan(0)
      for (const subcase of category.subcases) {
        expect(
          subcase.keywords.length,
          `subcase ${category.id}/${subcase.id} needs keywords`,
        ).toBeGreaterThan(0)
      }
    }
  })
})

describe('tips.json', () => {
  it('has unique, well-formed tips', () => {
    expectUnique(
      tips.tips.map((t) => t.id),
      'tip',
    )
    for (const tip of tips.tips) {
      expect(tip.title, `tip ${tip.id} needs a title`).toBeTruthy()
      expect(tip.body, `tip ${tip.id} needs a body`).toBeTruthy()
      expect(TIP_CATEGORIES, `tip ${tip.id} has unknown category "${tip.category}"`).toContain(
        tip.category,
      )
      if (tip.example) {
        expect(tip.example.before, `tip ${tip.id} example needs "before"`).toBeTruthy()
        expect(tip.example.after, `tip ${tip.id} example needs "after"`).toBeTruthy()
      }
    }
  })
})
