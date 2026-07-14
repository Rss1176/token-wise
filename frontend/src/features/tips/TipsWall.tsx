import type { Tips } from '../../../../shared/types'
import { SectionHeading } from '../../components/SectionHeading'
import { TipCard } from './TipCard'

export function TipsWall({ tips }: { tips: Tips }) {
  return (
    <section className="section" id="tips">
      <div className="container">
        <SectionHeading title="Spend fewer tokens" />
        <p className="section-sub">
          Whichever model you pick, these habits cut the bill — often by a lot.
        </p>
        <div className="tips__grid">
          {tips.tips.map((tip, index) => (
            <TipCard key={tip.id} tip={tip} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
