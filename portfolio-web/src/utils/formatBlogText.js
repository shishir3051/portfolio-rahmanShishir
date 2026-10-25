// Converts one line of blog text into safe HTML.
// The text is HTML-escaped FIRST, so any markup an author types (e.g. <script>, <img onerror>)
// is shown as plain text. Only the small set of formatting tags below is turned back into HTML.

// Escape characters that have special meaning in HTML.
export const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Allowed values for <span style="color:...">: hex, named colors, CSS variables, rgb()/hsl().
const SAFE_COLOR = /^(#[0-9a-f]{3,8}|[a-z]+|var\(--[a-z0-9-]+\)|(rgb|hsl)a?\([\d\s.,%]+\))$/i;

// Re-enable a simple tag (written by the editor as <tag>...</tag>) after escaping.
const allowTag = (html, tag, className) =>
  html.replace(
    new RegExp(`&lt;${tag}&gt;(.*?)&lt;/${tag}&gt;`, 'g'),
    `<${tag} class="${className}">$1</${tag}>`
  );

export const formatBlogText = (text) => {
  let html = escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/~~(.*?)~~/g, '<del class="opacity-50 line-through">$1</del>');

  html = allowTag(html, 'sub', 'text-xs mr-0.5');
  html = allowTag(html, 'sup', 'text-xs ml-0.5');
  html = allowTag(html, 'mark', 'bg-yellow-400/30 text-yellow-200 px-1 rounded-sm');
  html = allowTag(html, 'u', 'decoration-accent/40 underline-offset-8 decoration-2 font-medium');

  // Colored text: keep the color only if it matches SAFE_COLOR, otherwise drop the span.
  // The color group excludes '&' (escaped quotes start with it), which keeps the match fast.
  html = html.replace(
    /&lt;span style=&quot;color:([^&]*)&quot;&gt;(.*?)&lt;\/span&gt;/g,
    (match, color, inner) => {
      const value = color.trim();
      return SAFE_COLOR.test(value) ? `<span style="color:${value}">${inner}</span>` : inner;
    }
  );

  // Formatting that spans several lines leaves unpaired tags on each line; hide them instead of showing raw text.
  return html
    .replace(/&lt;\/?(sub|sup|mark|u)&gt;/g, '')
    .replace(/&lt;span style=&quot;color:[^&]*&quot;&gt;|&lt;\/span&gt;/g, '');
};
