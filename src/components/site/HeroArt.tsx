/** Decorative, original hero artwork: glows and a line-drawn refrigerated trailer. */
export function HeroArt() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 start-1/3 h-[520px] w-[520px] rounded-full bg-frost-500/20 blur-3xl" />
      <div className="absolute -bottom-48 -start-24 h-[480px] w-[480px] rounded-full bg-navy-600/40 blur-3xl" />
      <div className="absolute bottom-0 end-1/4 h-64 w-[36rem] rounded-full bg-sand-400/10 blur-3xl" />
      <svg viewBox="0 0 1200 220" className="absolute bottom-0 start-0 w-full opacity-[0.16]" preserveAspectRatio="xMidYMax meet">
        <g fill="none" stroke="#a6e9e6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M0 200 H1200" />
          {/* trailer */}
          <rect x="120" y="60" width="520" height="120" rx="6" />
          <path d="M160 60v120M600 60v120" strokeOpacity="0.5" />
          <path d="M640 90h18v-22h22v112" />
          {/* reefer unit */}
          <rect x="96" y="78" width="24" height="56" rx="3" />
          <path d="M102 92h12M102 104h12M102 116h12" />
          {/* cab */}
          <path d="M700 180V96c0-10 8-18 18-18h70l46 52v50z" />
          <path d="M790 82l36 44h-86V82z" strokeOpacity="0.7" />
          {/* wheels */}
          <circle cx="210" cy="190" r="18" /><circle cx="260" cy="190" r="18" />
          <circle cx="560" cy="190" r="18" /><circle cx="610" cy="190" r="18" />
          <circle cx="770" cy="190" r="18" />
          {/* pulse line on trailer */}
          <path d="M200 120h120l20-30 26 60 22-40 18 10h160" stroke="#2ec4c0" strokeOpacity="1" strokeWidth="3" />
          {/* snowflake */}
          <g transform="translate(980 110)" stroke="#d5e1ee">
            <path d="M0-40v80M-35-20l70 40M-35 20l70-40" />
            <path d="M-8-32l8 8 8-8M-8 32l8-8 8 8" />
          </g>
        </g>
      </svg>
    </div>
  );
}
