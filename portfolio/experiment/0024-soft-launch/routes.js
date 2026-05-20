/**
 * Route definitions for the Clarimond Biosystems archaeological dig.
 *
 * Each route is a frozen object with:
 *   path     – the hash-path the user types
 *   status   – HTTP status code
 *   statusText – human-readable status phrase
 *   headers  – simulated response headers (displayed to the user)
 *   body     – HTML string rendered inside the content frame.
 *              May include <meta> tags for progressive revelation.
 *   bodyRevisit – optional alternate body shown on second+ visit
 *   revealAfter – array of paths the user must have visited before
 *                 hidden text in this page's body is revealed.
 *   lockedBody – optional body shown when revealAfter requirements
 *                are NOT yet met.
 */

const ROUTES = Object.freeze([

  /* ──────────────────────────────────────────────────────────
   *  /about  ·  503 Service Unavailable
   *
   *  The public-facing about page, now "under maintenance."
   *  The maintenance language slips: "core mission" becomes past tense.
   *  Mention of "organisational restructuring" is corporate for "we're
   *  burying something." The hidden layer, revealed after visiting
   *  /products, reveals the timeline of the shutdown.
   * ────────────────────────────────────────────────────────── */
  {
    path: 'about',
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Server': 'nginx/1.18.0 (Ubuntu)',
      'Date': 'Fri, 14 Mar 2025 08:31:12 GMT',
      'Content-Type': 'text/html; charset=UTF-8',
      'Retry-After': '86400',
      'X-Powered-By': 'PHP/7.4.3',
    },
    body: `
      <div class="error-page">
        <div class="status-code">503</div>
        <div class="status-text">Service Unavailable</div>
        <div class="divider"></div>
        <div class="body-text">
          <p>The Clarimond Biosystems website is currently undergoing scheduled maintenance as part of our organisational restructuring.</p>

          <p>We apologise for the inconvenience. Our team is working to restore full service as quickly as possible. In the meantime, please direct all inquiries to our legal representation.</p>

          <p class="small faded">Clarimond Biosystems Inc.<br>Est. 2019 &mdash; dedicated to advancing next-generation gene therapies for pediatric neurological conditions.</p>

          <p class="small faded">This page was last updated: <span class="redacted">██████████</span></p>

          <div class="hidden" data-reveal-after="products">
            <hr class="fragment-hr">
            <p class="fragment-text">Site maintenance began 17 October 2024, coinciding with the voluntary suspension of all active clinical programmes. No timeline for restoration has been established. The original about page referenced "12 families participating in our pivotal trial" — this text was removed during the current maintenance period.</p>
          </div>

          <div class="hidden" data-reveal-after="team">
            <hr class="fragment-hr">
            <p class="fragment-text">Before restructuring, this page listed four co-founders. Current cached versions list three. The fourth co-founder's section was edited on 16 October 2024 at 23:47 UTC, seven hours before maintenance began.</p>
          </div>
        </div>
      </div>
    `,
  },

  /* ──────────────────────────────────────────────────────────
   *  /team  ·  410 Gone
   *
   *  The team page was deliberately removed, not temporarily
   *  unavailable. 410 means "it's gone and we're not bringing
   *  it back." The cached version visible in the response body
   *  has one name redacted — Dr. Lena Varin, the fourth
   *  co-founder who discovered the neural damage signal.
   * ────────────────────────────────────────────────────────── */
  {
    path: 'team',
    status: 410,
    statusText: 'Gone',
    headers: {
      'Server': 'nginx/1.18.0 (Ubuntu)',
      'Date': 'Fri, 14 Mar 2025 08:31:12 GMT',
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Note': 'This resource has been permanently removed.',
    },
    body: `
      <div class="error-page">
        <div class="status-code">410</div>
        <div class="status-text">Gone</div>
        <div class="divider"></div>
        <div class="body-text">
          <p>The requested resource <code>/team</code> is no longer available and has been permanently removed.</p>

          <p class="small">The following is preserved from Google's cached version, retrieved 15 October 2024:</p>

          <div class="cached-frame">
            <p class="cached-header">Cached snapshot — last indexed 14 Oct 2024 03:22 UTC</p>

            <p class="team-entry"><strong>Dr. Marcus Achebe</strong>, CEO &amp; Co-Founder<br><span class="small">Former VP of Clinical Development, Novartis Gene Therapies. PhD Molecular Biology, ETH Zürich.</span></p>

            <p class="team-entry"><strong>Dr. Renaud Claquin</strong>, CTO &amp; Co-Founder<br><span class="small">Principal Investigator, CRISPR Therapeutics. ScD Computational Biology, MIT.</span></p>

            <p class="team-entry"><strong>Dr. Yuki Saramoto</strong>, CMO &amp; Co-Founder<br><span class="small">Attending Pediatric Neurologist, UCSF Benioff Children's Hospital. MD PhD, University of Tokyo.</span></p>

            <p class="team-entry redacted-entry"><strong class="redacted">██████████████</strong>, <span class="redacted">██████████████</span> &amp; Co-Founder<br><span class="small"><span class="redacted">████████████████████████████████████████████████████████████████</span></span></p>

            <p class="small faded">Clarimond Biosystems was founded in 2019 by four leading researchers united by a shared vision: to develop safe, effective gene therapies for the most challenging pediatric neurological conditions.</p>
          </div>

          <div class="hidden" data-reveal-after="investors">
            <hr class="fragment-hr">
            <p class="fragment-text">The redacted co-founder's section was manually edited by user <code>m.achebe</code> on 16 October 2024 at 23:47 UTC. The edit replaced the name, title, and biography with Unicode block characters. The commit message was: <em>"updated per legal counsel recommendation re: personnel changes"</em>.</p>
          </div>
        </div>
      </div>
    `,
  },

  /* ──────────────────────────────────────────────────────────
   *  /products  ·  403 Forbidden
   *
   *  Active suppression. The product page still exists — the
   *  server acknowledges it — but access is denied. The
   *  403 body contains corporate-legal language about
   *  "discontinued programs" that can't help but leak
   *  details about what the product actually was.
   * ────────────────────────────────────────────────────────── */
  {
    path: 'products',
    status: 403,
    statusText: 'Forbidden',
    headers: {
      'Server': 'nginx/1.18.0 (Ubuntu)',
      'Date': 'Fri, 14 Mar 2025 08:31:12 GMT',
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
    },
    body: `
      <div class="error-page">
        <div class="status-code">403</div>
        <div class="status-text">Forbidden</div>
        <div class="divider"></div>
        <div class="body-text">
          <p>Access to this resource has been restricted pending the outcome of ongoing legal proceedings.</p>

          <p>Clarimond Biosystems has voluntarily suspended all clinical development programmes. No product information, trial data, or related materials are available for public dissemination at this time.</p>

          <p>In accordance with FDA guidance and in consultation with external legal counsel, we have restricted access to previously published information regarding:</p>

          <ul class="product-list">
            <li>CLB-101: AAV9-based gene therapy for <span class="redacted">██████████████████</span> in pediatric patients aged 6 months to 12 years</li>
            <li>CLB-101 Phase II/III trial protocol and endpoints</li>
            <li>Enrollment criteria and participant demographics</li>
            <li>Interim efficacy and safety data previously presented at <span class="redacted">██████████████</span> 2024</li>
          </ul>

          <p class="small faded">If you believe you have received this message in error, or if you are a member of the press seeking comment, please contact our legal department. Note: the /contact page has been decommissioned.</p>

          <div class="hidden" data-reveal-after="about">
            <hr class="fragment-hr">
            <p class="fragment-text">CLB-101 was an adeno-associated virus serotype 9 gene therapy targeting a rare pediatric neurodegenerative condition. The pivotal trial enrolled 12 patients between March 2023 and August 2024. Interim analysis was scheduled for November 2024. The programme was suspended in October 2024 — before interim analysis — following an internal report filed by a then-member of the executive team.</p>
          </div>

          <div class="hidden" data-reveal-after="press">
            <hr class="fragment-hr">
            <p class="fragment-text">The internal report, filed 15 October 2024, identified persistent aberrant transgene expression in dorsal root ganglia tissue across multiple participants. Clinical correlates included <span class="redacted irreversible">████████████████████████████</span> confirmed by electromyography. The report recommended immediate voluntary suspension and patient re-evaluation. It was authored by the co-founder whose name has been removed from this domain.</p>
          </div>
        </div>
      </div>
    `,
  },

  /* ──────────────────────────────────────────────────────────
   *  /investors  ·  301 Moved Permanently
   *
   *  A redirect — the investor page doesn't even bother
   *  with a 4xx. It just silently redirects to /about,
   *  which is itself a 503. The response body is minimal
   *  but the Location header tells the story: they're
   *  hiding the investor information. Hidden layer reveals
   *  the name of the lead VC.
   * ────────────────────────────────────────────────────────── */
  {
    path: 'investors',
    status: 301,
    statusText: 'Moved Permanently',
    headers: {
      'Server': 'nginx/1.18.0 (Ubuntu)',
      'Date': 'Fri, 14 Mar 2025 08:31:12 GMT',
      'Content-Type': 'text/html; charset=UTF-8',
      'Location': '/about',
    },
    body: `
      <div class="error-page">
        <div class="status-code">301</div>
        <div class="status-text">Moved Permanently</div>
        <div class="divider"></div>
        <div class="body-text">
          <p>The resource at <code>/investors</code> has been moved permanently to <code>/about</code>.</p>

          <p class="small">Investor relations inquiries should be directed to <span class="redacted">██████████████</span> at <span class="redacted">████████████████████████████</span>.</p>

          <div class="hidden" data-reveal-after="contact">
            <hr class="fragment-hr">
            <p class="fragment-text">Lead investor: Archimedes Health Ventures, Series B ($47M, March 2023). Archimedes managing partner Daniel Okafor joined the Clarimond board of directors on 12 April 2023 and remains a board member as of the last available public filing. The /investors page was redirected on 18 October 2024, one day after the board meeting at which the clinical hold was discussed.</p>
          </div>
        </div>
      </div>
    `,
  },

  /* ──────────────────────────────────────────────────────────
   *  /press  ·  451 Unavailable For Legal Reasons
   *
   *  The most explicit of the error codes: this content
   *  exists, it's being specifically withheld for legal
   *  reasons. The body references legal counsel and
   *  court orders without explaining why. Hidden layers
   *  reveal a specific publication and journalist.
   * ────────────────────────────────────────────────────────── */
  {
    path: 'press',
    status: 451,
    statusText: 'Unavailable For Legal Reasons',
    headers: {
      'Server': 'nginx/1.18.0 (Ubuntu)',
      'Date': 'Fri, 14 Mar 2025 08:31:12 GMT',
      'Content-Type': 'text/html; charset=UTF-8',
      'Link': '<https://www.clarimond.bio/legal>; rel="blocked-by"',
    },
    body: `
      <div class="error-page">
        <div class="status-code">451</div>
        <div class="status-text">Unavailable For Legal Reasons</div>
        <div class="divider"></div>
        <div class="body-text">
          <p>Access to this resource is unavailable due to a legal demand from government or court order.</p>

          <p>The Clarimond Biosystems press page has been removed following legal proceedings in the <span class="redacted">██████████████</span> jurisdiction. All press materials, media assets, and public statements issued prior to October 2024 are subject to a preservation and non-disclosure order.</p>

          <p>Members of the media seeking comment should contact external counsel:</p>

          <p class="small">
            <strong><span class="redacted">██████████████</span> &amp; Partners LLP</strong><br>
            Attn: <span class="redacted">██████████████</span><br>
            Reference: <em>Clarimond Biosystems Inc. v. <span class="redacted irreversible">██████████████</span></em>
          </p>

          <p class="small faded">Pursuant to Case No. <span class="redacted">████████████████████████████</span></p>

          <div class="hidden" data-reveal-after="investors">
            <hr class="fragment-hr">
            <p class="fragment-text">The legal filing references "Clarimond Biosystems Inc. v. Varin." Dr. Lena Varin was served with a cease-and-desist and temporary restraining order on 20 October 2024, preventing her from discussing "confidential trial data, internal communications, and proprietary research methodology" with any third party, including regulatory agencies. The order was granted ex parte. Dr. Varin was not represented at the hearing.</p>
          </div>

          <div class="hidden" data-reveal-after="products">
            <hr class="fragment-hr">
            <p class="fragment-text">On 2 November 2024, journalist Maren Kessler of the San Francisco Chronicle published an article titled "Gene Therapy Startup Suspends Trial After Co-Founder's Internal Report Raises Safety Concerns." The article was removed within 6 hours following a legal threat from Archimedes Health Ventures' counsel. Kessler's follow-up investigation, "The Erased Co-Founder," remains unpublished.</p>
          </div>
        </div>
      </div>
    `,
  },

  /* ──────────────────────────────────────────────────────────
   *  /contact  ·  404 Not Found
   *
   *  The contact department "never existed." But the 404
   *  body contradicts itself — it references a "former
   *  Patient Liaison office" that shouldn't exist if
   *  the department never existed. Hidden layers reveal
   *  a specific email subject line from a desperate parent.
   * ────────────────────────────────────────────────────────── */
  {
    path: 'contact',
    status: 404,
    statusText: 'Not Found',
    headers: {
      'Server': 'nginx/1.18.0 (Ubuntu)',
      'Date': 'Fri, 14 Mar 2025 08:31:12 GMT',
      'Content-Type': 'text/html; charset=UTF-8',
    },
    body: `
      <div class="error-page">
        <div class="status-code">404</div>
        <div class="status-text">Not Found</div>
        <div class="divider"></div>
        <div class="body-text">
          <p>The requested URL <code>/contact</code> was not found on this server.</p>

          <p>No public contact page has ever existed for Clarimond Biosystems. Patient, caregiver, and physician inquiries were historically managed through the Patient Liaison Office (active 2019&ndash;2024), which operated as a separate internal function and did not maintain a public-facing web presence.</p>

          <p class="small">For clinical trial inquiries related to the CLB-101 programme, please contact the FDA's Drug Safety division directly.</p>

          <div class="hidden" data-reveal-after="about">
            <hr class="fragment-hr">
            <p class="fragment-text">The Patient Liaison Office was staffed by two full-time employees and managed communications with the families of CLB-101 trial participants. It was closed on 21 October 2024. All staff were placed under NDA. The office's email server (liaison@clarimond.bio) returned bounce messages beginning 22 October 2024.</p>
          </div>

          <div class="hidden" data-reveal-after="team">
            <hr class="fragment-hr">
            <p class="fragment-text">The last email received by the Patient Liaison Office was sent on 19 October 2024 at 04:17 UTC from a parent's personal email address. The subject line was: <em>"Why is my daughter losing sensation in her fingers?"</em></p>
            <p class="fragment-text">It was never answered.</p>
          </div>
        </div>
      </div>
    `,
  },

  /* ──────────────────────────────────────────────────────────
   *  /varin  ·  200 OK  (gated)
   *
   *  The final page. If the user hasn't visited at least
   *  4 other pages, it returns 404. Once they have, it
   *  resolves to 200 OK with an empty body. Pure white.
   *  The one page they couldn't delete (because it was
   *  never published) and couldn't lie about (because
   *  there's nothing left to say).
   * ────────────────────────────────────────────────────────── */
  {
    path: 'varin',
    status: 200,
    statusText: 'OK',
    headers: {
      'Server': 'nginx/1.18.0 (Ubuntu)',
      'Date': 'Fri, 14 Mar 2025 08:31:12 GMT',
      'Content-Type': 'text/html; charset=UTF-8',
      'Content-Length': '0',
    },
    body: '<div class="varin-page"></div>',
    lockedStatus: 404,
    lockedStatusText: 'Not Found',
    lockedBody: `
      <div class="error-page">
        <div class="status-code">404</div>
        <div class="status-text">Not Found</div>
        <div class="divider"></div>
        <div class="body-text">
          <p>The requested URL <code>/varin</code> was not found on this server.</p>
          <p class="small faded">If you arrived here by following a link, it may have been outdated or incorrect.</p>
        </div>
      </div>
    `,
    requireVisited: 4,
  },

  /* ──────────────────────────────────────────────────────────
   *  Root  ·  503 Service Unavailable
   *
   *  The homepage is also down. Its body gives the first
   *  breadcrumb — mentioning the company name and a vague
   *  "restructuring" that invites the user to look deeper.
   * ────────────────────────────────────────────────────────── */
  {
    path: '',
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Server': 'nginx/1.18.0 (Ubuntu)',
      'Date': 'Fri, 14 Mar 2025 08:31:12 GMT',
      'Content-Type': 'text/html; charset=UTF-8',
      'Retry-After': '86400',
    },
    body: `
      <div class="error-page">
        <div class="status-code">503</div>
        <div class="status-text">Service Unavailable</div>
        <div class="divider"></div>
        <div class="body-text">
          <p>The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.</p>

          <hr class="subtle">

          <p class="small">Clarimond Biosystems is a clinical-stage biotechnology company developing next-generation gene therapies for pediatric neurological disorders.</p>

          <p class="small faded">Site under maintenance. Please direct inquiries to <span class="redacted">██████████████</span>.</p>
        </div>
      </div>
    `,
  },
]);

/**
 * Look up a route by its path string.
 * Returns the route object or null if no exact match.
 */
function findRoute(path) {
  // Normalise: strip leading slash and hash
  const normalised = path.replace(/^[/#]+/, '').replace(/[/]+$/, '');
  return ROUTES.find(r => r.path === normalised) || null;
}

/**
 * Return the "fallback" 404 route for any path not in the table.
 */
function fallback404(path) {
  return {
    path: path.replace(/^[/#]+/, ''),
    status: 404,
    statusText: 'Not Found',
    headers: {
      'Server': 'nginx/1.18.0 (Ubuntu)',
      'Date': new Date().toUTCString(),
      'Content-Type': 'text/html; charset=UTF-8',
    },
    body: `
      <div class="error-page">
        <div class="status-code">404</div>
        <div class="status-text">Not Found</div>
        <div class="divider"></div>
        <div class="body-text">
          <p>The requested URL <code>/${path.replace(/^[/#]+/, '')}</code> was not found on this server.</p>
          <p class="small faded">Available resources on this server are limited. The site is under maintenance.</p>
        </div>
      </div>
    `,
  };
}
