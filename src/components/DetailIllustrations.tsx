import styles from './HotspotDetailSection.module.css';

export interface DetailIllustrationProps {
  index: number;
  className?: string;
}

const LABELS = [
  'Ilustrasi 2.5D bidang pantul dan susunan kaca cermin',
  'Ilustrasi 2.5D profil tepi kaca yang dipoles',
  'Ilustrasi 2.5D pencahayaan LED dan pilihan warna',
  'Ilustrasi 2.5D tangan menyentuh indikator kontrol kaca',
  'Ilustrasi 2.5D area antifog yang membersihkan embun',
  'Ilustrasi 2.5D susunan kaca, LED, rangka, dan gantungan',
];

function SceneDefs({ prefix }: { prefix: string }) {
  return <defs>
    <linearGradient id={`${prefix}-bg`} x1="0" y1="0" x2="1" y2="1">
      <stop stopColor="#293b55"/><stop offset=".48" stopColor="#17263c"/><stop offset="1" stopColor="#0a1525"/>
    </linearGradient>
    <radialGradient id={`${prefix}-light`} cx="0" cy="0" r="1" gradientTransform="translate(118 44) rotate(37) scale(390 290)">
      <stop stopColor="#eef5f7" stopOpacity=".2"/><stop offset=".44" stopColor="#b9d0da" stopOpacity=".055"/><stop offset="1" stopColor="#0a1525" stopOpacity="0"/>
    </radialGradient>
    <linearGradient id={`${prefix}-wall`} x1="0" y1="0" x2="0" y2="1">
      <stop stopColor="#31445a"/><stop offset="1" stopColor="#17273a"/>
    </linearGradient>
    <linearGradient id={`${prefix}-mirror`} x1=".06" y1=".04" x2=".94" y2=".96">
      <stop stopColor="#dce8ed"/><stop offset=".2" stopColor="#9eb1bf"/><stop offset=".52" stopColor="#61768a"/><stop offset=".76" stopColor="#263c55"/><stop offset="1" stopColor="#8197a7"/>
    </linearGradient>
    <linearGradient id={`${prefix}-reflection`} x1="0" y1="0" x2="1" y2="1">
      <stop stopColor="#ffffff" stopOpacity=".52"/><stop offset=".42" stopColor="#d9e8ee" stopOpacity=".14"/><stop offset="1" stopColor="#8aa0b1" stopOpacity="0"/>
    </linearGradient>
    <linearGradient id={`${prefix}-edge`} x1="0" y1="0" x2="1" y2="0">
      <stop stopColor="#536a7d"/><stop offset=".16" stopColor="#e7eef0"/><stop offset=".35" stopColor="#8398a7"/><stop offset=".58" stopColor="#f7f9f8"/><stop offset=".78" stopColor="#718698"/><stop offset="1" stopColor="#30465b"/>
    </linearGradient>
    <linearGradient id={`${prefix}-skin`} x1="0" y1="0" x2="1" y2="1">
      <stop stopColor="#f2c9a2"/><stop offset=".55" stopColor="#dca77b"/><stop offset="1" stopColor="#b97855"/>
    </linearGradient>
    <filter id={`${prefix}-shadow`} x="-40%" y="-45%" width="180%" height="205%">
      <feDropShadow dx="0" dy="16" stdDeviation="13" floodColor="#020713" floodOpacity=".58"/>
    </filter>
    <filter id={`${prefix}-glow`} x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id={`${prefix}-soft`} x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id={`${prefix}-grain`} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed={Number(prefix.split('-').pop()) + 11}/>
      <feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .1"/></feComponentTransfer>
    </filter>
    <pattern id={`${prefix}-grid`} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0v28" fill="none" stroke="#b9cbd5" strokeOpacity=".06"/></pattern>
  </defs>;
}

function Backdrop({ prefix }: { prefix: string }) {
  return <>
    <rect width="560" height="400" rx="16" fill={`url(#${prefix}-bg)`}/>
    <rect width="560" height="400" rx="16" fill={`url(#${prefix}-light)`}/>
    <path d="M0 315c108-45 210 18 329-25 89-32 160-32 231-6v116H0Z" fill="#071221" opacity=".56"/>
    <path d="M0 286h560v114H0Z" fill={`url(#${prefix}-grid)`} opacity=".52"/>
    <rect x="13" y="13" width="534" height="374" rx="12" fill="none" stroke="#dce7ec" strokeOpacity=".14"/>
    <rect width="560" height="400" rx="16" filter={`url(#${prefix}-grain)`} opacity=".28"/>
  </>;
}

function SceneLabel({ x, y, children, anchor = 'start' }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <text className={styles.sceneLabel} x={x} y={y} textAnchor={anchor}>{children}</text>;
}

function GlassScene({ prefix }: { prefix: string }) {
  return <>
    <ellipse cx="281" cy="318" rx="176" ry="27" fill="#020914" opacity=".55" filter={`url(#${prefix}-soft)`}/>
    <g filter={`url(#${prefix}-shadow)`}>
      <rect x="121" y="75" width="344" height="230" rx="23" fill="#091423" opacity=".64"/>
      <rect x="112" y="66" width="344" height="230" rx="23" fill="#24384d" stroke="#718799" strokeWidth="2"/>
      <rect x="104" y="58" width="344" height="230" rx="23" fill={`url(#${prefix}-mirror)`} stroke="#d8e3e7" strokeWidth="2.2"/>
      <rect x="116" y="70" width="320" height="206" rx="15" fill="none" stroke="#eff5f6" strokeOpacity=".48"/>
      <path d="M123 76h148L180 276h-57a16 16 0 0 1-16-16V92a16 16 0 0 1 16-16Z" fill={`url(#${prefix}-reflection)`} opacity=".75"/>
      <path d="M125 245c82-43 177-59 291-49" fill="none" stroke="#e8f1f3" strokeOpacity=".27" strokeWidth="2"/>
      <path d="M126 278h298" stroke={`url(#${prefix}-edge)`} strokeWidth="5" strokeLinecap="round"/>
    </g>
    <path className={styles.reflectionSweep} d="M146 75h78l-70 195h-37Z" fill="#f6fbfc" opacity=".18"/>
    <g className={styles.callout}>
      <rect className={styles.calloutPlate} x="45" y="96" width="116" height="29" rx="14.5"/>
      <SceneLabel x={61} y={115}>bidang pantul</SceneLabel>
      <path d="m161 111 20 17"/><circle cx="181" cy="128" r="4"/>
    </g>
    <g className={styles.callout}><circle cx="448" cy="179" r="4"/><path d="m448 179 55-30"/><SceneLabel x={507} y={146} anchor="end">lapisan kaca</SceneLabel></g>
    <g className={styles.legendRow} transform="translate(143 337)"><rect width="274" height="31" rx="15.5"/><circle cx="23" cy="15.5" r="4"/><SceneLabel x={35} y={19}>pantulan</SceneLabel><circle cx="112" cy="15.5" r="4"/><SceneLabel x={124} y={19}>tepi</SceneLabel><circle cx="173" cy="15.5" r="4"/><SceneLabel x={185} y={19}>lapisan belakang</SceneLabel></g>
  </>;
}

function EdgeScene({ prefix }: { prefix: string }) {
  return <>
    <ellipse cx="283" cy="302" rx="185" ry="29" fill="#020914" opacity=".6" filter={`url(#${prefix}-soft)`}/>
    <g filter={`url(#${prefix}-shadow)`}>
      <path d="M84 167 356 95l124 69-275 76Z" fill={`url(#${prefix}-mirror)`} stroke="#dce8ec" strokeWidth="2"/>
      <path d="m205 240 275-76v13l-275 79Z" fill={`url(#${prefix}-edge)`}/>
      <path d="M84 167 205 240v16L84 181Z" fill="#31475b"/>
      <path d="m98 168 256-66 108 61-258 71Z" fill="none" stroke="#f2f7f8" strokeOpacity=".34"/>
      <path d="m205 240 275-76" fill="none" stroke="#f8fcfb" strokeWidth="4" opacity=".86"/>
      <path d="M101 170 350 105l45 25-251 67Z" fill={`url(#${prefix}-reflection)`} opacity=".42"/>
    </g>
    <path className={styles.edgeGlint} d="m205 239 273-75" fill="none" stroke="#fff7df" strokeWidth="4" strokeLinecap="round" filter={`url(#${prefix}-glow)`}/>
    <g className={styles.callout}><circle cx="383" cy="102" r="4"/><path d="m383 102 54-42"/><SceneLabel x={443} y={57}>tepi dipoles</SceneLabel></g>
    <g className={styles.dimension}><path d="M181 261v35m-8-7 8 8 8-8M202 256v40m-8-7 8 8 8-8"/><SceneLabel x={191} y={319} anchor="middle">profil tipis berlapis</SceneLabel></g>
    <g className={styles.legendRow} transform="translate(326 314)"><rect width="174" height="31" rx="15.5"/><circle cx="23" cy="15.5" r="5"/><SceneLabel x={36} y={19}>permukaan</SceneLabel><path d="M113 15.5h18"/><SceneLabel x={138} y={19}>sisi</SceneLabel></g>
  </>;
}

function LedScene({ prefix }: { prefix: string }) {
  return <>
    <rect x="63" y="72" width="434" height="235" rx="8" fill={`url(#${prefix}-wall)`} stroke="#6e8294" strokeOpacity=".32"/>
    <path d="M82 292h396" stroke="#566c80" strokeWidth="9"/>
    <ellipse className={styles.ledAura} cx="280" cy="190" rx="192" ry="132" fill="#ffc77d" opacity=".21" filter={`url(#${prefix}-soft)`}/>
    <g filter={`url(#${prefix}-shadow)`}>
      <rect x="103" y="76" width="354" height="223" rx="32" fill={`url(#${prefix}-mirror)`} stroke="#b9c8d2" strokeWidth="2"/>
      <rect className={styles.ledLine} x="116" y="89" width="328" height="197" rx="22" fill="none" stroke="#ffc77d" strokeWidth="6" filter={`url(#${prefix}-glow)`}/>
      <path d="M138 118c88-42 184-44 278-7" fill="none" stroke="#f5fafb" strokeOpacity=".34" strokeWidth="16" strokeLinecap="round"/>
      <path d="M139 251c87 25 178 25 270 0" fill="none" stroke="#aabcc7" strokeOpacity=".3"/>
    </g>
    <g className={styles.lightSelector} transform="translate(120 338)"><rect width="320" height="40" rx="20"/><g><circle cx="31" cy="20" r="6" fill="#ffc77d"/><SceneLabel x={45} y={24}>Hangat</SceneLabel></g><g><circle cx="137" cy="20" r="6" fill="#ffe8bd"/><SceneLabel x={151} y={24}>Natural</SceneLabel></g><g><circle cx="245" cy="20" r="6" fill="#d7e9ff"/><SceneLabel x={259} y={24}>Putih</SceneLabel></g><rect className={styles.lightIndicator} x="15" y="33" width="80" height="2" rx="1"/></g>
  </>;
}

function ControlScene({ prefix }: { prefix: string }) {
  return <>
    <rect className={styles.controlAura} x="91" y="57" width="378" height="250" rx="39" fill="none" stroke="#ffd89b" strokeWidth="20" opacity=".13" filter={`url(#${prefix}-soft)`}/>
    <g filter={`url(#${prefix}-shadow)`}>
      <rect x="102" y="68" width="356" height="228" rx="30" fill={`url(#${prefix}-mirror)`} stroke="#b9c9d3" strokeWidth="2"/>
      <rect className={styles.controlLed} x="115" y="81" width="330" height="202" rx="21" fill="none" stroke="#ffca83" strokeWidth="4" opacity=".88" filter={`url(#${prefix}-glow)`}/>
      <path d="M139 113c85-39 180-40 277-7" fill="none" stroke="#f4f8f9" strokeOpacity=".31" strokeWidth="16" strokeLinecap="round"/>
      <circle cx="280" cy="235" r="17" fill="#132239" stroke="#edf5f6" strokeOpacity=".84"/>
      <path d="M280 224v10m-8-5a11 11 0 1 0 16 0" fill="none" stroke="#edf5f6" strokeWidth="2" strokeLinecap="round"/>
    </g>
    <circle className={styles.touchTarget} cx="280" cy="235" r="11" fill="#ffd39b" opacity=".18"/>
    <g transform="translate(280 235) scale(.72) translate(-303 -226)">
      <g className={styles.touchHand}>
        <path d="M488 350c-25-41-58-71-100-93l-67-36c-12-6-27-2-33 10-6 11-2 26 10 32l56 30-20 17c-11 10-13 27-4 39Z" fill={`url(#${prefix}-skin)`} stroke="#f0c9a6" strokeWidth="2"/>
        <path d="m356 294-53-31c-11-7-14-21-7-31 7-9 20-11 30-5l62 36" fill={`url(#${prefix}-skin)`} stroke="#f0c9a6" strokeWidth="2"/>
        <path d="m301 235 18 10" stroke="#fff1df" strokeWidth="5" strokeLinecap="round" opacity=".58"/>
        <path d="m374 303-32 31" fill="none" stroke="#b97855" strokeOpacity=".5" strokeWidth="2"/>
      </g>
    </g>
    <circle className={styles.touchRipple} cx="280" cy="235" r="20" fill="none" stroke="#ffe0ae" strokeWidth="3"/>
    <g className={styles.sensorWaves} fill="none" stroke="#bce3dc" strokeWidth="2"><path d="M470 121q28 17 0 34"/><path d="M482 107q45 31 0 62"/></g>
    <g className={styles.controlModes} transform="translate(72 337)"><rect width="174" height="31" rx="15.5"/><circle cx="20" cy="15.5" r="5"/><SceneLabel x={33} y={19}>sentuh indikator</SceneLabel></g>
  </>;
}

function AntifogScene({ prefix }: { prefix: string }) {
  const maskId = `${prefix}-fog-mask`;
  return <>
    <defs><mask id={maskId}><rect x="102" y="68" width="356" height="232" rx="30" fill="white"/><rect className={styles.fogMaskWindow} x="145" y="101" width="270" height="166" rx="24" fill="black"/></mask></defs>
    <rect x="116" y="83" width="356" height="232" rx="30" fill="#e8b96f" opacity=".2" filter={`url(#${prefix}-glow)`}/>
    <g filter={`url(#${prefix}-shadow)`}>
      <rect x="102" y="68" width="356" height="232" rx="30" fill={`url(#${prefix}-mirror)`} stroke="#c1d0d8" strokeWidth="2"/>
      <g opacity=".66"><path d="M128 100h130v168H128Z" fill="#d4e1e6" opacity=".3"/><path d="M129 185h303" stroke="#839aaa" strokeWidth="7" opacity=".38"/><path d="M162 100v168M321 100v168" stroke="#627a8f" strokeWidth="4" opacity=".5"/><path d="M348 112h71v53h-71Z" fill="#31465b" opacity=".58"/></g>
      <rect className={styles.fogLayer} x="102" y="68" width="356" height="232" rx="30" fill="#dce7eb" opacity=".8" mask={`url(#${maskId})`}/>
      <rect x="114" y="80" width="332" height="208" rx="21" fill="none" stroke="#eef7f8" strokeOpacity=".28"/>
    </g>
    <g className={styles.droplets} fill="#f6fbfc" opacity=".74"><circle cx="136" cy="108" r="4"/><circle cx="424" cy="112" r="3"/><circle cx="149" cy="223" r="3"/><circle cx="412" cy="249" r="4"/><circle cx="316" cy="86" r="2.5"/><circle cx="196" cy="277" r="2.5"/></g>
    <g className={styles.heatLines} fill="none" stroke="#f1b76f" strokeWidth="3" strokeLinecap="round"><path d="M227 324q-12-18 0-36t0-35"/><path d="M280 324q-12-18 0-36t0-35"/><path d="M333 324q-12-18 0-36t0-35"/></g>
    <g className={styles.antifogStatus} transform="translate(178 343)"><rect width="204" height="32" rx="16"/><circle cx="20" cy="16" r="6"/><SceneLabel x={33} y={20}>bidang jernih · antifog aktif</SceneLabel></g>
  </>;
}

function MountingScene({ prefix }: { prefix: string }) {
  return <>
    <ellipse cx="274" cy="331" rx="184" ry="26" fill="#020914" opacity=".56" filter={`url(#${prefix}-soft)`}/>
    <g className={styles.mountGlass} filter={`url(#${prefix}-shadow)`}>
      <path d="M104 84 346 24l110 61-246 68Z" fill={`url(#${prefix}-mirror)`} stroke="#dce7ec" strokeWidth="2"/>
      <path d="m124 87 219-53 88 49-222 60Z" fill="none" stroke="#f2f7f8" strokeOpacity=".36"/>
    </g>
    <g className={styles.mountFrame}>
      <path d="M113 164 347 106l105 58-238 66Z" fill="#27384b" stroke="#54687a" strokeWidth="18" opacity=".92"/>
      <path d="M118 164 345 112l96 53-228 60Z" fill="none" stroke="#ffc575" strokeWidth="4" filter={`url(#${prefix}-glow)`}/>
    </g>
    <g className={styles.mountBack} filter={`url(#${prefix}-shadow)`}>
      <path d="M126 244 347 190l100 56-225 62Z" fill="#26384b" stroke="#8297a6" strokeWidth="8"/>
      <path d="m174 277 40-10 29 16-41 11Zm126-31 41-10 29 16-42 12Z" fill={`url(#${prefix}-edge)`}/>
    </g>
    <g className={styles.mountGuides} stroke="#a6bac6" strokeDasharray="5 7" opacity=".5"><path d="M210 153v76"/><path d="M456 85v79"/><path d="M104 84v80"/></g>
    <g className={styles.layerLabels}>
      <path d="m376 58 80-12"/><circle cx="376" cy="58" r="3"/><SceneLabel x={462} y={49}>kaca</SceneLabel>
      <path d="m406 153 70-19"/><circle cx="406" cy="153" r="3"/><SceneLabel x={482} y={136}>LED</SceneLabel>
      <path d="m395 245 82 21"/><circle cx="395" cy="245" r="3"/><SceneLabel x={483} y={270}>rangka</SceneLabel>
      <path d="m329 275 91 50"/><circle cx="329" cy="275" r="3"/><SceneLabel x={426} y={329}>gantungan</SceneLabel>
    </g>
  </>;
}

const SCENES = [GlassScene, EdgeScene, LedScene, ControlScene, AntifogScene, MountingScene] as const;

export function DetailIllustration({ index, className }: DetailIllustrationProps) {
  const safeIndex = Math.min(Math.max(index, 0), LABELS.length - 1);
  const prefix = `detail-scene-${safeIndex}`;
  const Scene = SCENES[safeIndex];
  const titleId = `${prefix}-title`;

  return <svg className={className} data-detail-scene={safeIndex + 1} viewBox="0 0 560 400" role="img" aria-labelledby={titleId} preserveAspectRatio="xMidYMid meet">
    <title id={titleId}>{LABELS[safeIndex]}</title>
    <SceneDefs prefix={prefix}/>
    <Backdrop prefix={prefix}/>
    <Scene prefix={prefix}/>
  </svg>;
}
