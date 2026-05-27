// keeper-sounds.js
// Synthesized sounds of the lighthouse keeper's presence.
// Each sound accepts a degradation parameter (0-1) that weakens,
// simplifies, and eventually silences the sound over the piece's duration.
//
// The degradation model:
//   0.0  — full presence, clear sounds
//   0.3  — slightly softer, slower, less distinct
//   0.6  — deteriorating: shuffles instead of steps, failed match strikes
//   0.8  — barely there: whispers, ghostly partial sounds
//   1.0  — silence (the keeper is gone)

export function createKeeperSounds(engine) {
  const sounds = {
    /**
     * Chair scrape: the keeper shifting weight.
     * Bandpass-filtered noise burst, slightly resonant,
     * evoking wood on stone floor.
     */
    chairScrape(degradation) {
      const ctx = engine.ctx;
      const now = ctx.currentTime;
      const duration = 0.25 + Math.random() * 0.15;

      const source = ctx.createBufferSource();
      source.buffer = engine.createNoiseBuffer(duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600 + Math.random() * 200;
      filter.Q.value = 3 + Math.random() * 2;

      const gain = ctx.createGain();
      const baseGain = 0.12 * (1 - degradation * 0.7);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(baseGain, now + 0.01);
      gain.gain.linearRampToValueAtTime(0, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(engine.masterGain);
      gain.connect(engine.reverbSend);

      source.start(now);
      source.stop(now + duration);
    },

    /**
     * Match strike: the keeper lighting a cigarette or candle.
     * High-frequency crackle burst. At high degradation,
     * the strike fails — very short, quiet, no sustain.
     */
    matchStrike(degradation) {
      const ctx = engine.ctx;
      const now = ctx.currentTime;
      const duration = 0.15 + Math.random() * 0.1;

      const source = ctx.createBufferSource();
      source.buffer = engine.createNoiseBuffer(duration);

      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.value = 3000 + degradation * 2000;

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 8000 - degradation * 4000;

      const gain = ctx.createGain();
      const vol = 0.08 * (1 - degradation * 0.8);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.005);

      if (degradation < 0.7) {
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      } else {
        // Failed strike: truncated, the phosphorus didn't catch
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.3);
      }

      source.connect(hpf);
      hpf.connect(lpf);
      lpf.connect(gain);
      gain.connect(engine.masterGain);

      source.start(now);
      source.stop(now + duration + 0.01);
    },

    /**
     * Page turn: the keeper reading.
     * Short noise burst with paper-like frequency profile.
     * Duration stretches with degradation — slower reading,
     * or perhaps the pages are harder to turn.
     */
    pageTurn(degradation) {
      const ctx = engine.ctx;
      const now = ctx.currentTime;
      const duration = (0.2 + Math.random() * 0.15) * (1 + degradation * 0.8);

      const source = ctx.createBufferSource();
      source.buffer = engine.createNoiseBuffer(duration);

      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 1800 + Math.random() * 400;
      bpf.Q.value = 1.5;

      const gain = ctx.createGain();
      const vol = 0.07 * (1 - degradation * 0.75);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.01);
      gain.gain.setValueAtTime(vol, now + duration * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      source.connect(bpf);
      bpf.connect(gain);
      gain.connect(engine.masterGain);

      source.start(now);
      source.stop(now + duration + 0.01);
    },

    /**
     * Footsteps: the keeper moving around the tower.
     * Low-frequency impulses in a pattern. At high degradation,
     * they become shuffles (softer, lower, slower).
     * Sends to reverb for spatial distance.
     */
    footsteps(degradation) {
      const ctx = engine.ctx;
      const now = ctx.currentTime;
      const count = 2 + Math.floor(Math.random() * 3);
      const interval = (0.4 + Math.random() * 0.2) * (1 + degradation * 0.6);

      for (let i = 0; i < count; i++) {
        const t = now + i * interval;
        const source = ctx.createBufferSource();
        source.buffer = engine.createNoiseBuffer(0.08);

        const lpf = ctx.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.value = 400 - degradation * 150;

        const gain = ctx.createGain();
        const vol = 0.1 * (1 - degradation * 0.8);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(vol, t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        source.connect(lpf);
        lpf.connect(gain);
        gain.connect(engine.masterGain);
        gain.connect(engine.reverbSend);

        source.start(t);
        source.stop(t + 0.1);
      }
    },

    /**
     * Murmur: the keeper talking to themselves.
     * A cluster of formant-filtered sawtooth oscillators,
     * mimicking the spectral shape of human voice without
     * being intelligible — just the music of speech.
     * At high degradation, barely a whisper.
     */
    murmur(degradation) {
      const ctx = engine.ctx;
      const now = ctx.currentTime;
      const duration = 0.6 + Math.random() * 0.5;

      const baseFreq = 120 + Math.random() * 40;
      const formants = [400, 700, 1100, 1500];
      const vol = 0.025 * (1 - degradation * 0.85);

      formants.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = baseFreq + (Math.random() - 0.5) * 10;

        const bpf = ctx.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = f + (Math.random() - 0.5) * 50;
        bpf.Q.value = 5;

        const gain = ctx.createGain();
        const g = vol * (idx < 2 ? 1 : 0.5);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(g, now + 0.1);
        gain.gain.setValueAtTime(g, now + duration - 0.15);
        gain.gain.linearRampToValueAtTime(0, now + duration);

        osc.connect(bpf);
        bpf.connect(gain);
        gain.connect(engine.masterGain);
        gain.connect(engine.reverbSend);

        osc.start(now);
        osc.stop(now + duration + 0.01);
      });
    },

    /**
     * Cleared throat: a response sound when the listener checks.
     * Short, intimate burst — the keeper acknowledging your presence.
     * This intimacy makes the eventual silence more visceral.
     */
    clearedThroat(degradation) {
      const ctx = engine.ctx;
      const now = ctx.currentTime;

      const source = ctx.createBufferSource();
      source.buffer = engine.createNoiseBuffer(0.12);

      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 300;
      bpf.Q.value = 2;

      const gain = ctx.createGain();
      const vol = 0.1 * (1 - degradation * 0.7);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.008);
      gain.gain.setValueAtTime(vol * 0.6, now + 0.03);
      gain.gain.linearRampToValueAtTime(vol, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      source.connect(bpf);
      bpf.connect(gain);
      gain.connect(engine.masterGain);
      gain.connect(engine.reverbSend);

      source.start(now);
      source.stop(now + 0.15);
    },

    /**
     * Play a random ambient keeper sound.
     * Used by the timeline to schedule keeper presence.
     */
    getRandom(degradation) {
      const fns = [
        this.chairScrape.bind(this),
        this.matchStrike.bind(this),
        this.pageTurn.bind(this),
        this.footsteps.bind(this),
        this.murmur.bind(this)
      ];
      const fn = fns[Math.floor(Math.random() * fns.length)];
      fn(degradation);
    },

    /**
     * Play a response sound when the listener checks on the keeper.
     * Returns true if a sound was played, false if silence.
     * The probability of silence increases with degradation —
     * the keeper is slipping away, and your checks accelerate it.
     */
    getResponse(degradation) {
      // Threshold checks: higher degradation = more likely to return nothing
      if (degradation > 0.92) return null;  // Almost certainly gone
      if (degradation > 0.8 && Math.random() < 0.5) return null;
      if (degradation > 0.6 && Math.random() < 0.2) return null;

      const responses = [
        this.footsteps.bind(this),
        this.clearedThroat.bind(this)
      ];
      const fn = responses[Math.floor(Math.random() * responses.length)];
      fn(degradation);
      return true;
    }
  };

  return sounds;
}
