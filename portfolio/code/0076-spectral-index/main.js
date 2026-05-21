(function () {
  'use strict';

  /* ── Configuration ── */
  var SIM_SCALE = 4;
  var DECAY_BASE = 0.993;
  var GHOST_MAX = 6;
  var SPAWN_INTERVAL_MIN = 6000;
  var SPAWN_INTERVAL_MAX = 18000;
  var CURSOR_RADIUS = 12;
  var CURSOR_INTENSITY = 0.35;
  var TRAIL_RADIUS_BASE = 2.5;
  var TRAIL_INTENSITY_BASE = 0.06;
  var TRAIL_INTENSITY_SEATED = 0.035;
  var TRAIL_RADIUS_HANDPRINT = 5;
  var TRAIL_INTENSITY_HANDPRINT = 0.09;
  var WAYPOINT_PAUSE_MIN = 1500;
  var WAYPOINT_PAUSE_MAX = 5000;
  var GHOST_SPEED_BASE = 18;
  var GHOST_LIFETIME_MIN = 25000;
  var GHOST_LIFETIME_MAX = 70000;
  var MAX_HEAT = 2.5;
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Canvas & Buffers ── */
  var canvas = document.getElementById('heatCanvas');
  var ctx = canvas.getContext('2d', { alpha: false });
  var overlay = document.getElementById('overlay');

  var W, H, simW, simH;
  var heat;
  var offscreen, offCtx, imgData;

  var prevSimW = 0, prevSimH = 0;

  /* Scanline overlay — pre-built once, redrawn on resize */
  var scanlineCanvas = null;

  function buildScanlines() {
    scanlineCanvas = document.createElement('canvas');
    scanlineCanvas.width = W;
    scanlineCanvas.height = H;
    var slCtx = scanlineCanvas.getContext('2d');
    slCtx.fillStyle = '#000';
    slCtx.globalAlpha = REDUCED_MOTION ? 0 : 0.035;
    for (var y = 0; y < H; y += 3) {
      slCtx.fillRect(0, y, W, 1);
    }
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    simW = Math.ceil(W / SIM_SCALE);
    simH = Math.ceil(H / SIM_SCALE);

    var newHeat = new Float32Array(simW * simH);
    if (heat) {
      var copyW = Math.min(simW, prevSimW);
      var copyH = Math.min(simH, prevSimH);
      for (var cy = 0; cy < copyH; cy++) {
        for (var cx = 0; cx < copyW; cx++) {
          newHeat[cy * simW + cx] = heat[cy * prevSimW + cx];
        }
      }
    }
    heat = newHeat;
    prevSimW = simW;
    prevSimH = simH;

    offscreen = document.createElement('canvas');
    offscreen.width = simW;
    offscreen.height = simH;
    offCtx = offscreen.getContext('2d', { willReadFrequently: true });
    imgData = offCtx.createImageData(simW, simH);

    buildScanlines();
    buildFloorPlan();
  }

  /* ── Floor Plan (invisible structure for ghosts) ── */
  var rooms = [];
  var waypoints = [];
  var doorways = [];

  function buildFloorPlan() {
    rooms.length = 0;
    waypoints.length = 0;
    doorways.length = 0;

    var useLandscape = W > H;

    if (useLandscape) {
      var c1x = W * 0.32, c2x = W * 0.62;
      var r1y = H * 0.42, r2y = H * 0.72;

      rooms.push(
        { name: 'entry',    x: W * 0.05, y: H * 0.05, w: c1x - W * 0.05, h: r1y - H * 0.05, floorType: 'hard' },
        { name: 'kitchen',  x: c1x + 8,  y: H * 0.05, w: c2x - c1x - 16,  h: r1y - H * 0.05, floorType: 'tile' },
        { name: 'bathroom', x: c2x + 8,  y: H * 0.05, w: W * 0.95 - c2x - 8, h: r1y - H * 0.05, floorType: 'tile' },
        { name: 'living',   x: W * 0.05, y: r1y + 8,  w: c1x - W * 0.05, h: r2y - r1y - 16, floorType: 'carpet' },
        { name: 'bedroom',  x: c1x + 8,  y: r1y + 8,  w: c2x - c1x - 16,  h: r2y - r1y - 16, floorType: 'carpet' },
        { name: 'study',    x: c2x + 8,  y: r1y + 8,  w: W * 0.95 - c2x - 8, h: r2y - r1y - 16, floorType: 'hard' },
        { name: 'hallway',  x: W * 0.05, y: r2y + 8,  w: W * 0.90,          h: H * 0.95 - r2y - 8, floorType: 'hard' }
      );

      doorways = [
        { x: c1x, y: (H * 0.05 + r1y) / 2, w: 6, h: 30 },
        { x: c2x, y: (H * 0.05 + r1y) / 2, w: 6, h: 30 },
        { x: c1x, y: (r1y + 8 + r2y) / 2,  w: 6, h: 30 },
        { x: c2x, y: (r1y + 8 + r2y) / 2,  w: 6, h: 30 },
        { x: W * 0.40, y: r2y + 8, w: 30, h: 6 },
        { x: W * 0.70, y: r2y + 8, w: 30, h: 6 }
      ];
    } else {
      var c1y = H * 0.32, c2y = H * 0.62;
      var r1x = W * 0.42, r2x = W * 0.72;

      rooms.push(
        { name: 'entry',    x: W * 0.05, y: H * 0.05, w: r1x - W * 0.05, h: c1y - H * 0.05, floorType: 'hard' },
        { name: 'kitchen',  x: r1x + 8,  y: H * 0.05, w: r2x - r1x - 16,  h: c1y - H * 0.05, floorType: 'tile' },
        { name: 'living',   x: W * 0.05, y: c1y + 8,  w: r1x - W * 0.05, h: c2y - c1y - 16, floorType: 'carpet' },
        { name: 'bedroom',  x: r1x + 8,  y: c1y + 8,  w: r2x - r1x - 16,  h: c2y - c1y - 16, floorType: 'carpet' },
        { name: 'study',    x: r2x + 8,  y: H * 0.05, w: W * 0.95 - r2x - 8, h: c2y - H * 0.05, floorType: 'hard' },
        { name: 'bathroom', x: r2x + 8,  y: c2y + 8,  w: W * 0.95 - r2x - 8, h: H * 0.95 - c2y - 8, floorType: 'tile' },
        { name: 'hallway',  x: W * 0.05, y: c2y + 8,  w: r2x - W * 0.05,     h: H * 0.95 - c2y - 8, floorType: 'hard' }
      );

      doorways = [
        { x: r1x, y: (H * 0.05 + c1y) / 2, w: 30, h: 6 },
        { x: r2x, y: (H * 0.05 + c1y) / 2, w: 30, h: 6 },
        { x: r1x, y: (c1y + 8 + c2y) / 2,  w: 30, h: 6 },
        { x: W * 0.55, y: c2y + 8, w: 6, h: 30 }
      ];
    }

    /* Activity waypoints per room */
    for (var ri = 0; ri < rooms.length; ri++) {
      var room = rooms[ri];
      var rx = room.x, ry = room.y, rw = room.w, rh = room.h;
      var cx = rx + rw / 2, cy = ry + rh / 2;

      switch (room.name) {
        case 'kitchen':
          waypoints.push(
            { x: rx + rw * 0.2, y: ry + rh * 0.2, type: 'counter',  duration: 3000 },
            { x: rx + rw * 0.7, y: ry + rh * 0.3, type: 'counter',  duration: 2000 },
            { x: rx + rw * 0.5, y: ry + rh * 0.7, type: 'standing', duration: 1500 },
            { x: cx, y: cy, type: 'standing', duration: 1000 }
          );
          break;
        case 'bedroom':
          waypoints.push(
            { x: rx + rw * 0.25, y: ry + rh * 0.65, type: 'seated',  duration: 6000 },
            { x: rx + rw * 0.25, y: ry + rh * 0.4,  type: 'seated',  duration: 4000 },
            { x: rx + rw * 0.6,  y: ry + rh * 0.3,  type: 'standing', duration: 1200 },
            { x: rx + rw * 0.75, y: cy,              type: 'standing', duration: 1000 }
          );
          break;
        case 'living':
          waypoints.push(
            { x: rx + rw * 0.35, y: ry + rh * 0.5,  type: 'seated',  duration: 7000 },
            { x: rx + rw * 0.65, y: ry + rh * 0.5,  type: 'seated',  duration: 5000 },
            { x: rx + rw * 0.5,  y: ry + rh * 0.75, type: 'standing', duration: 1000 },
            { x: cx, y: cy, type: 'standing', duration: 1500 }
          );
          break;
        case 'bathroom':
          waypoints.push(
            { x: rx + rw * 0.3, y: ry + rh * 0.3, type: 'counter',  duration: 3000 },
            { x: rx + rw * 0.7, y: ry + rh * 0.5, type: 'standing', duration: 2000 },
            { x: cx, y: ry + rh * 0.7, type: 'standing', duration: 1500 }
          );
          break;
        case 'study':
          waypoints.push(
            { x: rx + rw * 0.5, y: ry + rh * 0.5, type: 'seated',  duration: 8000 },
            { x: rx + rw * 0.7, y: ry + rh * 0.3, type: 'counter',  duration: 2000 },
            { x: rx + rw * 0.3, y: ry + rh * 0.7, type: 'standing', duration: 1200 }
          );
          break;
        case 'entry':
          waypoints.push(
            { x: cx, y: cy, type: 'standing', duration: 1000 },
            { x: rx + rw * 0.3, y: ry + rh * 0.7, type: 'standing', duration: 800 }
          );
          break;
        case 'hallway':
          waypoints.push(
            { x: rx + rw * 0.25, y: cy, type: 'standing', duration: 500 },
            { x: rx + rw * 0.5,  y: cy, type: 'standing', duration: 500 },
            { x: rx + rw * 0.75, y: cy, type: 'standing', duration: 500 }
          );
          break;
      }
    }
  }

  /* ── Thermal Colormap ── */
  var COLORMAP = [
    { t: 0.00, r: 0,   g: 0,   b: 0   },
    { t: 0.05, r: 8,   g: 4,   b: 28  },
    { t: 0.12, r: 18,  g: 8,   b: 58  },
    { t: 0.20, r: 35,  g: 12,  b: 95  },
    { t: 0.28, r: 20,  g: 40,  b: 140 },
    { t: 0.36, r: 10,  g: 90,  b: 180 },
    { t: 0.44, r: 8,   g: 155, b: 170 },
    { t: 0.52, r: 30,  g: 200, b: 100 },
    { t: 0.60, r: 120, g: 220, b: 40  },
    { t: 0.68, r: 210, g: 210, b: 20  },
    { t: 0.76, r: 250, g: 160, b: 15  },
    { t: 0.84, r: 240, g: 80,  b: 10  },
    { t: 0.92, r: 220, g: 40,  b: 20  },
    { t: 1.00, r: 255, g: 240, b: 230 }
  ];

  /* Pre-build lookup table for fast color mapping */
  var LUT_SIZE = 1024;
  var colorLUT = new Uint32Array(LUT_SIZE + 1);

  function buildColorLUT() {
    for (var li = 0; li <= LUT_SIZE; li++) {
      var v = li / LUT_SIZE;
      var r, g, b;
      var i = 0;
      while (i < COLORMAP.length - 1 && COLORMAP[i + 1].t <= v) i++;
      if (i >= COLORMAP.length - 1) {
        var c = COLORMAP[COLORMAP.length - 1];
        r = c.r; g = c.g; b = c.b;
      } else {
        var a = COLORMAP[i], bn = COLORMAP[i + 1];
        var f = (v - a.t) / (bn.t - a.t);
        r = Math.round(a.r + (bn.r - a.r) * f);
        g = Math.round(a.g + (bn.g - a.g) * f);
        b = Math.round(a.b + (bn.b - a.b) * f);
      }
      colorLUT[li] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
  }

  buildColorLUT();

  /* ── Heat Buffer Operations ── */
  function addHeat(sx, sy, radius, intensity) {
    var r = Math.max(1, radius);
    var r2 = r * r;
    var x0 = Math.max(0, Math.floor(sx - r));
    var y0 = Math.max(0, Math.floor(sy - r));
    var x1 = Math.min(simW - 1, Math.ceil(sx + r));
    var y1 = Math.min(simH - 1, Math.ceil(sy + r));

    for (var hy = y0; hy <= y1; hy++) {
      for (var hx = x0; hx <= x1; hx++) {
        var dx = hx - sx, dy = hy - sy;
        var d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          var falloff = 1 - d2 / r2;
          var idx = hy * simW + hx;
          heat[idx] = Math.min(MAX_HEAT, heat[idx] + intensity * falloff);
        }
      }
    }
  }

  function decay(dt) {
    var f = Math.pow(DECAY_BASE, dt * 60);
    for (var i = 0, len = heat.length; i < len; i++) {
      heat[i] *= f;
      if (heat[i] < 0.001) heat[i] = 0;
    }
  }

  /* ── Ghost AI ── */
  var ghosts = [];
  var nextSpawnTime = 0;
  var time = 0;
  var lastTime = 0;

  function createGhost() {
    var spawnRoom = rooms[Math.floor(Math.random() * rooms.length)];
    var rx = spawnRoom.x, ry = spawnRoom.y, rw = spawnRoom.w, rh = spawnRoom.h;

    return {
      x: rx + rw * 0.15 + Math.random() * rw * 0.7,
      y: ry + rh * 0.15 + Math.random() * rh * 0.7,
      speed: GHOST_SPEED_BASE + (Math.random() - 0.5) * 8,
      targetWaypoint: null,
      targetPos: null,
      moving: false,
      paused: true,
      pauseTimeLeft: 500 + Math.random() * 1000,
      pauseRadius: TRAIL_RADIUS_BASE,
      pauseIntensity: TRAIL_INTENSITY_BASE,
      lifetime: GHOST_LIFETIME_MIN + Math.random() * (GHOST_LIFETIME_MAX - GHOST_LIFETIME_MIN),
      age: 0,
      warmup: 1500 + Math.random() * 2000,
      gaitPhase: Math.random() * Math.PI * 2,
      warmthMultiplier: 0
    };
  }

  function findRoom(px, py) {
    for (var i = 0; i < rooms.length; i++) {
      var room = rooms[i];
      if (px >= room.x && px <= room.x + room.w && py >= room.y && py <= room.y + room.h) {
        return room;
      }
    }
    return null;
  }

  function getWaypointsInRoom(room) {
    var result = [];
    for (var i = 0; i < waypoints.length; i++) {
      var wp = waypoints[i];
      if (wp.x >= room.x && wp.x <= room.x + room.w && wp.y >= room.y && wp.y <= room.y + room.h) {
        result.push(wp);
      }
    }
    return result;
  }

  function pickNextTarget(ghost) {
    var room = findRoom(ghost.x, ghost.y);

    /* 25% chance to move toward a doorway — room transition */
    if (room && Math.random() < 0.25) {
      for (var di = 0; di < doorways.length; di++) {
        var dw = doorways[di];
        var dwCx = dw.x + dw.w / 2, dwCy = dw.y + dw.h / 2;
        var dist = Math.hypot(dwCx - ghost.x, dwCy - ghost.y);
        if (dist < Math.max(room.w, room.h) * 0.8 && dist > 20) {
          ghost.targetPos = {
            x: dwCx + (Math.random() - 0.5) * dw.w,
            y: dwCy + (Math.random() - 0.5) * dw.h
          };
          ghost.moving = true;
          ghost.paused = false;
          return;
        }
      }
    }

    /* Pick a waypoint in current or random room */
    var targetRoom = room;
    if (!targetRoom) targetRoom = rooms[Math.floor(Math.random() * rooms.length)];

    var wps = getWaypointsInRoom(targetRoom);
    if (wps.length > 0 && Math.random() < 0.7) {
      var wp = wps[Math.floor(Math.random() * wps.length)];
      ghost.targetWaypoint = wp;
      ghost.targetPos = {
        x: wp.x + (Math.random() - 0.5) * 10,
        y: wp.y + (Math.random() - 0.5) * 10
      };
    } else {
      ghost.targetPos = {
        x: targetRoom.x + targetRoom.w * 0.1 + Math.random() * targetRoom.w * 0.8,
        y: targetRoom.y + targetRoom.h * 0.1 + Math.random() * targetRoom.h * 0.8
      };
      ghost.targetWaypoint = null;
    }
    ghost.moving = true;
    ghost.paused = false;
  }

  function updateGhost(ghost, dt) {
    ghost.age += dt * 1000;

    /* Warmup: ghost materializes slowly, depositing faint heat */
    if (ghost.warmup > 0) {
      ghost.warmthMultiplier = Math.min(1, ghost.warmthMultiplier + dt * 0.5);
      if (ghost.age < 1500) {
        addHeat(
          ghost.x / SIM_SCALE, ghost.y / SIM_SCALE,
          TRAIL_RADIUS_BASE * 0.5,
          TRAIL_INTENSITY_BASE * 0.15 * ghost.warmthMultiplier
        );
        return;
      }
      ghost.warmup = 0;
      pickNextTarget(ghost);
      return;
    }

    ghost.warmthMultiplier = Math.min(1, ghost.warmthMultiplier + dt * 0.8);

    /* Fade out near end of life */
    var remaining = ghost.lifetime - ghost.age;
    if (remaining < 3000) {
      ghost.warmthMultiplier = Math.max(0, remaining / 3000);
    }

    if (ghost.moving && ghost.targetPos) {
      var dx = ghost.targetPos.x - ghost.x;
      var dy = ghost.targetPos.y - ghost.y;
      var dist = Math.hypot(dx, dy);

      if (dist < 5) {
        /* Arrived at target */
        ghost.moving = false;
        ghost.paused = true;

        if (ghost.targetWaypoint) {
          var wp = ghost.targetWaypoint;
          ghost.pauseTimeLeft = wp.duration * (0.7 + Math.random() * 0.6);
          ghost.gaitPhase = 0;

          switch (wp.type) {
            case 'seated':
              ghost.pauseRadius = TRAIL_RADIUS_HANDPRINT;
              ghost.pauseIntensity = TRAIL_INTENSITY_SEATED;
              break;
            case 'counter':
              ghost.pauseRadius = TRAIL_RADIUS_HANDPRINT;
              ghost.pauseIntensity = TRAIL_INTENSITY_HANDPRINT;
              break;
            default:
              ghost.pauseRadius = TRAIL_RADIUS_BASE;
              ghost.pauseIntensity = TRAIL_INTENSITY_BASE * 0.7;
          }
        } else {
          ghost.pauseTimeLeft = WAYPOINT_PAUSE_MIN + Math.random() * (WAYPOINT_PAUSE_MAX - WAYPOINT_PAUSE_MIN);
          ghost.pauseRadius = TRAIL_RADIUS_BASE;
          ghost.pauseIntensity = TRAIL_INTENSITY_BASE * 0.6;
        }
        ghost.targetWaypoint = null;
      } else {
        /* Walk toward target */
        var step = Math.min(ghost.speed * dt, dist);
        var nx = dx / dist, ny = dy / dist;
        ghost.x += nx * step;
        ghost.y += ny * step;

        /* Walking trail with gait rhythm */
        var gait = 0.6 + 0.4 * Math.abs(Math.sin(ghost.gaitPhase));
        ghost.gaitPhase += dt * 8;
        addHeat(
          ghost.x / SIM_SCALE, ghost.y / SIM_SCALE,
          TRAIL_RADIUS_BASE * gait,
          TRAIL_INTENSITY_BASE * gait * ghost.warmthMultiplier
        );

        /* Occasional heavier footprint */
        if (Math.random() < 0.08) {
          addHeat(
            ghost.x / SIM_SCALE, ghost.y / SIM_SCALE,
            TRAIL_RADIUS_BASE * 1.3,
            TRAIL_INTENSITY_BASE * 1.5 * ghost.warmthMultiplier
          );
        }
      }
    } else if (ghost.paused) {
      ghost.pauseTimeLeft -= dt * 1000;

      /* Ambient presence while still — body heat radiating */
      addHeat(
        ghost.x / SIM_SCALE, ghost.y / SIM_SCALE,
        ghost.pauseRadius,
        ghost.pauseIntensity * dt * 2 * ghost.warmthMultiplier
      );

      /* Breathing oscillation — subtle warmth shift */
      var bx = ghost.x + Math.sin(time * 0.5 + ghost.gaitPhase) * 3;
      var by = ghost.y + Math.cos(time * 0.7 + ghost.gaitPhase) * 2;
      addHeat(
        bx / SIM_SCALE, by / SIM_SCALE,
        ghost.pauseRadius * 0.6,
        ghost.pauseIntensity * dt * ghost.warmthMultiplier
      );

      if (ghost.pauseTimeLeft <= 0) {
        pickNextTarget(ghost);
      }
    }
  }

  function spawnGhosts(dt) {
    nextSpawnTime -= dt * 1000;

    if (nextSpawnTime <= 0 && ghosts.length < GHOST_MAX) {
      ghosts.push(createGhost());
      nextSpawnTime = SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);
    }

    /* Remove expired ghosts */
    for (var i = ghosts.length - 1; i >= 0; i--) {
      if (ghosts[i].age > ghosts[i].lifetime) {
        ghosts.splice(i, 1);
      }
    }
  }

  /* ── Mouse / Touch Tracking ── */
  var mouseX = -1000, mouseY = -1000;
  var mouseActive = false;
  var prevMouseX = -1000, prevMouseY = -1000;

  function onPointerMove(px, py) {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = px;
    mouseY = py;
    mouseActive = true;
  }

  canvas.addEventListener('mousemove', function (e) {
    onPointerMove(e.clientX, e.clientY);
  });

  canvas.addEventListener('mouseleave', function () {
    mouseActive = false;
    mouseX = -1000;
    mouseY = -1000;
  });

  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    var t = e.touches[0];
    onPointerMove(t.clientX, t.clientY);
  }, { passive: false });

  canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var t = e.touches[0];
    onPointerMove(t.clientX, t.clientY);
  }, { passive: false });

  canvas.addEventListener('touchend', function () {
    mouseActive = false;
    mouseX = -1000;
    mouseY = -1000;
  });

  function applyCursorHeat() {
    if (!mouseActive) return;

    var sx = mouseX / SIM_SCALE;
    var sy = mouseY / SIM_SCALE;
    addHeat(sx, sy, CURSOR_RADIUS, CURSOR_INTENSITY);

    /* Interpolate between previous and current position for continuous strokes */
    if (prevMouseX > -500) {
      var psx = prevMouseX / SIM_SCALE;
      var psy = prevMouseY / SIM_SCALE;
      var dist = Math.hypot(sx - psx, sy - psy);
      if (dist > 1 && dist < 50) {
        var steps = Math.ceil(dist);
        for (var i = 1; i < steps; i++) {
          var t = i / steps;
          addHeat(
            psx + (sx - psx) * t,
            psy + (sy - psy) * t,
            CURSOR_RADIUS * 0.8,
            CURSOR_INTENSITY * 0.7
          );
        }
      }
    }
  }

  /* ── Rendering ── */
  function render() {
    var data = imgData.data;
    var buf32 = new Uint32Array(data.buffer);
    var len = simW * simH;

    for (var i = 0; i < len; i++) {
      var v = heat[i];
      if (v <= 0.001) {
        buf32[i] = 0xFF000000;
      } else {
        var clamped = Math.min(v, 1);
        buf32[i] = colorLUT[Math.round(clamped * LUT_SIZE)];
      }
    }

    offCtx.putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(offscreen, 0, 0, W, H);

    /* Scanline overlay for thermal-camera texture */
    if (scanlineCanvas) {
      ctx.drawImage(scanlineCanvas, 0, 0);
    }
  }

  /* ── Main Loop ── */
  var started = false;

  function loop(timestamp) {
    if (!started) {
      lastTime = timestamp;
      started = true;
      nextSpawnTime = 2000;
      requestAnimationFrame(loop);
      return;
    }

    var dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    time += dt;

    spawnGhosts(dt);

    for (var gi = 0; gi < ghosts.length; gi++) {
      updateGhost(ghosts[gi], dt);
    }

    applyCursorHeat();
    decay(dt);
    render();

    requestAnimationFrame(loop);
  }

  /* ── Initialization ── */
  function init() {
    resize();

    /* Fade instruction text after 6 seconds */
    setTimeout(function () {
      overlay.classList.add('fade-out');
    }, 6000);

    /* First ghost appears after a short delay */
    nextSpawnTime = 3000 + Math.random() * 4000;

    /* Seed residual heat — traces of previous occupants */
    for (var i = 0; i < 12; i++) {
      var wp = waypoints[Math.floor(Math.random() * waypoints.length)];
      if (wp) {
        var intensity = 0.04 + Math.random() * 0.08;
        var radius = 3 + Math.random() * 7;
        addHeat(wp.x / SIM_SCALE, wp.y / SIM_SCALE, radius, intensity);
      }
    }

    /* Seed a few faint trails connecting waypoints — old walking paths */
    for (var j = 0; j < 3; j++) {
      var wp1 = waypoints[Math.floor(Math.random() * waypoints.length)];
      var wp2 = waypoints[Math.floor(Math.random() * waypoints.length)];
      if (wp1 && wp2) {
        var trailDist = Math.hypot(wp2.x - wp1.x, wp2.y - wp1.y);
        if (trailDist > 30 && trailDist < 300) {
          var trailSteps = Math.floor(trailDist / 8);
          for (var s = 0; s < trailSteps; s++) {
            var t = s / trailSteps;
            var px = (wp1.x + (wp2.x - wp1.x) * t) / SIM_SCALE;
            var py = (wp1.y + (wp2.y - wp1.y) * t) / SIM_SCALE;
            addHeat(px, py, 1.5, 0.015 + Math.random() * 0.015);
          }
        }
      }
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
})();
