/* 睁眼看世界 · 正交投影地球
   依赖 assets/land.js 中的陆地轮廓（Natural Earth 1:50m，经简化，无国界）。
   纯 Canvas 2D，无第三方库。 */
(() => {
  'use strict';
  const D2R = Math.PI / 180;
  const LAND = window.__LAND;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const INK = '242, 235, 218';
  const BRASS = '198, 152, 82';
  const SEA = '118, 172, 186';

  // 航线：仅作视觉示意，对应站内虚构情景
  const ROUTES = [
    { pts: [[121.5, 31.2], [103.8, 1.3], [32.5, 30.0], [4.5, 51.9]], lit: 0.0 },
    { pts: [[121.5, 31.2], [139.7, 35.6], [-118.2, 33.7]], lit: 0.35 }
  ];

  function project(lon, lat, lon0, lat0) {
    const l = (lon - lon0) * D2R, p = lat * D2R, p0 = lat0 * D2R;
    const cp = Math.cos(p), cl = Math.cos(l);
    return {
      x: cp * Math.sin(l),
      y: Math.cos(p0) * Math.sin(p) - Math.sin(p0) * cp * cl,
      z: Math.sin(p0) * Math.sin(p) + Math.cos(p0) * cp * cl
    };
  }

  function vec(lon, lat) {
    const p = lat * D2R, l = lon * D2R;
    return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
  }
  function slerp(a, b, t) {
    const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const th = Math.acos(dot);
    if (th < 1e-4) return a.slice();
    const s = Math.sin(th), k1 = Math.sin((1 - t) * th) / s, k2 = Math.sin(t * th) / s;
    return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
  }

  function init(canvas) {
    const ctx = canvas.getContext('2d');
    const readout = document.querySelector('[data-globe-coord]');
    const state = { lon: 108, lat: 24, auto: !reduced, drag: false, v: 0, w: 0, h: 0, dpr: 1, R: 0, cx: 0, cy: 0, target: null };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = rect.width; state.h = rect.height;
      canvas.width = Math.round(rect.width * state.dpr);
      canvas.height = Math.round(rect.height * state.dpr);
      state.R = Math.min(state.w, state.h) * 0.415;
      state.cx = state.w / 2; state.cy = state.h / 2;
      draw();
    }

    function ringPath(pts, lon0, lat0, R, cx, cy, clamp) {
      ctx.beginPath();
      let any = false, pen = false;
      for (let i = 0; i < pts.length; i += 2) {
        const p = project(pts[i], pts[i + 1], lon0, lat0);
        let { x, y, z } = p;
        if (z <= 0) {
          if (!clamp) { pen = false; continue; }
          const m = Math.hypot(x, y) || 1;
          x *= 1 / m; y *= 1 / m; z = 0;
        } else any = true;
        const sx = cx + x * R, sy = cy - y * R;
        if (!pen) { ctx.moveTo(sx, sy); pen = true; } else ctx.lineTo(sx, sy);
      }
      return any;
    }

    function draw() {
      const { w, h, dpr, R, cx, cy } = state;
      if (!w) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!LAND) return;
      const lon0 = state.lon, lat0 = state.lat;

      // 大气
      const halo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.22);
      halo.addColorStop(0, `rgba(${SEA}, .18)`);
      halo.addColorStop(0.45, `rgba(${SEA}, .05)`);
      halo.addColorStop(1, `rgba(${SEA}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2); ctx.fill();

      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

      // 海洋
      const sea = ctx.createLinearGradient(cx - R * 0.8, cy - R * 0.9, cx + R * 0.7, cy + R);
      sea.addColorStop(0, '#123039');
      sea.addColorStop(0.42, '#0a1c24');
      sea.addColorStop(1, '#040a0d');
      ctx.fillStyle = sea;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // 经纬网
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${INK}, .13)`;
      for (let lon = -180; lon < 180; lon += 15) {
        ctx.beginPath();
        let pen = false;
        for (let lat = -90; lat <= 90; lat += 3) {
          const p = project(lon, lat, lon0, lat0);
          if (p.z <= 0.002) { pen = false; continue; }
          const sx = cx + p.x * R, sy = cy - p.y * R;
          if (pen) ctx.lineTo(sx, sy); else { ctx.moveTo(sx, sy); pen = true; }
        }
        ctx.stroke();
      }
      for (let lat = -75; lat <= 75; lat += 15) {
        ctx.beginPath();
        let pen = false;
        for (let lon = -180; lon <= 180; lon += 3) {
          const p = project(lon, lat, lon0, lat0);
          if (p.z <= 0.002) { pen = false; continue; }
          const sx = cx + p.x * R, sy = cy - p.y * R;
          if (pen) ctx.lineTo(sx, sy); else { ctx.moveTo(sx, sy); pen = true; }
        }
        ctx.stroke();
      }
      // 赤道
      ctx.strokeStyle = `rgba(${BRASS}, .35)`;
      ctx.beginPath();
      let pen = false;
      for (let lon = -180; lon <= 180; lon += 2) {
        const p = project(lon, 0, lon0, lat0);
        if (p.z <= 0.002) { pen = false; continue; }
        const sx = cx + p.x * R, sy = cy - p.y * R;
        if (pen) ctx.lineTo(sx, sy); else { ctx.moveTo(sx, sy); pen = true; }
      }
      ctx.stroke();

      // 陆地
      ctx.fillStyle = `rgba(214, 195, 160, .38)`;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(236, 222, 196, .1)`;
      ctx.lineWidth = 3;
      for (const poly of LAND) {
        for (const ring of poly) {
          if (!ringPath(ring, lon0, lat0, R, cx, cy, true)) continue;
          ctx.stroke();
        }
      }
      ctx.strokeStyle = `rgba(244, 236, 218, .95)`;
      ctx.lineWidth = 1.15;
      for (const poly of LAND) {
        for (const ring of poly) {
          if (!ringPath(ring, lon0, lat0, R, cx, cy, true)) continue;
          ctx.fill();
          ctx.stroke();
        }
      }

      // 光照：左上受光
      const light = ctx.createRadialGradient(cx - R * 0.45, cy - R * 0.5, R * 0.05, cx - R * 0.25, cy - R * 0.3, R * 1.5);
      light.addColorStop(0, 'rgba(255, 246, 226, .16)');
      light.addColorStop(0.45, 'rgba(255, 246, 226, .03)');
      light.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = light;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // 晨昏线
      const night = ctx.createRadialGradient(cx - R * 0.6, cy - R * 0.62, R * 0.35, cx + R * 0.35, cy + R * 0.4, R * 1.55);
      night.addColorStop(0, 'rgba(2, 5, 8, 0)');
      night.addColorStop(0.6, 'rgba(2, 5, 8, .16)');
      night.addColorStop(1, 'rgba(2, 5, 8, .72)');
      ctx.fillStyle = night;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // 航线
      for (const route of ROUTES) {
        ctx.save();
        ctx.setLineDash([2, 6]);
        ctx.lineDashOffset = route.lit || 0;
        ctx.strokeStyle = `rgba(${BRASS}, .78)`;
        ctx.lineWidth = 1.2;
        for (let i = 0; i < route.pts.length - 1; i++) {
          const a = vec(...route.pts[i]), b = vec(...route.pts[i + 1]);
          ctx.beginPath();
          let pen = false;
          for (let t = 0; t <= 1.0001; t += 0.02) {
            const v = slerp(a, b, t);
            const lift = 1 + 0.05 * Math.sin(Math.PI * t);
            const lat = Math.asin(v[2]) / D2R, lon = Math.atan2(v[1], v[0]) / D2R;
            const p = project(lon, lat, lon0, lat0);
            if (p.z <= 0.02) { pen = false; continue; }
            const sx = cx + p.x * R * lift, sy = cy - p.y * R * lift;
            if (pen) ctx.lineTo(sx, sy); else { ctx.moveTo(sx, sy); pen = true; }
          }
          ctx.stroke();
        }
        ctx.restore();

        for (const pt of route.pts) {
          const p = project(pt[0], pt[1], lon0, lat0);
          if (p.z <= 0.06) continue;
          const sx = cx + p.x * R, sy = cy - p.y * R;
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 7);
          glow.addColorStop(0, `rgba(${BRASS}, .34)`);
          glow.addColorStop(1, `rgba(${BRASS}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(255, 228, 180, .92)`;
          ctx.beginPath(); ctx.arc(sx, sy, 1.6, 0, Math.PI * 2); ctx.fill();
        }
      }

      ctx.restore();

      // 轮廓与受光边缘
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${INK}, .28)`;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

      const rim = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      rim.addColorStop(0, `rgba(${INK}, .55)`);
      rim.addColorStop(0.4, `rgba(${INK}, .1)`);
      rim.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = rim;
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(cx, cy, R - 0.5, Math.PI * 0.85, Math.PI * 1.95); ctx.stroke();

      // 刻度环
      ctx.strokeStyle = `rgba(${INK}, .22)`;
      ctx.lineWidth = 1;
      for (let a = 0; a < 360; a += 5) {
        const t = a * D2R, len = a % 30 === 0 ? 7 : 3;
        const r1 = R + 12, r2 = R + 12 + len;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(t) * r1, cy + Math.sin(t) * r1);
        ctx.lineTo(cx + Math.cos(t) * r2, cy + Math.sin(t) * r2);
        ctx.stroke();
      }

      if (readout) {
        const la = Math.abs(state.lat).toFixed(1) + '°' + (state.lat >= 0 ? 'N' : 'S');
        const lon = ((((state.lon + 180) % 360) + 360) % 360) - 180;
        const lo = Math.abs(lon).toFixed(1) + '°' + (lon >= 0 ? 'E' : 'W');
        readout.textContent = `${la}  ${lo}`;
      }
    }

    let raf = 0, last = 0;
    function loop(t) {
      raf = 0;
      const dt = last ? Math.min(t - last, 64) : 16;
      last = t;
      if (state.target) {
        const dLon = ((state.target.lon - state.lon + 540) % 360) - 180;
        const dLat = state.target.lat - state.lat;
        state.lon += dLon * 0.09;
        state.lat += dLat * 0.09;
        draw();
        if (Math.abs(dLon) < 0.35 && Math.abs(dLat) < 0.35) {
          state.lon = state.target.lon;
          state.lat = state.target.lat;
          state.target = null;
          draw();
        }
      } else if (state.auto && !state.drag) {
        state.lon -= 0.0016 * dt; // 约 1.6°/s 的慢速自转
        draw();
      }
      raf = requestAnimationFrame(loop);
    }

    let px = 0, py = 0, moved = 0;
    canvas.addEventListener('pointerdown', e => {
      state.drag = true; moved = 0; px = e.clientX; py = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add('is-dragging');
    });
    canvas.addEventListener('pointermove', e => {
      if (!state.drag) return;
      const dx = e.clientX - px, dy = e.clientY - py;
      px = e.clientX; py = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      state.lon -= dx * 0.22;
      state.lat = Math.max(-72, Math.min(72, state.lat + dy * 0.16));
      draw();
    });
    const end = e => {
      if (!state.drag) return;
      state.drag = false;
      canvas.classList.remove('is-dragging');
      if (canvas.hasPointerCapture?.(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);

    document.querySelectorAll('[data-globe-focus]').forEach(el => {
      const focus = () => {
        const [lon, lat] = (el.dataset.globeFocus || '').split(',').map(Number);
        if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;
        if (reduced) { state.lon = lon; state.lat = lat; draw(); }
        else state.target = { lon, lat };
      };
      el.addEventListener('mouseenter', focus);
      el.addEventListener('focus', focus);
      el.addEventListener('mouseleave', () => { state.target = null; });
      el.addEventListener('blur', () => { state.target = null; });
    });

    new ResizeObserver(resize).observe(canvas);
    resize();
    if (!reduced) raf = requestAnimationFrame(loop);
  }

  const canvas = document.querySelector('[data-globe]');
  if (canvas) init(canvas);
})();
