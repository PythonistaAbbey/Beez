export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <section className="relative overflow-hidden bg-aurora text-white">
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      <div className="absolute -top-32 end-0 h-80 w-80 rounded-full bg-frost-500/20 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="eyebrow !text-sand-300">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-steel-300">{lead}</p>
      </div>
    </section>
  );
}
