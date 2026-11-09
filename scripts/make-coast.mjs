/* 生成 src/coast.mjs：把 Natural Earth 1:50m 陆地轮廓按区域裁成卡片用的线刻底图。
   用法：node scripts/make-coast.mjs <land-50m.json>
   生成物提交进仓库，构建时不再依赖原始 TopoJSON。 */
import fs from 'node:fs';

const src = process.argv[2] || 'land-50m.json';
const topo = JSON.parse(fs.readFileSync(src, 'utf8'));
const { scale: [sx, sy], translate: [tx, ty] } = topo.transform;

const arcs = topo.arcs.map(arc => {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
});

function ringPoints(idxs) {
  const out = [];
  for (const idx of idxs) {
    const a = idx >= 0 ? arcs[idx] : arcs[~idx].slice().reverse();
    for (let i = 0; i < a.length; i++) { if (out.length && i === 0) continue; out.push(a[i]); }
  }
  return out;
}

const jobs = [
  { name: 'indianOcean', bbox: [30, -10, 116, 44], tol: 0.3, min: 7 },
  { name: 'delta', bbox: [104, 17, 126, 37], tol: 0.16, min: 8 }
];

function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const out = [pts[0]];
  for (const p of pts) {
    const q = out[out.length - 1];
    if (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) >= tol) out.push(p);
  }
  if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
  return out;
}

const geom = topo.objects.land.type === 'GeometryCollection' ? topo.objects.land.geometries : [topo.objects.land];
const polygons = [];
for (const g of geom) {
  const p = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
  for (const poly of p) polygons.push(poly.map(ringPoints));
}

const result = {};
for (const job of jobs) {
  const [w, h] = [320, 200];
  const [lon0, lat0, lon1, lat1] = job.bbox;
  const midLat = (lat0 + lat1) / 2;
  const kx = Math.cos(midLat * Math.PI / 180);
  const scale = Math.min(w / ((lon1 - lon0) * kx), h / (lat1 - lat0));
  const offX = (w - (lon1 - lon0) * kx * scale) / 2;
  const offY = (h - (lat1 - lat0) * scale) / 2;
  const px = lon => offX + (lon - lon0) * kx * scale;
  const py = lat => offY + (lat1 - lat) * scale;
  const paths = [];
  const fills = [];
  for (const poly of polygons) {
    for (const ring of poly) {
            const simp = simplify(ring, job.tol);
      if (simp.length < 4) continue;
      // 只保留落在裁剪框内的连续段，避免把整块大陆的海岸线都塞进卡片
      const m = 2;
      let run = [];
      const flush = () => {
        if (run.length >= 4) {
          let d = '';
          run.forEach(([lon, lat], i) => { d += (i ? 'L' : 'M') + Math.round(px(lon)) + ' ' + Math.round(py(lat)); });
          paths.push(d);
        }
        run = [];
      };
      for (const pt of simp) {
        const inside = pt[0] > lon0 - m && pt[0] < lon1 + m && pt[1] > lat0 - m && pt[1] < lat1 + m;
        if (inside) run.push(pt); else flush();
      }
      flush();
    }
  }
  for (const poly of polygons) {
    for (const ring of poly) {
      const simp = simplify(ring, 0.45);
      if (simp.length < 8) continue;
      const pxs = simp.map(p => px(p[0])), pys = simp.map(p => py(p[1]));
      if (Math.max(...pxs) < -40 || Math.min(...pxs) > w + 40 || Math.max(...pys) < -40 || Math.min(...pys) > h + 40) continue;
      let d = '';
      simp.forEach(([lon, lat], i) => { d += (i ? 'L' : 'M') + Math.round(px(lon)) + ' ' + Math.round(py(lat)); });
      fills.push(d + 'Z');
    }
  }
  result[job.name] = { view: `0 0 ${w} ${h}`, paths, fills };
  console.log(job.name, 'rings', paths.length, 'fills', fills.length, 'chars', (paths.join('').length + fills.join('').length));
}

fs.writeFileSync('src/coast.mjs', `// 由 Natural Earth 1:50m 陆地轮廓（world-atlas land-50m）按区域裁剪生成，仅作装饰底图，非测量用。\n// 重新生成：node scripts/make-coast.mjs path/to/land-50m.json\nexport const COAST = ${JSON.stringify(result)};\n`);
console.log('written src/coast.mjs', fs.statSync('src/coast.mjs').size);
