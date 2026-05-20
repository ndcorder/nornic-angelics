// Last Call — four minutes synthesized from bar-closing physics.
// Tuned to harmonic series of A1 (55 Hz). No melody. Forensic register.
// Four movements: GATHERING, STACKING, SWEEPING, HUM ALONE.

const F = 55;

// ─── Glass harmonics ──────────────────────────────────────
// High partials (8, 10, 12). Sparse transients, thinning over movements.
// Movement 1: pulses every ~4 bars. Movement 2: sparser. Movements 3-4: one final ring, then silence.

const glass = s0 =>
  timeCat(
    // GATHERING (0-60s): regular chinking
    [60, stack(
      note("440").s("sine").decay(0.3).sustain(0).release(0.05)
        .struct("1 0 0 1 0 0 1 0").slow(8)
        .gain(0.18),
      note("550").s("sine").decay(0.25).sustain(0).release(0.04)
        .struct("1 0 0 0 0 0 1 0").slow(8)
        .gain(0.13),
      note("660").s("sine").decay(0.2).sustain(0).release(0.03)
        .struct("1 0 0 1 0 0 0 0").slow(8)
        .gain(0.10)
    )],
    // STACKING (60-120s): thinning out
    [60, stack(
      note("440").s("sine").decay(0.3).sustain(0).release(0.05)
        .struct("1 0 0 0 0 0 0 0").slow(4)
        .gain(0.14),
      note("550").s("sine").decay(0.25).sustain(0).release(0.04)
        .struct("1 0 0 0 0 0 0 0").slow(8)
        .gain(0.10),
      note("660").s("sine").decay(0.2).sustain(0).release(0.03)
        .struct("1 0 0 0 0 0 0 0").slow(8)
        .gain(0.07)
    )],
    // SWEEPING (120-180s): one last glass collected
    [60, stack(
      note("440").s("sine").decay(0.5).sustain(0).release(0.1)
        .struct("1 0 0 0 0 0 0 0").slow(60)
        .gain(0.12)
    )],
    // HUM ALONE (180-240s): nothing
    [60, silence()]
  );

// ─── Chair legs on wood ───────────────────────────────────
// Low ostinato (55 Hz) + bandpassed noise (scrape texture).
// Active during GATHERING and STACKING, fading through SWEEPING.

const chairs = s0 =>
  timeCat(
    // GATHERING (0-60s): full scrape rhythm
    [60, stack(
      note("55").s("sine").decay(0.4).sustain(0).release(0.08)
        .struct("1 0 0 1 0 0 1 0").slow(4)
        .gain(0.28),
      note("80").s("sawtooth").lpf(500).q(2)
        .decay(0.3).sustain(0).release(0.06)
        .struct("1 0 0 1 0 0 1 0").slow(4)
        .gain(0.14),
      note("120").s("square").lpf(700).q(3)
        .decay(0.2).sustain(0).release(0.04)
        .struct("1 0 0 1 0 0 1 0").slow(4)
        .gain(0.06)
    )],
    // STACKING (60-120s): same rhythm, slightly softer
    [60, stack(
      note("55").s("sine").decay(0.4).sustain(0).release(0.08)
        .struct("1 0 0 1 0 0 1 0").slow(4)
        .gain(0.24),
      note("80").s("sawtooth").lpf(500).q(2)
        .decay(0.3).sustain(0).release(0.06)
        .struct("1 0 0 1 0 0 1 0").slow(4)
        .gain(0.12),
      note("120").s("square").lpf(700).q(3)
        .decay(0.2).sustain(0).release(0.04)
        .struct("1 0 0 1 0 0 1 0").slow(4)
        .gain(0.05)
    )],
    // SWEEPING (120-180s): final few chairs, fading out
    [60, stack(
      note("55").s("sine").decay(0.5).sustain(0).release(0.1)
        .struct("1 0 0 0 0 0 0 0").slow(8)
        .gain("<0.20 0.14 0.09 0.04 0.02 0.01 0.003 0>"),
      note("80").s("sawtooth").lpf(500).q(2)
        .decay(0.3).sustain(0).release(0.06)
        .struct("1 0 0 0 0 0 0 0").slow(8)
        .gain("<0.10 0.07 0.04 0.02 0.01 0.003 0 0>")
    )],
    // HUM ALONE (180-240s): nothing
    [60, silence()]
  );

// ─── Footsteps ───────────────────────────────────────────
// Sole clicks on concrete. Present during first two movements.
// Irregular spacing to suggest person moving through space.

const footsteps = s0 =>
  timeCat(
    // GATHERING (0-60s): active
    [60,
      s("snare*2").gain(0.04).speed(0.8)
        .hp(8000).lp(12000)
        .struct("1 0 0 1 0 1 0 0").slow(4)
    ],
    // STACKING (60-120s): still present, sparser
    [60,
      s("snare*2").gain(0.03).speed(0.8)
        .hp(8000).lp(12000)
        .struct("1 0 0 0 0 1 0 0").slow(4)
    ],
    // SWEEPING + HUM ALONE (120-240s): gone
    [120, silence()]
  );

// ─── Deadbolt ─────────────────────────────────────────────
// Two metallic transients (E4 = 329.63 Hz). Once, around t=188s.
// Brief. Conclusive. The ritual ends.

const lock = s0 =>
  timeCat(
    [188, silence()],
    [2, stack(
      note("329.63").s("sine").decay(0.06).sustain(0).release(0.02)
        .struct("1 0 0 0 0 0 0 0").slow(2)
        .gain(0.40),
      note("329.63").s("sine").decay(0.05).sustain(0).release(0.02)
        .struct("0 0 1 0 0 0 0 0").slow(2)
        .gain(0.35),
      note("659.26").s("sawtooth").lpf(3000).q(0.5)
        .decay(0.4).sustain(0).release(0.1)
        .struct("1 0 0 0 0 0 0 0").slow(2)
        .gain(0.10)
    )],
    [50, silence()]
  );

// ─── Glass resonance ──────────────────────────────────────
// Sustained ring from an upturned glass. Dominant 7th partial (385 Hz).
// Appears in SWEEPING as the last glasses are collected.
// Uses repeated source with struct for reliable timing.

const glassResonance = s0 =>
  timeCat(
    [120, silence()],
    // SWEEPING (120-180s): two sustained rings, fading
    [60, stack(
      s("sine*4").note(385).gain(0.06)
        .decay(2).sustain(0).release(1)
        .struct("1 0 0 0").slow(16)
    )],
    [60, silence()]
  );

// ─── Refrigerator hum ─────────────────────────────────────
// A1 (55 Hz) + 3rd harmonic (165 Hz). Continuous drone.
// Alone for final 30 s, fading to silence.

const hum = s0 =>
  timeCat(
    // GATHERING through SWEEPING (0-180s): constant, modest level
    [180, stack(
      note("55").s("sine").sustain(1).gain(0.30),
      note("165").s("sine").sustain(1).gain(0.09)
    )],
    // HUM ALONE (180-210s): constant, still present
    [30, stack(
      note("55").s("sine").sustain(1).gain(0.30),
      note("165").s("sine").sustain(1).gain(0.09)
    )],
    // Final fade (210-240s): 8 steps of silence
    [30, stack(
      note("55").s("sine").sustain(1)
        .gain("<0.050 0.070 0.085 0.093 0.088 0.050 0.015 0>").slow(2),
      note("165").s("sine").sustain(1)
        .gain("<0.015 0.021 0.025 0.028 0.026 0.015 0.004 0>").slow(2)
    )]
  );

// ─── Assembly ─────────────────────────────────────────────
// All layers. No reverb. The room is empty.

$: {
  stack(
    hum(s0),
    chairs(s0),
    glass(s0),
    footsteps(s0),
    glassResonance(s0),
    lock(s0)
  )
}
