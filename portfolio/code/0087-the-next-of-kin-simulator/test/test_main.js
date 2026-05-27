/**
 * test/test_main.js — Automated verification for The Next of Kin Simulator
 *
 * Verifies that all game modules load, core classes instantiate,
 * and the critical mechanical systems behave as designed.
 */

// ── Environment bootstrap ──────────────────────────
// The game expects a browser. We provide just enough DOM to survive.

const fs   = require('fs');
const path = require('path');

// Minimal browser shims
global.DOMException = class DOMException extends Error {};

class StubElement {
  constructor(tag) {
    this.tagName    = tag.toUpperCase();
    this.children   = [];
    this.style      = {};
    this.textContent = '';
    this.innerHTML  = '';
    this.className  = '';
    this.autofocus  = false;
    this.type       = '';
    this._listeners = {};
    this.parentNode = null;
  }
  appendChild(c)  { this.children.push(c); c.parentNode = this; return c; }
  removeChild(c)  { this.children = this.children.filter(x => x !== c); c.parentNode = null; return c; }
  replaceWith()   { /* no-op */ }
  remove()        { if (this.parentNode) this.parentNode.removeChild(this); }
  addEventListener(type, fn)    { (this._listeners[type] = this._listeners[type] || []).push(fn); }
  removeEventListener(type, fn) { if (this._listeners[type]) this._listeners[type] = this._listeners[type].filter(f => f !== fn); }
  querySelector(sel)    { return null; }
  querySelectorAll(sel) { return []; }
  setAttribute()  {}
  focus()         {}
}

class StubDocument {
  constructor() {
    this.body      = new StubElement('body');
    this.head      = new StubElement('head');
    this._elements = {};
  }
  createElement(tag)         { return new StubElement(tag); }
  getElementById(id)         {
    if (!this._elements[id]) this._elements[id] = new StubElement('div');
    return this._elements[id];
  }
  addEventListener()         {}
  removeEventListener()      {}
}

global.document = new StubDocument();
global.window   = { addEventListener() {}, removeEventListener() {}, DOMException: global.DOMException };
global.Date.now = Date.now;
global.Math     = Math;
global.requestAnimationFrame = (fn) => setTimeout(fn, 0);
global.clearTimeout = clearTimeout;

// ── Load game modules ──────────────────────────────

function loadModule(relPath) {
  const abs = path.join(__dirname, '..', relPath);
  const code = fs.readFileSync(abs, 'utf8');
  const fn = new Function('global', `with(global){${code}}`);
  fn(global);
}

loadModule('data.js');
loadModule('social-graph.js');
loadModule('game.js');

// ── Test harness ───────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, label) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(label);
    console.error(`  FAIL: ${label}`);
  }
}

function assertExists(val, label) {
  assert(val !== undefined && val !== null, label);
}

// ── Tests ──────────────────────────────────────────

console.log('\n\u2550'.repeat(54));
console.log('  The Next of Kin Simulator \u2014 test suite');
console.log('\u2550'.repeat(54) + '\n');

// ── 1. Data integrity ──────────────────────────────

console.log('\u2500\u2500 data.js \u2500\u2500');

assertExists(DECEASED, 'DECEASED is defined');
assert(DECEASED.name === 'Maya Chen', 'DECEASED.name is Maya Chen');
assert(typeof DECEASED.death === 'object', 'DECEASED.death exists');

assertExists(CONTACTS, 'CONTACTS is defined');
assert(typeof CONTACTS === 'object', 'CONTACTS is an object');

const contactIds = Object.keys(CONTACTS);
assert(contactIds.length === 9, `CONTACTS has 9 entries (got ${contactIds.length})`);

for (const [id, c] of Object.entries(CONTACTS)) {
  assert(typeof c.id === 'string',        `CONTACTS[${id}].id exists`);
  assert(typeof c.name === 'string',      `CONTACTS[${id}].name exists`);
  assert(typeof c.relation === 'string',  `CONTACTS[${id}].relation exists`);
  assert(typeof c.importance === 'number', `CONTACTS[${id}].importance is number`);
  assert(typeof c.fragility  === 'number', `CONTACTS[${id}].fragility is number`);
  assert(Array.isArray(c.knownEdges),     `CONTACTS[${id}].knownEdges is array`);
}

assertExists(TEXT_THREADS, 'TEXT_THREADS is defined');
for (const [id, thread] of Object.entries(TEXT_THREADS)) {
  assert(Array.isArray(thread.pages),  `TEXT_THREADS[${id}].pages is array`);
  assert(thread.pages.length > 0,      `TEXT_THREADS[${id}] has at least one page`);
  for (const page of thread.pages) {
    assert(Array.isArray(page.messages), `  page.messages is array`);
  }
}

assertExists(NOTIFICATION_RESPONSES, 'NOTIFICATION_RESPONSES is defined');
assertExists(GAME_CONFIG, 'GAME_CONFIG is defined');
assert(GAME_CONFIG.startingBattery > 0, 'startingBattery > 0');
assertExists(CASCADE_TIMING, 'CASCADE_TIMING is defined');

console.log('');

// ── 2. Social graph construction ───────────────────

console.log('\u2500\u2500 social-graph.js \u2014 construction \u2500\u2500');

const graph = new SocialGraph();

assertExists(graph, 'SocialGraph instance created');
assert(Object.keys(graph.nodes).length === contactIds.length,
  `graph.nodes has ${contactIds.length} entries`);

for (const id of contactIds) {
  assertExists(graph.nodes[id], `graph.nodes[${id}] exists`);
  assert(graph.nodes[id].id === id, `graph.nodes[${id}].id matches`);
}

assert(graph.edges.length > 0, `graph.edges has entries (${graph.edges.length})`);
assert(graph.hiddenEdges.length > 0, `graph.hiddenEdges has entries (${graph.hiddenEdges.length})`);

for (const [id, node] of Object.entries(graph.nodes)) {
  assert(node.notifiedAt === null, `graph.nodes[${id}].notifiedAt is null`);
  assert(node.alreadyKnows === false, `graph.nodes[${id}].alreadyKnows is false`);
}

console.log('');

// ── 3. Text thread reading / edge discovery ────────

console.log('\u2500\u2500 social-graph.js \u2014 thread reading \u2500\u2500');

const samReveals = graph.processThreadRead('sam', 1);
assert(samReveals.length >= 1, 'Reading Sam page 1 reveals at least one edge');

const mayaSamEdge = graph.hiddenEdges.find(e =>
  (e.source === 'maya' && e.target === 'sam') ||
  (e.source === 'sam'  && e.target === 'maya'));
assertExists(mayaSamEdge, 'maya-sam hidden edge exists');
if (mayaSamEdge) assert(mayaSamEdge.discovered === true, 'maya-sam edge is now discovered');

const elenaReveals = graph.processThreadRead('elena', 2);
const elenaSamEdge = graph.hiddenEdges.find(e =>
  e.source === 'elena' && e.target === 'sam');
if (elenaSamEdge) {
  assert(elenaSamEdge.discovered === true, 'elena-sam edge discovered after reading page 2');
}

console.log('');

// ── 4. Notification recording ──────────────────────

console.log('\u2500\u2500 social-graph.js \u2014 notification \u2500\u2500');

const aliceResponse = graph.recordNotification('alice', 'gentle', 60);
assert(Array.isArray(aliceResponse), 'recordNotification returns response array');
assert(aliceResponse.length > 0, 'alice response has lines');

const aliceNode = graph.nodes['alice'];
assert(aliceNode.alreadyKnows === true, 'alice.alreadyKnows is true');
assert(aliceNode.notifiedBy === 'player', 'alice.notifiedBy is player');
assert(aliceNode.notifiedAt === 60, 'alice.notifiedAt is 60');
assert(graph.notificationLog.length === 1, 'notificationLog has 1 entry');

console.log('');

// ── 5. Cascade system ──────────────────────────────

console.log('\u2500\u2500 social-graph.js \u2014 cascades \u2500\u2500');

const cascadeDef = CASCADE_TIMING['alice'];
assertExists(cascadeDef, 'alice cascade definition exists');
assert(cascadeDef.targets.includes('michael'), 'alice cascades to michael');
assert(cascadeDef.targets.includes('ruth'), 'alice cascades to ruth');

const cascades1 = graph.processCascades(60 + cascadeDef.delay + 1);
assert(Array.isArray(cascades1), 'processCascades returns array');

const cascadeKnowCount = Object.values(graph.nodes).filter(n => n.alreadyKnows).length;
assert(cascadeKnowCount >= 1, `At least 1 node knows after cascades (${cascadeKnowCount})`);

console.log('');

// ── 6. Damage tracking ─────────────────────────────

console.log('\u2500\u2500 social-graph.js \u2014 damage \u2500\u2500');

assert(graph.damageReport.length >= 0, 'damageReport exists');

const graph2 = new SocialGraph();
graph2.recordNotification('marcus', 'brief', 900 + 700);
assert(graph2.damageReport.length > 0, 'Late marcus notification generates damage');

console.log('');

// ── 7. Final report generation ─────────────────────

console.log('\u2500\u2500 social-graph.js \u2014 final report \u2500\u2500');

const report = graph.generateFinalReport();
assertExists(report.summary, 'report.summary exists');
assertExists(report.notificationOrder, 'report.notificationOrder exists');
assertExists(report.unnotified, 'report.unnotified exists');
assertExists(report.damageItems, 'report.damageItems exists');
assertExists(report.narrative, 'report.narrative exists');
assert(typeof report.damageScore === 'number', 'report.damageScore is number');
assert(Array.isArray(report.narrative), 'report.narrative is array');
assert(report.narrative.length > 0, 'report.narrative has content');

console.log('');

// ── 8. Graph reset ─────────────────────────────────

console.log('\u2500\u2500 social-graph.js \u2014 reset \u2500\u2500');

const graph3 = new SocialGraph();
graph3.recordNotification('alice', 'gentle', 30);
graph3.processThreadRead('sam', 1);
graph3.reset();

for (const [id, node] of Object.entries(graph3.nodes)) {
  assert(node.notifiedAt === null, `After reset, nodes[${id}].notifiedAt is null`);
  assert(node.alreadyKnows === false, `After reset, nodes[${id}].alreadyKnows is false`);
}
assert(graph3.notificationLog.length === 0, 'notificationLog cleared after reset');
assert(graph3.cascadeLog.length === 0, 'cascadeLog cleared after reset');

const undiscoveredHidden = graph3.hiddenEdges.filter(e => !e.discovered);
assert(undiscoveredHidden.length === graph3.hiddenEdges.length,
  'All hidden edges undiscovered after reset');

console.log('');

// ── 9. Game engine instantiation ───────────────────

console.log('\u2500\u2500 game.js \u2014 instantiation \u2500\u2500');

const game = new NextOfKinSimulator('terminal');
assertExists(game, 'NextOfKinSimulator instance created');
assert(game.battery === 31, `Starting battery is 31 (got ${game.battery})`);
assert(game.phase === 'boot', 'Starting phase is boot');
assertExists(game.graph, 'game.graph exists');
assert(game.graph instanceof SocialGraph, 'game.graph is SocialGraph instance');

console.log('');

// ── 10. Game handleInput routing ───────────────────

console.log('\u2500\u2500 game.js \u2014 input handling \u2500\u2500');

game.phase = 'discovery';

let statusOutput = '';
const origQueue = game._queueOutput.bind(game);
game._queueOutput = (t) => { statusOutput += t + '\n'; };
game._handleMainCommand('status');
assert(statusOutput.includes('Battery'), 'STATUS shows battery');
assert(statusOutput.includes('Elapsed'), 'STATUS shows elapsed time');
game._queueOutput = origQueue;

let helpOutput = '';
game._queueOutput = (t) => { helpOutput += t + '\n'; };
game._handleMainCommand('help');
assert(helpOutput.includes('CALL'), 'HELP mentions CALL');
assert(helpOutput.includes('CONTACTS'), 'HELP mentions CONTACTS');
game._queueOutput = origQueue;

let unknownOutput = '';
game._queueOutput = (t) => { unknownOutput += t + '\n'; };
game._handleMainCommand('xyzzy');
assert(unknownOutput.includes('Unknown'), 'Unknown command produces error message');
game._queueOutput = origQueue;

console.log('');

// ── 11. Battery death ──────────────────────────────

console.log('\u2500\u2500 game.js \u2014 battery death \u2500\u2500');

const game2 = new NextOfKinSimulator('terminal');
game2.phase = 'discovery';
game2.running = true;
game2.battery = 0.5;

game2._readContactThread('sam');
assert(game2.battery <= 0, 'Battery is <= 0 after draining read');

console.log('');

// ── 12. Contact list display ───────────────────────

console.log('\u2500\u2500 game.js \u2014 contact list \u2500\u2500');

const game3 = new NextOfKinSimulator('terminal');
game3.phase = 'discovery';

let contactOutput = '';
game3._queueOutput = (t) => { contactOutput += t + '\n'; };
game3._flushOutput = () => {};
game3._showContactList();

assert(contactOutput.includes('Alice Chen'), 'Contact list includes Alice');
assert(contactOutput.includes('Sam Rivera'), 'Contact list includes Sam');
assert(contactOutput.includes('Marcus Webb'), 'Contact list includes Marcus');
assert(contactOutput.includes('Po Po'), 'Contact list includes Po Po');

console.log('');

// ── 13. Notification option costs ──────────────────

console.log('\u2500\u2500 data.js \u2014 notification costs \u2500\u2500');

const briefCost  = GAME_CONFIG.batteryDrain.callConnect + GAME_CONFIG.batteryDrain.callBrief;
const gentleCost = GAME_CONFIG.batteryDrain.callConnect + GAME_CONFIG.batteryDrain.callGentle;
const fullCost   = GAME_CONFIG.batteryDrain.callConnect + GAME_CONFIG.batteryDrain.callFull;

assert(briefCost  > 0, `Brief call cost > 0 (${briefCost})`);
assert(gentleCost > briefCost, `Gentle cost > brief (${gentleCost} > ${briefCost})`);
assert(fullCost   > gentleCost, `Full cost > gentle (${fullCost} > ${gentleCost})`);

const maxBriefCalls = Math.floor(GAME_CONFIG.startingBattery / briefCost);
assert(maxBriefCalls >= GAME_CONFIG.maxNotificationsBeforeBatteryDeath - 1,
  `Can make at least ${GAME_CONFIG.maxNotificationsBeforeBatteryDeath - 1} brief calls`);

console.log('');

// ── 14. Relationship integrity ─────────────────────

console.log('\u2500\u2500 data.js \u2014 relationship integrity \u2500\u2500');

assert(CONTACTS.sam.importance >= 9, `Sam importance >= 9 (got ${CONTACTS.sam.importance})`);
assert(CONTACTS.sam.fragility  >= 9, `Sam fragility >= 9 (got ${CONTACTS.sam.fragility})`);
assert(CONTACTS.alice.importance >= 9, `Alice importance >= 9`);
assert(CONTACTS.ruth.fragility >= 9, `Ruth fragility >= 9`);
assert(CONTACTS.marcus.importance <= 6, `Marcus importance <= 6`);
assert(CONTACTS.elena.importance <= 5, `Elena importance <= 5`);

console.log('');

// ── 15. Cascade probability sanity ─────────────────

console.log('\u2500\u2500 data.js \u2014 cascade sanity \u2500\u2500');

for (const [source, def] of Object.entries(CASCADE_TIMING)) {
  assert(def.delay > 0, `cascade ${source} delay > 0`);
  assert(def.probability > 0, `cascade ${source} probability > 0`);
  assert(def.probability <= 1, `cascade ${source} probability <= 1`);
  assert(def.targets.length > 0, `cascade ${source} has targets`);
  for (const target of def.targets) {
    assertExists(CONTACTS[target], `cascade ${source} target ${target} exists in CONTACTS`);
  }
}

console.log('');

// ── 16. Helper functions ───────────────────────────

console.log('\u2500\u2500 data.js \u2014 helpers \u2500\u2500');

const aliceDisplay = getContactDisplay('alice');
assertExists(aliceDisplay, 'getContactDisplay(alice) returns value');
assert(aliceDisplay.name === 'Alice Chen', 'getContactDisplay returns correct name');

const samUnread = getUnreadCount('sam', {});
assert(samUnread > 0, `Sam has unread threads (${samUnread})`);

const samPartial = getUnreadCount('sam', { sam: 1 });
assert(samPartial < samUnread, 'Partial read reduces unread count');

console.log('');

// ── Results ────────────────────────────────────────

console.log('\u2550'.repeat(54));
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('\u2550'.repeat(54));

if (failures.length > 0) {
  console.error('\nFailed tests:');
  failures.forEach(f => console.error(`  \u2717 ${f}`));
  process.exit(1);
}

console.log('\n  All tests passed.\n');
process.exit(0);
