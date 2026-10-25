// Chooses an illustration for each project card, with no repeats inside each group of 10 cards
// (cards 1-10, 11-20, ...; there are 10 illustrations). Matching reads the project's tag, title
// and description. Inside a group:
//   1. each project gets its strongest keyword match, if no earlier card has taken it;
//   2. projects still without one get any other matching illustration that is free;
//   3. the rest get a free illustration from FALLBACK_ORDER (generic pictures first).

// Illustration names. ProjectArt.jsx draws each of these.
export const ART_VARIANTS = ['payments', 'security', 'ai', 'mobile', 'chart', 'graph', 'cloud', 'browser', 'terminal', 'code'];

// Keyword rules, strongest topic first. A rule is one regex or a list of regexes (any may match).
// Word boundaries (\b) keep common words from matching, e.g. "client" is not a CLI, "JavaScript" is
// not a script and "automobile" is not mobile. SWIFT (the bank network) must be written in capitals,
// so the Swift programming language does not count as payments.
const KEYWORDS = [
  ['payments', [/\bSWIFT\b/, /iso ?20022|\bmt\W{1,5}(?:to\W{1,3})?mx\b|payment|\bbank|fintech|\bgpi\b|ledger|remittance|\baml\b|money laundering/i]],
  ['security', /secur|vulnerab|pentest|penetration|cyber|threat|virus|malware|\botp\b|\b2fa\b|two-factor|\bauth(?:entication|orization)?\b|\bowasp\b|\bxss\b/i],
  ['ai', /\bai\b|gemini|\bgpt|\bllm|machine learning|\bml\b|neural|generative|chatbot|\bassistant\b/i],
  // "mobile" as a product, not "mobile-friendly", "works on mobile" or "desktop and mobile"
  ['mobile', /(?<!\b(?:on|for|and|or) )\bmobile\b(?![- ]?(?:friendly|responsive|first|ready|view|devices?|screens?|browsers?))|android|\bios\b|react native|flutter|smartphone|play store|app store/i],
  ['chart', /dashboard|analytic|monitor|tracker|tracking|\breport|\bmetrics?\b|insight|\bcharts?\b|statistic|visuali[sz]/i],
  ['graph', /neo4j|\bgraphs?\b|graph database|\bnetwork|database|\bsql\b|mongo|data model/i],
  ['cloud', /cloud|\baws\b|azure|\bgcp\b|\bapis?\b|microservice|serverless|deploy|devops|docker|kubernetes/i],
  ['browser', /\bweb|website|\bsite\b|portfolio|e-?commerce|\bstore\b|\bshop|landing page|front-?end/i],
  ['terminal', /\bcli\b|command[- ]line|terminal|\bshell\b|automat|\bbots?\b|scraper|\bscripts?\b|dev(?:eloper)? ?tool/i],
];

// Order for projects without a free match: generic pictures first, the most topic-specific last
const FALLBACK_ORDER = ['code', 'terminal', 'browser', 'cloud', 'chart', 'graph', 'mobile', 'ai', 'security', 'payments'];

const textOf = (project) => [project.tag, project.title, project.desc].filter(Boolean).join(' ');

// Illustration names this project matches, strongest first
const matchesOf = (project) => {
  const text = textOf(project);
  return KEYWORDS
    .filter(([, rules]) => [rules].flat().some((rule) => rule.test(text)))
    .map(([name]) => name);
};

// Picks illustrations for one group of at most 10 projects (no repeats inside the group)
const assignGroup = (matches) => {
  const picks = new Array(matches.length).fill(null);
  const used = new Set();
  const take = (index, name) => {
    picks[index] = name;
    used.add(name);
  };

  // 1. Strongest match only, so a project's second choice never steals another project's first choice
  matches.forEach((names, i) => {
    if (names[0] && !used.has(names[0])) take(i, names[0]);
  });
  // 2. Any other free match
  matches.forEach((names, i) => {
    const free = picks[i] ? null : names.find((name) => !used.has(name));
    if (free) take(i, free);
  });
  // 3. Any free illustration, generic ones first
  picks.forEach((pick, i) => {
    if (!pick) take(i, FALLBACK_ORDER.find((name) => !used.has(name)));
  });
  return picks;
};

// Returns one illustration name per project, in the same order as `projects`.
export const assignArtVariants = (projects) => {
  const matches = projects.map(matchesOf);
  const picks = [];
  for (let start = 0; start < matches.length; start += ART_VARIANTS.length) {
    picks.push(...assignGroup(matches.slice(start, start + ART_VARIANTS.length)));
  }
  return picks;
};

// Colour pairs [primary, secondary] for the illustrations, picked by card index
export const ART_TONES = [
  ['#8b5cf6', '#5cdcf6'],
  ['#5cdcf6', '#8b5cf6'],
  ['#f15cf6', '#8b5cf6'],
  ['#34d399', '#5cdcf6'],
  ['#60a5fa', '#a78bfa'],
  ['#f59e0b', '#f15cf6'],
];
