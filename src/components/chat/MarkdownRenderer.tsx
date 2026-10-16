import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink, ShoppingBag, Sparkles } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

// Blacklisted buzzwords and phrases that should NEVER be used as store search terms
const BLACKLISTED_TERMS = new Set([
  'ver',
  'directo',
  'directa',
  'en directo',
  'ver directo',
  'ver en directo',
  'ver producto',
  'producto directo',
  'enlace',
  'link',
  'url',
  'tienda',
  'buscar',
  'busqueda',
  'búsqueda',
  'comprar',
  'shop',
  'item',
  'producto',
  'search',
  'opcional',
  'afinado',
  'aqui',
  'aquí',
  'click',
  'haz click'
]);

function isBlacklistedQuery(text: string): boolean {
  if (!text) return true;
  const normalized = text.toLowerCase().replace(/[^a-záéíóúüñ\s]/gi, ' ').trim();
  if (normalized.length < 2) return true;
  if (BLACKLISTED_TERMS.has(normalized)) return true;
  if (
    normalized === 'ver directo' ||
    normalized === 'ver en directo' ||
    normalized === 'directo' ||
    normalized === 'en directo' ||
    normalized === 'ver' ||
    normalized === 'search'
  ) {
    return true;
  }
  const words = normalized.split(/\s+/).filter(Boolean);
  const meaningful = words.filter(
    w => !BLACKLISTED_TERMS.has(w) && !/^(en|de|el|la|los|las|un|una|a|y|o)$/i.test(w)
  );
  return meaningful.length === 0;
}

// Clean garment search query: extract ONLY the true garment name (e.g. "blusa rosa lazo")
function cleanGarmentSearchQuery(text: string): string {
  if (!text) return '';
  let cleaned = text.trim();

  // 1. Remove markdown formatting, brackets, quotes, parentheticals
  cleaned = cleaned.replace(/[*_`#]/g, '');
  cleaned = cleaned.replace(/\([^)]*\)/g, ' '); // remove (opcional), (ideal para fresquito), etc.
  cleaned = cleaned.replace(/["'“”«»`]/g, ' ');

  // 2. Remove store prefix patterns like "Zara – ", "Zara - ", "Zara: ", "Buscar en Zara: "
  cleaned = cleaned.replace(
    /^(buscar\s+en\s+|ver\s+en\s+)?(Zara|Mango|Pull&Bear|Pull\s*&\s*Bear|AliExpress|Shein|Sephora|Amazon|Stradivarius|Bershka|H&M|El\s+Corte\s+Ingl[eé]s)\s*[-–—:]\s*/i,
    ''
  );

  // 3. Remove store suffixes like "- Zara", "en Zara", "de Zara"
  cleaned = cleaned.replace(
    /\s*[-–—:]\s*(Zara|Mango|Pull&Bear|Pull\s*&\s*Bear|AliExpress|Shein|Sephora|Amazon|Stradivarius|Bershka|H&M)$/i,
    ''
  );
  cleaned = cleaned.replace(
    /\b(en|de)\s+(Zara|Mango|Pull&Bear|AliExpress|Shein|Sephora|Amazon|Stradivarius|Bershka|H&M)\b/gi,
    ' '
  );

  // 4. Remove standalone store names
  cleaned = cleaned.replace(
    /\b(Zara|Mango|Pull&Bear|AliExpress|Shein|Sephora|Amazon|Stradivarius|Bershka|H&M)\b/gi,
    ' '
  );

  // 5. Remove blacklisted buzzwords
  cleaned = cleaned.replace(
    /\b(b[uú]squeda|buscar|enlace|link|tienda|producto|directo|directa|ver|opcional|afinado)\b/gi,
    ' '
  );

  // 6. Replace symbols/punctuation with spaces
  cleaned = cleaned.replace(/[,;:\-–—_./\\]+/g, ' ');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  if (isBlacklistedQuery(cleaned)) {
    return '';
  }

  // 7. Simplify overly long descriptions into a clean 3-5 word search query
  const allWords = cleaned.split(/\s+/).filter(Boolean);
  if (allWords.length > 4) {
    const fillerWords = new Set([
      'de', 'del', 'con', 'para', 'en', 'un', 'una', 'unos', 'unas', 'el', 'la',
      'los', 'las', 'y', 'o', 'al', 'corte', 'tejido', 'suave', 'ligero', 'ligera',
      'fresco', 'fresca', 'frontal', 'detalle', 'estilo', 'recto', 'holgado'
    ]);
    const filtered = allWords.filter(w => !fillerWords.has(w.toLowerCase()));
    if (filtered.length >= 2) {
      cleaned = filtered.slice(0, 4).join(' ');
    } else {
      cleaned = allWords.slice(0, 4).join(' ');
    }
  }

  return cleaned;
}

// Extract slug from URL path
function extractSlugFromUrl(url: string): string {
  try {
    const cleanPath = url.split('?')[0].split('#')[0];
    const segments = cleanPath.split('/').filter(Boolean);
    const lastSeg = segments[segments.length - 1] || '';
    const withoutExt = lastSeg.replace(/\.html?$/i, '');
    // Remove numerical sku suffixes like p05678900, 17012345, c1023456789
    const cleanSlug = withoutExt
      .replace(/\bp\d+\b/gi, '')
      .replace(/\bc\d+\b/gi, '')
      .replace(/_\d+/g, '')
      .replace(/-\d+/g, '')
      .replace(/[-_]/g, ' ')
      .trim();
    return cleanSlug;
  } catch {
    return '';
  }
}

// Detect Store from URL
function detectStoreFromUrl(url: string): string {
  const lower = (url || '').toLowerCase();
  if (lower.includes('zara.com')) return 'Zara';
  if (lower.includes('mango.com')) return 'Mango';
  if (lower.includes('pullandbear.com')) return 'Pull&Bear';
  if (lower.includes('aliexpress.com')) return 'AliExpress';
  if (lower.includes('sephora.es')) return 'Sephora';
  if (lower.includes('shein.com')) return 'Shein';
  if (lower.includes('amazon.es') || lower.includes('amazon.com')) return 'Amazon';
  if (lower.includes('stradivarius.com')) return 'Stradivarius';
  if (lower.includes('bershka.com')) return 'Bershka';
  if (lower.includes('hm.com')) return 'H&M';
  return 'Tienda';
}

// Build real search URL for store with ONLY the pure item name
function buildStoreSearchUrl(store: string, query: string): string {
  const cleanQ = cleanGarmentSearchQuery(query) || 'ropa coquette mujer';
  const encoded = encodeURIComponent(cleanQ);
  const s = (store || '').toLowerCase();

  if (s.includes('zara')) return `https://www.zara.com/es/es/search?searchTerm=${encoded}`;
  if (s.includes('mango')) return `https://shop.mango.com/es/search?kw=${encoded}`;
  if (s.includes('pull')) return `https://www.pullandbear.com/es/search?searchTerm=${encoded}`;
  if (s.includes('aliexpress')) return `https://es.aliexpress.com/wholesale?SearchText=${encoded}`;
  if (s.includes('sephora')) return `https://www.sephora.es/buscar?q=${encoded}`;
  if (s.includes('shein')) return `https://es.shein.com/pdsearch/${encoded}`;
  if (s.includes('stradivarius')) return `https://www.stradivarius.com/es/search?searchTerm=${encoded}`;
  if (s.includes('bershka')) return `https://www.bershka.com/es/search?searchTerm=${encoded}`;
  if (s.includes('hm') || s.includes('h&m')) return `https://www2.hm.com/es_es/search-results.html?q=${encoded}`;
  return `https://www.amazon.es/s?k=${encoded}`;
}

// Pre-process markdown: transforms squeezed shopping tables into gorgeous responsive cards
function preprocessMarkdownShoppingTables(text: string): string {
  if (!text) return '';
  const lines = text.split('\n');
  const resultLines: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];

  const flushTable = () => {
    if (tableLines.length === 0) return;

    // Check if this table is a shopping table (contains store names or links or outfit piece terms)
    const tableText = tableLines.join(' ').toLowerCase();
    const isShoppingTable =
      /zara|mango|pullandbear|pull&bear|aliexpress|sephora|shein|stradivarius|bershka|http/.test(tableText) ||
      ((tableText.includes('pieza') || tableText.includes('top') || tableText.includes('bottom') || tableText.includes('calzado') || tableText.includes('bolso')) &&
        (tableText.includes('tienda') || tableText.includes('enlace') || tableText.includes('search')));

    if (isShoppingTable) {
      // Transform table into clean shopping cards!
      const cards: string[] = [];

      for (const tLine of tableLines) {
        const trimmed = tLine.trim();
        // Skip markdown table separators
        if (/^\|[\s\-:|]+\|$/.test(trimmed)) continue;

        const cells = trimmed.split('|').map(c => c.trim()).filter(Boolean);
        if (cells.length < 2) continue;

        // Skip header row
        const firstCell = cells[0].toLowerCase().replace(/[*_`]/g, '');
        if (
          firstCell === 'pieza' ||
          firstCell === 'prenda' ||
          firstCell === 'categoría' ||
          firstCell === 'categoria' ||
          firstCell.includes('---')
        ) {
          continue;
        }

        // Find store, url, item category, item description
        let store = '';
        let url = '';
        const itemCategory = cells[0].replace(/[*_`]/g, '').trim();
        let itemDescription = '';

        for (let c = 0; c < cells.length; c++) {
          const rawCell = cells[c];
          const cleanCell = rawCell.replace(/[*_`]/g, '').trim();

          const urlMatch = rawCell.match(/https?:\/\/[^\s>)]+/);
          if (urlMatch) {
            url = urlMatch[0];
          }

          if (
            /^(zara|mango|pull&bear|pull\s*&\s*bear|aliexpress|shein|sephora|amazon|stradivarius|bershka|h&m)$/i.test(cleanCell)
          ) {
            store = cleanCell;
          } else if (cleanCell.length > itemDescription.length && !urlMatch) {
            itemDescription = cleanCell;
          }
        }

        if (!store && url) {
          store = detectStoreFromUrl(url);
        }
        if (!store) store = 'Zara';

        // Extract clean search query from description or category or slug
        const queryCandidate = itemDescription || itemCategory || extractSlugFromUrl(url);
        const cleanQuery =
          cleanGarmentSearchQuery(queryCandidate) ||
          cleanGarmentSearchQuery(itemCategory) ||
          'ropa coquette';
        const targetUrl = buildStoreSearchUrl(store, cleanQuery);

        const cardTitle = itemCategory && itemCategory.length < 20 ? itemCategory : 'Prenda sugerida';

        cards.push(`### 👗 ${cardTitle}: ${cleanQuery}`);
        if (itemDescription && itemDescription !== cleanQuery) {
          cards.push(`- **Detalle:** ${itemDescription}`);
        }
        cards.push(`- **Tienda:** ${store}`);
        cards.push(`[Buscar "${cleanQuery}" en ${store}](${targetUrl})\n`);
      }

      if (cards.length > 0) {
        resultLines.push(...cards);
      } else {
        resultLines.push(...tableLines);
      }
    } else {
      // Keep simple tables (e.g. 2-column budget breakdown)
      resultLines.push(...tableLines);
    }

    tableLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('|')) {
      inTable = true;
      tableLines.push(line);
    } else {
      if (inTable) {
        flushTable();
        inTable = false;
      }

      // Handle standalone bare or angled URLs like <https://...>
      let processedLine = line;
      if (processedLine.includes('<http')) {
        processedLine = processedLine.replace(/<(https?:\/\/[^\s>]+)>/g, (_match, u) => {
          const store = detectStoreFromUrl(u);
          const slugQuery = cleanGarmentSearchQuery(extractSlugFromUrl(u)) || 'moda coquette';
          const targetUrl = buildStoreSearchUrl(store, slugQuery);
          return `[Buscar "${slugQuery}" en ${store}](${targetUrl})`;
        });
      }

      resultLines.push(processedLine);
    }
  }

  if (inTable) {
    flushTable();
  }

  return resultLines.join('\n');
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isUser = false }) => {
  if (isUser) {
    return <span className="whitespace-pre-line font-medium">{content}</span>;
  }

  const processedContent = preprocessMarkdownShoppingTables(content);

  return (
    <div className="markdown-chat text-xs sm:text-sm font-medium leading-relaxed text-rosewood-900 space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Bold text: Make it bold, big and prominently styled
          strong: ({ children }) => (
            <strong className="font-extrabold text-rosewood-950 bg-pookie-100/70 text-pookie-800 px-1.5 py-0.5 rounded-md inline-block my-0.5 shadow-xs border border-pookie-200/60">
              {children}
            </strong>
          ),

          // Headings: Display as elegant, large titles
          h1: ({ children }) => (
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-rosewood-900 mt-4 mb-2 flex items-center gap-1.5 border-b border-pookie-200 pb-1.5">
              <Sparkles className="w-4 h-4 text-pookie-500 shrink-0" />
              <span>{children}</span>
            </h3>
          ),
          h2: ({ children }) => (
            <h4 className="font-display font-bold text-base sm:text-lg text-rosewood-900 mt-3 mb-1.5 flex items-center gap-1.5">
              <span className="text-pookie-500">💗</span>
              <span>{children}</span>
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="font-display font-bold text-sm text-pookie-700 mt-2.5 mb-1">
              {children}
            </h5>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="leading-relaxed my-1.5 text-rosewood-800">
              {children}
            </p>
          ),

          // Links: Render as prominent, beautiful clickable store buttons with ONLY clean query!
          a: ({ href, children }) => {
            const rawHref = href || '';
            const linkTextStr = typeof children === 'string'
              ? children
              : Array.isArray(children)
                ? children.map(c => typeof c === 'string' ? c : '').join('')
                : '';

            const storeName = detectStoreFromUrl(rawHref);

            // 1. Try to clean linkTextStr (rejects "Ver Directo", "Enlace", etc.)
            let bestQuery = cleanGarmentSearchQuery(linkTextStr);

            // 2. If linkTextStr was generic, try extracting from URL search parameters (searchTerm, kw, etc.)
            if (!bestQuery) {
              try {
                const urlObj = new URL(rawHref, 'https://example.com');
                const paramQ =
                  urlObj.searchParams.get('searchTerm') ||
                  urlObj.searchParams.get('kw') ||
                  urlObj.searchParams.get('SearchText') ||
                  urlObj.searchParams.get('q') ||
                  urlObj.searchParams.get('k');
                if (paramQ) {
                  bestQuery = cleanGarmentSearchQuery(decodeURIComponent(paramQ));
                }
              } catch {}
            }

            // 3. If still empty, try extracting from URL path slug
            if (!bestQuery) {
              bestQuery = cleanGarmentSearchQuery(extractSlugFromUrl(rawHref));
            }

            // 4. Safe fallback
            if (!bestQuery) {
              bestQuery = 'ropa coquette mujer';
            }

            const guaranteedUrl = buildStoreSearchUrl(storeName, bestQuery);

            return (
              <a
                href={guaranteedUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Buscar "${bestQuery}" en ${storeName}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pookie-500 via-pink-500 to-rose-400 hover:from-pookie-600 hover:to-pink-600 text-white font-bold text-xs shadow-soft hover:shadow-glow transition my-1 mx-0.5 group shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                <span>Buscar "{bestQuery}"</span>
                {storeName && storeName !== 'Tienda' && (
                  <span className="px-1.5 py-0.5 rounded-md bg-white/25 text-[10px] uppercase font-bold tracking-wide">
                    {storeName}
                  </span>
                )}
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-90" />
              </a>
            );
          },

          // Tables: Render as compact, beautiful rounded cards that fit 100% of container width
          table: ({ children }) => (
            <div className="my-3 overflow-hidden rounded-2xl border border-pookie-200/90 shadow-soft bg-white/95">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-pookie-100/90 via-blush-100 to-lavender-100 border-b border-pookie-200 text-pookie-900 font-extrabold uppercase text-[10px] tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-pookie-100/80">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-pink-50/50 transition">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 font-extrabold whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2.5 font-medium text-rosewood-800 align-middle">
              {children}
            </td>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2.5 pl-2 list-none">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2.5 pl-2 list-none counter-reset">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed">
              <span className="text-pookie-500 font-bold mt-0.5 select-none">✨</span>
              <div className="flex-1">{children}</div>
            </li>
          ),

          // Horizontal rule
          hr: () => (
            <div className="my-4 flex items-center justify-center gap-2 text-pookie-300">
              <div className="h-px bg-pookie-200/80 flex-1" />
              <span className="text-xs select-none">🎀</span>
              <div className="h-px bg-pookie-200/80 flex-1" />
            </div>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-pookie-400 pl-3.5 py-1.5 my-2.5 bg-pookie-50/80 rounded-r-2xl italic text-rosewood-700 text-xs sm:text-sm">
              {children}
            </blockquote>
          )
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
