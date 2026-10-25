import { useId } from 'react';
import { ART_TONES } from '../utils/projectArt';

// Small animated illustrations for project cards (decorative: the card text says the same).
// The panel behind them stays dark in both themes, so drawings use fixed light colours plus a
// per-card colour pair (`tone`). utils/projectArt.js decides which drawing each card gets.
//
// Canvas: 560 x 280. Wide panels show all of it; on phones the card shows a square crop of the
// middle (x 140-420), so every drawing keeps its key shapes inside roughly x 145-415 and y 24-256.
// Window frames may run past that crop; that is intended.
const MONO = 'JetBrains Mono, monospace';
const LINE = 'rgba(255,255,255,0.16)';
const FAINT = 'rgba(255,255,255,0.08)';
const TEXT = '#d7dae8';
const DIM = '#9ea2bb';
const INK = '#0b0c1a'; // dark fill for nodes and bubbles drawn over lines
const WINDOW_DOTS = ['#fb7185', '#fbbf24', '#34d399'];

const Svg = ({ children }) => (
  <svg viewBox="0 0 560 280" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
    {children}
  </svg>
);

// Unique, URL-safe id for gradients (React ids contain characters some browsers reject in url(#…))
const useSafeId = (prefix) => `${prefix}${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

// SWIFT MT103 message validated and converted to ISO 20022 (MX)
const PaymentsArt = ({ primary, secondary }) => {
  const flow = useSafeId('flow');
  return (
    <Svg>
      <defs>
        <linearGradient id={flow} gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="520" y2="0">
          <stop offset="0" stopColor={secondary} />
          <stop offset="1" stopColor={primary} />
        </linearGradient>
      </defs>
      {/* Messages flowing in and out (only visible on wide panels) */}
      <path d="M40 140 H148 M412 140 H520" stroke={`url(#${flow})`} strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="4 8" fill="none" style={{ animation: 'dash 2.4s linear infinite' }} />
      <rect x="148" y="58" width="104" height="164" rx="12" fill="rgba(255,255,255,0.04)" stroke={LINE} />
      <text x="160" y="82" fill={DIM} fontFamily={MONO} fontSize="10.5" letterSpacing="1">MT 103</text>
      {[[':20:', 112, 40], [':32A:', 138, 30], [':50K:', 164, 38], [':59:', 190, 26]].map(([tag, y, width]) => (
        <g key={tag}>
          <text x="160" y={y} fill={TEXT} fontFamily={MONO} fontSize="11">{tag}</text>
          <rect x="204" y={y - 7} width={width} height="7" rx="3.5" fill="rgba(255,255,255,0.14)" />
        </g>
      ))}
      <path d="M252 140 H308" stroke={`url(#${flow})`} strokeWidth="2" strokeDasharray="4 6" style={{ animation: 'dash 2.4s linear infinite' }} />
      <circle cx="280" cy="140" r="18" fill={INK} stroke={`url(#${flow})`} strokeWidth="1.5" />
      <path d="M272 140 l5 5 l10 -10" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="308" y="52" width="104" height="176" rx="12" fill="rgba(255,255,255,0.05)" stroke={primary} strokeOpacity="0.6" />
      <text x="320" y="76" fill={primary} fontFamily={MONO} fontSize="10.5" letterSpacing="1">ISO 20022</text>
      {[['<Document>', 320, 106], ['<GrpHdr>', 328, 130], ['<CdtTrf>', 328, 154], ['<Dbtr>', 336, 178], ['</Document>', 320, 204]].map(([tag, x, y]) => (
        <text key={y} x={x} y={y} fill={TEXT} fontFamily={MONO} fontSize="11">{tag}</text>
      ))}
    </Svg>
  );
};

// Radar sweep over an app's routes, one flagged as vulnerable
const SecurityArt = ({ primary, secondary }) => {
  const sweep = useSafeId('sweep');
  const routes = [[186, 88], [178, 200], [384, 194], [250, 236]];
  const flagged = [366, 82];
  return (
    <Svg>
      <defs>
        <linearGradient id={sweep} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={primary} stopOpacity="0" />
          <stop offset="1" stopColor={primary} stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <circle cx="280" cy="140" r="110" fill="none" stroke={FAINT} strokeDasharray="2 6" />
      <circle cx="280" cy="140" r="62" fill="none" stroke="rgba(255,255,255,0.06)" />
      <g style={{ transformOrigin: '280px 140px', animation: 'spin 6s linear infinite' }}>
        <path d="M280 140 L280 30 A110 110 0 0 1 375 85 Z" fill={`url(#${sweep})`} />
      </g>
      {routes.map(([x, y]) => <path key={x} d={`M280 140 L${x} ${y}`} stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />)}
      <path d={`M280 140 L${flagged[0]} ${flagged[1]}`} stroke="#fb7185" strokeOpacity="0.75" strokeWidth="1.5" strokeDasharray="4 4" />
      {routes.map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="7" fill={secondary} />)}
      <text x="186" y="70" textAnchor="middle" fill={DIM} fontFamily={MONO} fontSize="11">/login</text>
      <text x="384" y="220" textAnchor="middle" fill={DIM} fontFamily={MONO} fontSize="11">/upload</text>
      <text x="366" y="60" textAnchor="middle" fill="#fb7185" fontFamily={MONO} fontSize="11">/admin</text>
      <circle cx={flagged[0]} cy={flagged[1]} r="8" fill="none" stroke="#fb7185" strokeWidth="2" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'ping-out 2.4s ease-out infinite' }} />
      <circle cx={flagged[0]} cy={flagged[1]} r="8" fill="#fb7185" />
      <circle cx="280" cy="140" r="22" fill={INK} stroke={primary} strokeWidth="1.5" />
      <circle cx="280" cy="140" r="6" fill={primary} />
    </Svg>
  );
};

// Layered neural network with a sparkle
const AiArt = ({ primary, secondary }) => {
  const layers = [[172, [84, 140, 196]], [244, [60, 112, 168, 220]], [316, [88, 140, 192]], [388, [140]]];
  const edges = [];
  layers.slice(0, -1).forEach(([x, ys], li) => {
    const [nextX, nextYs] = layers[li + 1];
    ys.forEach((y) => nextYs.forEach((nextY) => edges.push([x, y, nextX, nextY])));
  });
  return (
    <Svg>
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 5 === 0 ? primary : 'rgba(255,255,255,0.12)'} strokeOpacity={i % 5 === 0 ? 0.7 : 1} strokeWidth="1.2" />
      ))}
      {layers.map(([x, ys], li) => ys.map((y) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={li === layers.length - 1 ? 13 : 8} fill={INK} stroke={li % 2 ? secondary : primary} strokeWidth="2" />
      )))}
      <path d="M398 58 l5 13 l13 5 l-13 5 l-5 13 l-5 -13 l-13 -5 l13 -5 z" fill={secondary} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'floatY 4s ease-in-out infinite' }} />
      <text x="388" y="176" textAnchor="middle" fill={DIM} fontFamily={MONO} fontSize="11">output</text>
    </Svg>
  );
};

// Dashboard: KPI tiles, bar chart and a trend line
const ChartArt = ({ primary, secondary }) => {
  const bars = [56, 84, 68, 104, 90, 118, 108]; // tallest top stays below the KPI tiles (y 98)
  const trend = 'M164 170 L204 150 L244 160 L284 128 L324 138 L364 106 L404 114';
  return (
    <Svg>
      <rect x="130" y="36" width="300" height="208" rx="16" fill="rgba(255,255,255,0.04)" stroke={LINE} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={150 + i * 90} y="54" width="80" height="44" rx="10" fill="rgba(255,255,255,0.05)" stroke={FAINT} />
          <rect x={160 + i * 90} y="66" width="36" height="6" rx="3" fill={DIM} fillOpacity="0.6" />
          <rect x={160 + i * 90} y="80" width={50 - i * 8} height="9" rx="4.5" fill={i === 1 ? secondary : primary} />
        </g>
      ))}
      {bars.map((height, i) => (
        <rect key={i} x={152 + i * 40} y={226 - height} width="24" height={height} rx="6" fill={i === 5 ? primary : 'rgba(255,255,255,0.12)'} />
      ))}
      <path d={trend} fill="none" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 8" style={{ animation: 'dash 2.4s linear infinite' }} />
    </Svg>
  );
};

// Small dark label chip, drawn over the graph lines so they never cross the text
const GraphLabel = ({ x, y, text }) => (
  <g>
    <rect x={x - 31} y={y - 9} width="62" height="18" rx="9" fill={INK} stroke={FAINT} />
    <text x={x} y={y + 3.5} textAnchor="middle" fill={DIM} fontFamily={MONO} fontSize="10">{text}</text>
  </g>
);

// Graph database: connected nodes with a highlighted path from Source to Target
const GraphArt = ({ primary, secondary }) => {
  const nodes = [[176, 140], [230, 70], [300, 96], [356, 56], [228, 206], [296, 186], [352, 214], [392, 140]];
  const links = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [6, 7], [2, 5], [2, 7], [1, 5]];
  const path = new Set(['0-4', '4-5', '5-6', '6-7']);
  const isEnd = (i) => i === 0 || i === nodes.length - 1;
  return (
    <Svg>
      {links.map(([a, b]) => {
        const hot = path.has(`${a}-${b}`);
        return <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={hot ? primary : 'rgba(255,255,255,0.15)'} strokeWidth={hot ? 2.5 : 1.2} strokeDasharray={hot ? '6 6' : undefined} style={hot ? { animation: 'dash 2.4s linear infinite' } : undefined} />;
      })}
      {nodes.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={isEnd(i) ? 15 : 10} fill={INK} stroke={isEnd(i) ? secondary : primary} strokeWidth="2" />
          {isEnd(i) && <circle cx={cx} cy={cy} r="5" fill={secondary} />}
        </g>
      ))}
      <GraphLabel x={176} y={174} text="(:Source)" />
      <GraphLabel x={384} y={174} text="(:Target)" />
    </Svg>
  );
};

// Mobile app: phone frame with list rows and floating notification bubbles
const MobileArt = ({ primary, secondary }) => (
  <Svg>
    <rect x="215" y="30" width="130" height="224" rx="22" fill="rgba(255,255,255,0.05)" stroke={LINE} strokeWidth="1.5" />
    <rect x="262" y="40" width="36" height="6" rx="3" fill={FAINT} />
    <rect x="230" y="58" width="100" height="42" rx="10" fill={primary} fillOpacity="0.35" />
    {[112, 144, 176, 208].map((y, i) => (
      <g key={y}>
        <circle cx="244" cy={y + 12} r="9" fill={i % 2 ? secondary : primary} fillOpacity="0.8" />
        <rect x="260" y={y + 6} width={60 - i * 6} height="6" rx="3" fill="rgba(255,255,255,0.3)" />
        <rect x="260" y={y + 16} width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.14)" />
      </g>
    ))}
    <g style={{ animation: 'floatY 5s ease-in-out infinite' }}>
      <rect x="318" y="72" width="98" height="42" rx="14" fill={INK} stroke={secondary} strokeOpacity="0.8" />
      <rect x="332" y="86" width="60" height="6" rx="3" fill={secondary} />
      <rect x="332" y="98" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.25)" />
    </g>
    <g style={{ animation: 'floatY 6s ease-in-out -2s infinite' }}>
      <rect x="146" y="166" width="88" height="38" rx="14" fill={INK} stroke={primary} strokeOpacity="0.8" />
      <rect x="160" y="182" width="52" height="6" rx="3" fill={primary} />
    </g>
  </Svg>
);

// Cloud API: cloud shape, data flowing to a server stack
const CloudArt = ({ primary, secondary }) => (
  <Svg>
    <path d="M190 120 a42 42 0 0 1 80 -18 a52 52 0 0 1 98 22 a36 36 0 0 1 -6 72 H196 a38 38 0 0 1 -6 -76 z" fill="rgba(255,255,255,0.05)" stroke={primary} strokeOpacity="0.7" strokeWidth="1.5" />
    <text x="280" y="160" textAnchor="middle" fill={TEXT} fontFamily={MONO} fontSize="13">{'{ api }'}</text>
    {[220, 280, 340].map((x, i) => (
      <path key={x} d={`M${x} 200 V222`} stroke={i === 1 ? secondary : 'rgba(255,255,255,0.25)'} strokeWidth="2" strokeDasharray="4 6" style={{ animation: 'dash 1.8s linear infinite' }} />
    ))}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={198 + i * 60} y="224" width="44" height="22" rx="6" fill={INK} stroke={i === 1 ? secondary : LINE} />
        <circle cx={210 + i * 60} cy="235" r="3" fill={i === 1 ? secondary : primary} />
      </g>
    ))}
    <circle cx="398" cy="70" r="5" fill={secondary} style={{ animation: 'floatY 4s ease-in-out infinite' }} />
    <circle cx="160" cy="86" r="4" fill={primary} style={{ animation: 'floatY 5s ease-in-out -1s infinite' }} />
  </Svg>
);

// Website: browser window with hero block, cards and a cursor
const BrowserArt = ({ primary, secondary }) => (
  <Svg>
    <rect x="120" y="32" width="320" height="216" rx="14" fill="rgba(255,255,255,0.04)" stroke={LINE} />
    <path d="M120 60 H440" stroke={FAINT} />
    {WINDOW_DOTS.map((fill, i) => <circle key={fill} cx={152 + i * 14} cy="46" r="4" fill={fill} />)}
    <rect x="196" y="40" width="168" height="12" rx="6" fill={FAINT} />
    <rect x="146" y="80" width="150" height="14" rx="7" fill={primary} fillOpacity="0.85" />
    <rect x="146" y="104" width="116" height="8" rx="4" fill="rgba(255,255,255,0.22)" />
    <rect x="146" y="124" width="64" height="20" rx="10" fill={secondary} />
    <rect x="306" y="78" width="108" height="70" rx="10" fill={primary} fillOpacity="0.18" stroke={primary} strokeOpacity="0.5" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={146 + i * 92} y="168" width="82" height="60" rx="10" fill="rgba(255,255,255,0.05)" stroke={FAINT} />
    ))}
    <path d="M372 196 l0 26 l7 -7 l6 12 l5 -2 l-6 -12 l10 0 z" fill="#ffffff" style={{ animation: 'floatY 3.5s ease-in-out infinite' }} />
  </Svg>
);

// Terminal session with a successful run and a blinking cursor
const TerminalArt = ({ primary, secondary }) => (
  <Svg>
    <rect x="130" y="40" width="300" height="200" rx="14" fill={INK} stroke={LINE} />
    {WINDOW_DOTS.map((fill, i) => <circle key={fill} cx={150 + i * 16} cy="60" r="4.5" fill={fill} />)}
    <text x="150" y="100" fill={secondary} fontFamily={MONO} fontSize="13">$</text>
    <text x="166" y="100" fill={TEXT} fontFamily={MONO} fontSize="13">npm run build</text>
    <text x="150" y="126" fill={DIM} fontFamily={MONO} fontSize="12">✓ compiled 214 modules</text>
    <text x="150" y="150" fill={DIM} fontFamily={MONO} fontSize="12">✓ tests passed</text>
    <text x="150" y="176" fill={primary} fontFamily={MONO} fontSize="12">→ deployed</text>
    <text x="150" y="206" fill={secondary} fontFamily={MONO} fontSize="13">$</text>
    <rect x="166" y="195" width="9" height="15" fill={primary} style={{ animation: 'blink 1.1s steps(1) infinite' }} />
  </Svg>
);

// Generic code window
const CodeArt = ({ primary, secondary }) => {
  const lines = [[100, 120, primary], [124, 180, 'rgba(255,255,255,0.18)'], [148, 150, secondary], [172, 200, 'rgba(255,255,255,0.18)'], [196, 90, primary]];
  return (
    <Svg>
      <rect x="130" y="40" width="300" height="200" rx="16" fill="rgba(255,255,255,0.04)" stroke={LINE} />
      {WINDOW_DOTS.map((fill, i) => <circle key={fill} cx={152 + i * 18} cy="62" r="5" fill={fill} />)}
      {lines.map(([y, width, fill], i) => (
        <rect key={y} x={i % 2 ? 176 : 156} y={y} width={width} height="9" rx="4.5" fill={fill} fillOpacity={i % 2 ? 1 : 0.85} />
      ))}
    </Svg>
  );
};

const ART = {
  payments: PaymentsArt,
  security: SecurityArt,
  ai: AiArt,
  mobile: MobileArt,
  chart: ChartArt,
  graph: GraphArt,
  cloud: CloudArt,
  browser: BrowserArt,
  terminal: TerminalArt,
  code: CodeArt,
};

// variant: one of utils/projectArt.js ART_VARIANTS; tone: [primary colour, secondary colour]
const ProjectArt = ({ variant = 'code', tone = ART_TONES[0] }) => {
  const Art = ART[variant] ?? CodeArt;
  return <Art primary={tone[0]} secondary={tone[1]} />;
};

export default ProjectArt;
