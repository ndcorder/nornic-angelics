#!/usr/bin/env node

const engine = require('./engine');

const input = process.argv.slice(2).join(' ').trim();

if (!input) {
  console.error('Usage: repudiate <what you believed>');
  console.error('');
  console.error('Feed it a name, a date, a promise. Or something vague.');
  console.error('The specificity of the repudiation matches the specificity of the input.');
  process.exit(1);
}

const result = engine.process(input);

// Typewriter effect — slower on forensic, faster on bureaucratic
const baseDelays = {
  bureaucratic: { char: 3, line: 80 },
  formal: { char: 8, line: 150 },
  forensic: { char: 15, line: 300 }
};

const delays = baseDelays[result.mode];

function typewrite(text) {
  const lines = text.split('\n');
  let lineIdx = 0;

  function printLine() {
    if (lineIdx >= lines.length) {
      process.exit(0);
    }

    const line = lines[lineIdx];
    let charIdx = 0;

    function printChar() {
      if (charIdx >= line.length) {
        process.stdout.write('\n');
        lineIdx++;
        setTimeout(printLine, delays.line);
        return;
      }

      process.stdout.write(line[charIdx]);
      charIdx++;

      // Slow down on punctuation — let the weight land
      const ch = line[charIdx - 1];
      let pause = delays.char;
      if (ch === '.' || ch === '\u2014') pause = delays.char * 8;
      else if (ch === ',') pause = delays.char * 3;
      else if (ch === ':') pause = delays.char * 4;

      setTimeout(printChar, pause);
    }

    printChar();
  }

  printLine();
}

typewrite(result.output);
