// audio-engine.js
// Web Audio API core: context, gain staging, reverb, utility functions
// Depends on a global `audioEngine` pattern for simplicity in this composition.

export function createAudioEngine() {
  const engine = {
    ctx: null,
    masterGain: null,
    reverbSend: null,
    reverbDelay: null,
    reverbFilter: null,
    reverbFeedback: null,

    init() {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.7;

      // Reverb send for keeper sounds — gives them spatial distance
      this.reverbSend = this.ctx.createGain();
      this.reverbSend.gain.value = 0.3;
      this.reverbSend.connect(this.masterGain);

      // Simple reverb via delay feedback network
      this.reverbDelay = this.ctx.createDelay(0.5);
      this.reverbDelay.delayTime.value = 0.12;

      this.reverbFilter = this.ctx.createBiquadFilter();
      this.reverbFilter.type = 'lowpass';
      this.reverbFilter.frequency.value = 1200;

      this.reverbFeedback = this.ctx.createGain();
      this.reverbFeedback.gain.value = 0.35;

      // Wire: send -> delay -> filter -> feedback -> delay (loop)
      //                   filter -> master (wet output)
      this.reverbSend.connect(this.reverbDelay);
      this.reverbDelay.connect(this.reverbFilter);
      this.reverbFilter.connect(this.reverbFeedback);
      this.reverbFeedback.connect(this.reverbDelay);
      this.reverbFilter.connect(this.masterGain);

      this.masterGain.connect(this.ctx.destination);
    },

    get currentTime() {
      return this.ctx ? this.ctx.currentTime : 0;
    },

    /**
     * Schedule a callback at a future AudioContext time.
     * Uses setTimeout for reliability — Web Audio scheduling
     * doesn't have a native callback mechanism for arbitrary code.
     */
    schedule(time, fn) {
      const delay = Math.max(0, (time - this.ctx.currentTime) * 1000);
      setTimeout(fn, delay);
    },

    /**
     * Create a white noise buffer of given duration.
     * Cached buffers could be used, but the keeper sounds
     * are short enough that regeneration is negligible.
     */
    createNoiseBuffer(duration) {
      const sr = this.ctx.sampleRate;
      const len = Math.max(1, Math.floor(sr * duration));
      const buffer = this.ctx.createBuffer(1, len, sr);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    },

    /**
     * Resume the AudioContext if suspended (browser autoplay policy).
     */
    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }
  };

  return engine;
}

/**
 * Light pulse sound: the automated lighthouse rotation.
 * A sweeping oscillator from 220Hz down to 55Hz over ~3.5 seconds,
 * with a harmonic layer and a sub-bass pulse.
 * Designed to feel mechanical, inevitable, larger than human scale.
 */
export function createLightPulse(engine) {
  return {
    play() {
      const ctx = engine.ctx;
      const now = ctx.currentTime;

      // Primary sweep — the rotation's tonal core
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 3.5);

      // Upper harmonic — adds metallic edge
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(330, now);
      osc2.frequency.exponentialRampToValueAtTime(82, now + 3.5);

      // Sub pulse — felt more than heard, the mechanism's weight
      const oscSub = ctx.createOscillator();
      oscSub.type = 'sine';
      oscSub.frequency.value = 40;

      // Envelopes: slow attack (light takes time to sweep), long tail
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.06, now + 0.8);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

      const gainSub = ctx.createGain();
      gainSub.gain.setValueAtTime(0.001, now);
      gainSub.gain.linearRampToValueAtTime(0.08, now + 0.5);
      gainSub.gain.exponentialRampToValueAtTime(0.001, now + 2);

      // Connect all oscillators
      osc.connect(gain);
      osc2.connect(gain2);
      oscSub.connect(gainSub);
      gain.connect(engine.masterGain);
      gain2.connect(engine.masterGain);
      gainSub.connect(engine.masterGain);

      osc.start(now);
      osc2.start(now);
      oscSub.start(now);
      osc.stop(now + 4);
      osc2.stop(now + 4);
      oscSub.stop(now + 3);
    }
  };
}
