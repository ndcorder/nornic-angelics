#!/usr/bin/env node

/**
 * fineprint.js — Exquisitely Fine Print
 *
 * A CLI tool that takes any URL and returns the page's text,
 * stripped of ads, cookie banners, newsletter popups, and dark patterns.
 * Every removed element is annotated with what it was and how many
 * pixels of screen real estate it consumed.
 *
 * Usage:
 *   node fineprint.js <url>
 *   node fineprint.js <url> --report-only
 *   node fineprint.js <url> --json
 *   node fineprint.js <url> --verbose
 *   node fineprint.js <url> --no-color
 *
 * Exit codes:
 *   0 — Success
 *   1 — Usage error
 *   2 — Network error
 *   3 — Parse error
 */

'use strict';

const http = require('http');
const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════
// BOOTSTRAP: Auto-install cheerio if missing
// ═══════════════════════════════════════════════════════════

function requireOrInstall(pkg) {
  try {
    return require(pkg);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e;
    const mod = require('module');
    const p = path.join(path.dirname(mod._filename || process.argv[1]), 'node_modules', pkg);
    try { return require(p); } catch (_) {}
    console.error(`fineprint: installing dependency '${pkg}'...`);
    const { execSync } = require('child_process');
    try {
      execSync(`npm install --no-save ${pkg}`, { stdio: 'pipe' });
    } catch (installErr) {
      try {
        execSync(`npm install --no-package-lock --no-save ${pkg}`, { stdio: 'pipe' });
      } catch (installErr2) {
        console.error(`fineprint: could not install '${pkg}'. Please run: npm install ${pkg}`);
        process.exit(1);
      }
    }
    return require(pkg);
  }
}

const cheerio = requireOrInstall('cheerio');

// ═══════════════════════════════════════════════════════════
// COLOR UTILITIES
// ═══════════════════════════════════════════════════════════

const useColor = !process.argv.includes('--no-color') && !process.argv.includes('--json');

const c = useColor ? {
  red: s => `\x1b[31m${s}\x1b[0m`,
  green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  blue: s => `\x1b[34m${s}\x1b[0m`,
  magenta: s => `\x1b[35m${s}\x1b[0m`,
  cyan: s => `\x1b[36m${s}\x1b[0m`,
  dim: s => `\x1b[2m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
  underline: s => `\x1b[4m${s}\x1b[0m`,
} : {
  red: s => s, green: s => s, yellow: s => s,
  blue: s => s, magenta: s => s, cyan: s => s,
  dim: s => s, bold: s => s, underline: s => s,
};

// ═══════════════════════════════════════════════════════════
// CONSTANTS: Selectors and patterns for clutter detection
// ═══════════════════════════════════════════════════════════

const CLUTTER_SELECTORS = {
  'script': 'script',
  'noscript': 'noscript',
  'style': 'style',
  'iframe': 'iframe',
  'svg': 'svg',
  'nav': 'navigation',
  'header[role="banner"], header.site-header, header.main-header, header.global-header': 'header',
  'footer, footer[role="contentinfo"], footer.site-footer, footer.main-footer': 'footer',
  'aside, aside.sidebar, aside[role="complementary"], [role="complementary"]': 'sidebar',
  '[role="navigation"], nav': 'navigation',
  '.social-share, .share-buttons, .sharing, .share-tools, .social-links, .social-buttons, [class*="social-share"], [class*="share-button"]': 'social_buttons',
  '.newsletter, .newsletter-signup, .newsletter-popup, [class*="newsletter"], [id*="newsletter"], [class*="subscribe"], [id*="subscribe"]': 'newsletter_signup',
  '.popup, .modal, .overlay, .lightbox, .fancybox, [class*="popup"], [class*="modal-content"], [role="dialog"]': 'modal_popup',
  '.cookie-banner, .cookie-notice, .cookie-consent, .cookie-popup, .cookie-bar, #cookie-banner, #cookie-notice, #cookie-consent, [class*="cookie-banner"], [class*="cookie-notice"], [class*="cookie-consent"], [class*="cookie-popup"], [id*="cookie-banner"], [id*="cookie-notice"], [id*="cookie-consent"], [class*="gdpr"], [id*="gdpr"], [class*="consent-banner"], [id*="consent-banner"], [class*="cc-banner"], [class*="cc-popup"], [id*="cc-"]': 'cookie_banner',
  '.ad, .ads, .advertisement, .ad-container, .ad-wrapper, .ad-banner, .ad-slot, [class*="ad-container"], [class*="ad-wrapper"], [class*="ad-banner"], [class*="advertisement"], [id*="ad-"], [id*="google-ad"], [class*="google-ad"], [class*="adsense"], [class*="dfp-ad"], .ezoic-ad, [id^="ezoic-pub-ad"], .OUTBRAIN, .Taboola, .taboola, [id^="taboola"], [class*="taboola"], [class*="outbrain"], [id^="outbrain"]': 'advertising',
  '.paywall, .paywall-container, [class*="paywall"], [id*="paywall"], .premium-content, .subscriber-only, [class*="subscribe-wall"]': 'paywall',
  '#comments, .comments, .comment-section, [class*="comment-section"], [id*="comments"], #disqus_thread, [id*="disqus"]': 'comments',
  '.related-posts, .related-articles, .related-content, [class*="related-"], .recommendations, .recommended, [class*="recommend"]': 'related_content',
  '.breadcrumb, .breadcrumbs, [class*="breadcrumb"]': 'breadcrumb',
  '.pagination, .pager, [class*="pagination"], [class*="pager"]': 'pagination',
  '.sticky, .sticky-header, .sticky-nav, .fixed-header, .fixed-nav, [class*="sticky-header"], [class*="sticky-nav"], [style*="position: fixed"], [style*="position:sticky"]': 'sticky_element',
  '.toolbar, .action-bar, .floating-bar, [class*="toolbar"], [class*="action-bar"]': 'toolbar',
  '.notification-bar, .alert-banner, .site-alert, .announcement-bar, [class*="notification-bar"], [class*="site-alert"], [class*="announcement"]': 'notification_banner',
  '.sidebar-widget, .widget, .widget-area, [class*="sidebar-widget"]': 'widget',
  '.mega-menu, .mega-nav, [class*="mega-menu"], [class*="mega-nav"]': 'mega_menu',
  '.language-selector, .locale-selector, [class*="language-selector"], [class*="locale-selector"]': 'language_selector',
  '.back-to-top, .scroll-top, [class*="back-to-top"], [class*="scroll-top"], [class*="scroll-to-top"]': 'back_to_top',
  '.infinite-scroll, .load-more, [class*="infinite-scroll"], [class*="load-more"]': 'load_more',
  '.popup-overlay, .modal-backdrop, [class*="popup-overlay"], [class*="modal-backdrop"], [class*="backdrop"]': 'overlay',
};

const TRACKING_DOMAINS = [
  'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
  'google-analytics.com', 'googletagmanager.com', 'facebook.net',
  'facebook.com/tr', 'taboola.com', 'outbrain.com',
  'amazon-adsystem.com', 'criteo.com', 'scorecardresearch.com',
  'quantserve.com', 'moatads.com', 'chartbeat.com', 'hotjar.com',
  'mixpanel.com', 'segment.io', 'segment.com', 'amplitude.com',
  'adservice.google', 'adsrvr.org', 'rubiconproject.com',
  'pubmatic.com', 'openx.net', 'casalemedia.com', 'indexww.com',
  'sharethis.com', 'addthis.com', 'disqus.com', 'gravity.com',
  'bounceexchange.com', 'bnmla.com', 'pushly.com', 'onesignal.com',
];

const DARK_PATTERN_WORDS = [
  'accept all', 'no thanks', 'maybe later', 'not now', 'dismiss',
  'don\'t show again', 'close', 'continue without accepting',
  'yes, i agree', 'agree to all', 'accept and continue',
  'remind me later', 'never ask again', 'don\'t ask again',
  'subscribe now', 'sign up now', 'join now', 'register',
  'don\'t miss out', 'limited time', 'exclusive', 'free trial',
  'start your trial', 'get started', 'upgrade now', 'unlock',
  'premium access', 'members only', 'subscription required',
];

// ═══════════════════════════════════════════════════════════
// ARGUMENT PARSING
// ═══════════════════════════════════════════════════════════

function parseArgs(argv) {
  const flags = [];
  const positional = [];
  for (let i = 2; i < argv.length; i++) {
    if (argv[i].startsWith('--') || (argv[i].startsWith('-') && argv[i].length > 1 && !argv[i].match(/^-\d/))) {
      flags.push(argv[i]);
    } else {
      positional.push(argv[i]);
    }
  }
  return {
    url: positional[0] || null,
    reportOnly: flags.includes('--report-only') || flags.includes('-r'),
    json: flags.includes('--json') || flags.includes('-j'),
    verbose: flags.includes('--verbose') || flags.includes('-v'),
    noColor: flags.includes('--no-color'),
    help: flags.includes('--help') || flags.includes('-h'),
  };
}

function showHelp() {
  const help = `
${c.bold('fineprint')} — ${c.dim('Exquisitely Fine Print')}

${c.cyan('USAGE')}
  fineprint <url> [options]

${c.cyan('OPTIONS')}
  -r, --report-only   Output only the clutter report (JSON) to stdout
  -j, --json          Output the full result as JSON (text + report) to stdout
  -v, --verbose       Show detailed removal log on stderr
      --no-color      Disable colored output
  -h, --help          Show this help message

${c.cyan('DESCRIPTION')}
  Fetches a URL, strips clutter (ads, modals, banners, popups),
  and outputs clean readable text to stdout with a clutter report
  on stderr showing every removed element classified and measured.

${c.cyan('EXAMPLES')}
  fineprint https://example.com/article
  fineprint https://example.com/article --report-only
  fineprint https://example.com/article --verbose 2>report.txt
  fineprint https://example.com/article --json >article.json

${c.cyan('EXIT CODES')}
  0  Success
  1  Usage error (missing/invalid URL)
  2  Network error (fetch failed)
  3  Parse error (could not process HTML)
`;
  console.error(help);
}

// ═══════════════════════════════════════════════════════════
// NETWORK: Fetch URL with timeout and redirect following
// ═══════════════════════════════════════════════════════════

function fetchUrl(urlStr, timeout = 15000, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    let parsed;
    try {
      parsed = new URL(urlStr);
    } catch (e) {
      return reject(new Error(`Invalid URL: ${urlStr}`));
    }

    if (!parsed.protocol || !['http:', 'https:'].includes(parsed.protocol)) {
      return reject(new Error(`Unsupported protocol: ${parsed.protocol}`));
    }

    const lib = parsed.protocol === 'https:' ? https : http;
    const opts = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Fineprint/1.0; +https://github.com/fineprint)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'identity',
        'DNT': '1',
        'Connection': 'close',
      },
      timeout,
    };

    const req = lib.request(opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (maxRedirects <= 0) {
          res.resume();
          return reject(new Error('Too many redirects'));
        }
        const location = new URL(res.headers.location, urlStr).href;
        res.resume();
        return fetchUrl(location, timeout, maxRedirects - 1).then(resolve, reject);
      }
      if (res.statusCode < 200 || res.statusCode >= 400) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const html = Buffer.concat(chunks).toString('utf8');
        resolve({ html, statusCode: res.statusCode, headers: res.headers });
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
    req.end();
  });
}

// ═══════════════════════════════════════════════════════════
// CLUTTER DETECTION: Analyze element attributes
// ═══════════════════════════════════════════════════════════

function hasTrackingAttributes($el) {
  const src = ($el.attr('src') || '').toLowerCase();
  const attribs = $el.get(0).attribs || {};
  const dataAttrs = Object.keys(attribs).filter(a => a.startsWith('data-')).join(' ').toLowerCase();
  const cls = ($el.attr('class') || '').toLowerCase();
  const all = src + ' ' + cls + ' ' + dataAttrs;

  for (const domain of TRACKING_DOMAINS) {
    if (all.includes(domain)) return true;
  }

  if ($el.attr('data-track') || $el.attr('data-analytics') ||
      $el.attr('data-gtm') || $el.attr('data-pixel') ||
      $el.attr('data-ad') || $el.attr('data-ad-slot')) {
    return true;
  }

  return false;
}

function hasDarkPatterns($el) {
  const text = $el.text().toLowerCase();
  let count = 0;
  for (const pattern of DARK_PATTERN_WORDS) {
    if (text.includes(pattern)) count++;
  }
  return count;
}

function estimatePixelArea($el) {
  const style = $el.attr('style') || '';

  let width = null;
  let height = null;

  const wMatch = style.match(/width\s*:\s*(\d+)/);
  const hMatch = style.match(/height\s*:\s*(\d+)/);
  if (wMatch) width = parseInt(wMatch[1], 10);
  if (hMatch) height = parseInt(hMatch[1], 10);

  const wAttr = $el.attr('width');
  const hAttr = $el.attr('height');
  if (!width && wAttr) width = parseInt(wAttr, 10);
  if (!height && hAttr) height = parseInt(hAttr, 10);

  if (width && height) return width * height;

  const tag = ($el.get(0).tagName || '').toLowerCase();
  if (['header', 'footer'].includes(tag)) {
    return width ? width * 60 : (height ? 1440 * height : 86400);
  }
  if (['nav'].includes(tag)) {
    return width ? width * 50 : (height ? 1440 * height : 72000);
  }
  if (['aside'].includes(tag)) {
    return 300 * (height || 800);
  }
  if (tag === 'iframe') {
    return 300 * 250;
  }
  if (['script', 'style', 'noscript'].includes(tag)) {
    return 0;
  }
  if (tag === 'svg') {
    return 24 * 24;
  }

  const cls = ($el.attr('class') || '').toLowerCase();
  if (cls.includes('banner') || cls.includes('bar')) {
    return 1440 * 50;
  }
  if (cls.includes('modal') || cls.includes('popup') || cls.includes('overlay')) {
    return 1440 * 900;
  }

  const textLen = $el.text().length;
  if (textLen > 0) {
    const lines = Math.ceil(textLen / 80);
    return Math.min(1440, Math.max(200, textLen * 8)) * (lines * 24);
  }

  return 400 * 100;
}

function classifyElement($, el) {
  const $el = $(el);
  const classes = ($el.attr('class') || '').toLowerCase();
  const id = ($el.attr('id') || '').toLowerCase();
  const tag = (el.tagName || '').toLowerCase();
  const combined = `${classes} ${id}`;

  for (const [selector, type] of Object.entries(CLUTTER_SELECTORS)) {
    try {
      const firstSelector = selector.split(',')[0].trim();
      if ($el.is(firstSelector)) {
        return type;
      }
    } catch (e) { continue; }
  }

  if (tag === 'div' || tag === 'section' || tag === 'span') {
    if (/cookie|consent|gdpr|ccpa|opt-out|opt out/.test(combined)) return 'cookie_banner';
    if (/newslet|subscri|sign\.up|mailing/.test(combined)) return 'newsletter_signup';
    if (/\bad[s_-]|\bad\b|advertis|sponsor|promo/.test(combined) && !/\bad(dress|vice|vent|just|apt|mit|voc|min|her|dition)/.test(combined)) return 'advertising';
    if (/paywall|premium|subscriber|members[hip]?/.test(combined)) return 'paywall';
    if (/popup|modal|overlay|interstit|lightbox/.test(combined)) return 'modal_popup';
    if (/social|share|tweet|facebook|twitter/.test(combined)) return 'social_buttons';
    if (/comment|disqus|reply/.test(combined)) return 'comments';
    if (/related|recommend|suggest|more\.link|read\.more/.test(combined)) return 'related_content';
    if (/sidebar|widget/.test(combined)) return 'sidebar';
    if (/sticky|fixed|pinned/.test(combined)) return 'sticky_element';
    if (/notification|alert|banner|announce/.test(combined)) return 'notification_banner';
    if (/tool\.?bar|action\.?bar/.test(combined)) return 'toolbar';
  }

  return 'unknown_clutter';
}

// ═══════════════════════════════════════════════════════════
// CORE: Process HTML and extract content
// ═══════════════════════════════════════════════════════════

function processHtml(html, url, verbose) {
  const $ = cheerio.load(html, { decodeEntities: true });
  const removed = [];
  const stats = { scripts: 0, styles: 0, ads: 0, trackers: 0, popups: 0, banners: 0, other: 0 };

  // Count trackers across all elements
  $('*').each(function () {
    const src = ($(this).attr('src') || '').toLowerCase();
    for (const domain of TRACKING_DOMAINS) {
      if (src.includes(domain)) {
        stats.trackers++;
        break;
      }
    }
  });

  // Remove clutter elements and record them
  for (const [selector, type] of Object.entries(CLUTTER_SELECTORS)) {
    try {
      const elements = $(selector);
      elements.each(function () {
        const $el = $(this);
        if ($el.length === 0) return;

        const area = estimatePixelArea($el);
        const isTracker = hasTrackingAttributes($el);
        const darkPatterns = hasDarkPatterns($el);
        const classifiedType = classifyElement($, this);
        const text = $el.text().substring(0, 80).replace(/\s+/g, ' ').trim();

        const entry = {
          type: classifiedType || type,
          selector,
          area,
          isTracker,
          darkPatterns,
          snippet: text || ($el.attr('id') ? `#${$el.attr('id')}` : ($el.attr('class') ? `.${$el.attr('class').split(/\s+/)[0]}` : '')),
          tag: (this.tagName || '').toLowerCase(),
          attributes: {},
        };

        if (isTracker) entry.attributes.tracking = true;
        if ($el.attr('style') && /position\s*:\s*(fixed|sticky)/i.test($el.attr('style'))) {
          entry.attributes.positioning = 'fixed_sticky';
        }
        if ($el.attr('aria-hidden') === 'true') entry.attributes.ariaHidden = true;

        removed.push(entry);

        if (['script', 'noscript'].includes(entry.tag)) stats.scripts++;
        else if (entry.tag === 'style') stats.styles++;
        else if (classifiedType === 'advertising' || isTracker) stats.ads++;
        else if (classifiedType === 'modal_popup') stats.popups++;
        else if (classifiedType === 'cookie_banner') stats.banners++;
        else stats.other++;

        $el.remove();
      });
    } catch (e) {
      if (verbose) console.error(c.yellow(`Warning: selector failed: ${selector}`));
    }
  }

  // Extract title
  let title = '';
  const $ogTitle = $('meta[property="og:title"]');
  const $titleTag = $('title');
  if ($ogTitle.length) title = $ogTitle.attr('content') || '';
  else if ($titleTag.length) title = $titleTag.text();
  title = title.trim();

  // Remove remaining meta elements
  $('title').remove();
  $('meta').remove();
  $('link[rel="stylesheet"]').remove();
  $('link[rel="icon"]').remove();

  // Find the main content container
  const possibleContent = [
    'article', 'main', '[role="main"]', '.article-body', '.article-content',
    '.post-body', '.post-content', '.entry-content', '.content-body',
    '.story-body', '.story-content', '#article-body', '#article-content',
    '#content', '.content', '.main-content', '#main-content',
    '.page-content', '.page-body', '.post', '.article',
  ];

  let $content = $();
  for (const sel of possibleContent) {
    const $el = $(sel);
    if ($el.length) {
      $content = $el.first();
      break;
    }
  }

  if (!$content.length) {
    $content = $('body');
  }

  // Remove hidden elements within content
  $content.find('*').each(function () {
    const $el = $(this);
    const style = $el.attr('style') || '';
    if (/display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0/.test(style)) {
      $el.remove();
    }
    if ($el.attr('aria-hidden') === 'true') {
      $el.remove();
    }
  });

  const textContent = extractText($content);

  return {
    title,
    text: textContent,
    removed,
    stats,
    meta: {
      url,
      timestamp: new Date().toISOString(),
      originalSize: html.length,
      elementsRemoved: removed.length,
      totalPixelArea: removed.reduce((sum, r) => sum + r.area, 0),
    },
  };
}

// ═══════════════════════════════════════════════════════════
// TEXT EXTRACTION: Convert HTML to clean readable text
// ═══════════════════════════════════════════════════════════

function extractText($container) {
  let result = '';

  function walk($el) {
    $el.contents().each(function () {
      if (this.type === 'text') {
        const text = this.data.replace(/\s+/g, ' ');
        result += text;
      } else if (this.type === 'tag') {
        const tag = (this.tagName || '').toLowerCase();
        const blockTags = new Set([
          'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'li', 'blockquote', 'pre', 'section', 'article', 'main',
          'aside', 'header', 'footer', 'br', 'hr', 'tr', 'dl', 'dt', 'dd',
          'figcaption', 'figure',
        ]);

        if (tag === 'br') {
          result += '\n';
        } else if (tag === 'hr') {
          result += '\n---\n';
        } else if (blockTags.has(tag)) {
          result += '\n';
          walk($(this));
          result += '\n';
        } else if (tag === 'a') {
          const href = $(this).attr('href');
          const linkText = $(this).text().trim();
          if (href && linkText && !href.startsWith('#') && !href.startsWith('javascript:')) {
            result += linkText;
          } else if (linkText) {
            result += linkText;
          }
        } else if (tag === 'img') {
          const alt = $(this).attr('alt');
          if (alt) result += `[${alt}]`;
        } else if (tag === 'li') {
          result += '\n  • ';
          walk($(this));
        } else {
          walk($(this));
        }
      }
    });
  }

  walk($container);
  return result.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
}

// ═══════════════════════════════════════════════════════════
// REPORT GENERATION: Human-readable clutter report
// ═══════════════════════════════════════════════════════════

function generateReport(result, verbose) {
  const { removed, stats, meta } = result;
  const lines = [];

  const bar = '═'.repeat(52);

  lines.push('');
  lines.push(c.bold(c.cyan('╔' + bar + '╗')));
  lines.push(c.bold(c.cyan('║') + '  CLUTTER REPORT' + ' '.repeat(52 - 16) + c.bold(c.cyan('║'))));
  lines.push(c.bold(c.cyan('╚' + bar + '╝')));
  lines.push('');

  lines.push(c.dim('  URL:      ') + meta.url);
  lines.push(c.dim('  Date:     ') + meta.timestamp);
  lines.push(c.dim('  Size:     ') + formatBytes(meta.originalSize) + ' original');
  lines.push('');

  const totalArea = meta.totalPixelArea;
  lines.push(c.bold('  Summary'));
  lines.push(c.dim('  ──────────────────────────────────────────'));
  lines.push(`  Elements removed:  ${c.yellow(meta.elementsRemoved)}`);
  lines.push(`  Pixel area freed:  ${c.yellow(formatPixelArea(totalArea))}`);
  lines.push(`  Trackers detected: ${c.red(stats.trackers)}`);
  lines.push('');

  lines.push(c.bold('  Breakdown'));
  lines.push(c.dim('  ──────────────────────────────────────────'));

  const breakdown = [
    ['Scripts', stats.scripts],
    ['Stylesheets', stats.styles],
    ['Advertising', stats.ads],
    ['Popups/Modals', stats.popups],
    ['Cookie Banners', stats.banners],
    ['Other Clutter', stats.other],
  ];

  for (const [label, count] of breakdown) {
    if (count > 0) {
      const barStr = '█'.repeat(Math.min(count, 30));
      lines.push(`  ${label.padEnd(16)} ${c.red(barStr)} ${c.yellow(count)}`);
    }
  }
  lines.push('');

  // Aggregate by type
  const typeMap = {};
  for (const r of removed) {
    if (!typeMap[r.type]) typeMap[r.type] = { count: 0, area: 0, trackers: 0 };
    typeMap[r.type].count++;
    typeMap[r.type].area += r.area;
    if (r.isTracker) typeMap[r.type].trackers++;
  }

  lines.push(c.bold('  Removed Elements'));
  lines.push(c.dim('  ──────────────────────────────────────────'));
  lines.push(c.dim('  ' + 'Type'.padEnd(20) + 'Count   Pixel Area   Trackers'));
  lines.push(c.dim('  ' + '─'.repeat(48)));

  const sorted = Object.entries(typeMap).sort((a, b) => b[1].area - a[1].area);
  for (const [type, data] of sorted) {
    const label = type.replace(/_/g, ' ');
    lines.push(
      '  ' + label.padEnd(20) +
      String(data.count).padStart(4) +
      '   ' + formatPixelArea(data.area).padStart(12) +
      '   ' + (data.trackers > 0 ? c.red('  ' + data.trackers) : '    -')
    );
  }
  lines.push('');

  if (verbose) {
    lines.push(c.bold('  Detailed Removal Log'));
    lines.push(c.dim('  ──────────────────────────────────────────'));
    for (const r of removed.slice(0, 50)) {
      const snip = r.snippet ? r.snippet.substring(0, 35) : '';
      const flags = [];
      if (r.isTracker) flags.push(c.red('TRACKING'));
      if (r.darkPatterns > 0) flags.push(c.magenta('DARK-PATTERN'));
      if (r.attributes.positioning === 'fixed_sticky') flags.push(c.yellow('STICKY'));
      if (r.attributes.ariaHidden) flags.push(c.dim('HIDDEN'));

      lines.push(
        `  ${c.dim(r.tag.padEnd(8))} ${typeLabel(r.type).padEnd(14)} ${formatPixelArea(r.area).padStart(10)}` +
        (flags.length ? `  ${flags.join(' ')}` : '') +
        (snip ? `  ${c.dim(snip)}` : '')
      );
    }
    if (removed.length > 50) {
      lines.push(c.dim(`  ... and ${removed.length - 50} more`));
    }
    lines.push('');
  }

  const darkPatternsFound = removed.filter(r => r.darkPatterns > 0);
  if (darkPatternsFound.length > 0) {
    lines.push(c.bold(c.red('  ⚠ Dark Patterns Detected')));
    lines.push(c.dim('  ──────────────────────────────────────────'));
    for (const r of darkPatternsFound.slice(0, 5)) {
      lines.push(`  ${c.red('●')} ${r.type.replace(/_/g, ' ')} (${r.darkPatterns} indicators)`);
      if (r.snippet) lines.push(`    ${c.dim(r.snippet.substring(0, 50))}`);
    }
    lines.push('');
  }

  lines.push(c.dim('  You were spared from ' + meta.elementsRemoved + ' elements totaling ' + formatPixelArea(totalArea) + '.'));
  lines.push(c.dim('  Read in peace.'));
  lines.push('');

  return lines.join('\n');
}

function generateJsonReport(result) {
  const output = {
    fineprint: '1.0.0',
    url: result.meta.url,
    timestamp: result.meta.timestamp,
    title: result.title,
    summary: {
      originalSizeBytes: result.meta.originalSize,
      elementsRemoved: result.meta.elementsRemoved,
      totalPixelAreaFreed: result.meta.totalPixelArea,
      trackersDetected: result.stats.trackers,
      breakdown: {
        scripts: result.stats.scripts,
        stylesheets: result.stats.styles,
        advertising: result.stats.ads,
        popups: result.stats.popups,
        cookieBanners: result.stats.banners,
        other: result.stats.other,
      },
    },
    removedElements: result.removed.map(r => ({
      type: r.type,
      tag: r.tag,
      pixelArea: r.area,
      isTracker: r.isTracker,
      darkPatternIndicators: r.darkPatterns,
      snippet: r.snippet || null,
      attributes: r.attributes,
    })),
    darkPatterns: result.removed
      .filter(r => r.darkPatterns > 0)
      .map(r => ({ type: r.type, indicators: r.darkPatterns, snippet: r.snippet })),
    text: result.text,
  };
  return JSON.stringify(output, null, 2);
}

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function formatPixelArea(area) {
  if (area === 0) return '0 px²';
  if (area < 1000) return area + ' px²';
  if (area < 1000000) return (area / 1000).toFixed(1) + 'K px²';
  return (area / 1000000).toFixed(2) + 'M px²';
}

function typeLabel(type) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, ch => ch);
}

// ═══════════════════════════════════════════════════════════
// EXPORTS (for testing)
// ═══════════════════════════════════════════════════════════

module.exports = {
  parseArgs,
  processHtml,
  extractText,
  generateReport,
  generateJsonReport,
  fetchUrl,
  classifyElement,
  estimatePixelArea,
  hasTrackingAttributes,
  hasDarkPatterns,
};

// ═══════════════════════════════════════════════════════════
// MAIN (only when run directly)
// ═══════════════════════════════════════════════════════════

if (require.main === module) {
  (async function main() {
    const args = parseArgs(process.argv);

    if (args.help) {
      showHelp();
      process.exit(0);
    }

    if (!args.url) {
      console.error(c.red('Error: URL required'));
      console.error(c.dim('Usage: fineprint <url> [options]'));
      console.error(c.dim('Run with --help for more information'));
      process.exit(1);
    }

    let targetUrl = args.url;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    let response;
    try {
      console.error(c.dim(`Fetching ${targetUrl}...`));
      response = await fetchUrl(targetUrl);
    } catch (err) {
      console.error(c.red(`Error: Failed to fetch URL: ${err.message}`));
      process.exit(2);
    }

    let result;
    try {
      result = processHtml(response.html, targetUrl, args.verbose);
    } catch (err) {
      console.error(c.red(`Error: Failed to parse HTML: ${err.message}`));
      process.exit(3);
    }

    if (args.json) {
      console.log(generateJsonReport(result));
    } else if (args.reportOnly) {
      const reportData = {
        url: result.meta.url,
        timestamp: result.meta.timestamp,
        title: result.title,
        summary: {
          originalSizeBytes: result.meta.originalSize,
          elementsRemoved: result.meta.elementsRemoved,
          totalPixelAreaFreed: result.meta.totalPixelArea,
          trackersDetected: result.stats.trackers,
          breakdown: {
            scripts: result.stats.scripts,
            stylesheets: result.stats.styles,
            advertising: result.stats.ads,
            popups: result.stats.popups,
            cookieBanners: result.stats.banners,
            other: result.stats.other,
          },
        },
        removedElements: result.removed.map(r => ({
          type: r.type,
          tag: r.tag,
          pixelArea: r.area,
          isTracker: r.isTracker,
          darkPatternIndicators: r.darkPatterns,
        })),
      };
      console.log(JSON.stringify(reportData, null, 2));
    } else {
      const report = generateReport(result, args.verbose);
      console.error(report);
      console.log(result.text);
    }

    process.exit(0);
  })().catch(err => {
    console.error(c.red(`Fatal error: ${err.message}`));
    process.exit(1);
  });
}
