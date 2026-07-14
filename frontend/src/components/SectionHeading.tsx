export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <span className="doodle" aria-hidden="true" />
    </div>
  )
}
