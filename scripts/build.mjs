import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sections, entries } from '../src/content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const BRASS = '#c69852';
const icon = {
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3.2 9h17.6M3.2 15h17.6"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
  upRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>'
};

/* ——— 每张档案配一幅线刻画 ——— */
function diagram(kind) {
  const grid = `<g opacity=".16"><path d="M0 50h320M0 100h320M0 150h320M80 0v200M160 0v200M240 0v200"/></g>`;
  const body = {
    aeon: `<g opacity=".5"><circle cx="160" cy="100" r="38"/><circle cx="160" cy="100" r="64" opacity=".7"/><circle cx="160" cy="100" r="90" opacity=".45"/></g>
      <g opacity=".14" stroke-dasharray="2 7"><path d="M160 4v192M4 100h312"/></g>
      <path d="M160 100 L222 54" opacity=".55" stroke="${BRASS}"/>
      <circle cx="222" cy="54" r="3.6" fill="${BRASS}" stroke="none"/>
      <circle cx="160" cy="100" r="2.4" fill="currentColor" stroke="none" opacity=".8"/>`,
    fs: `<path d="M92 128a68 68 0 0 1 136 0" opacity=".55"/>
      <path d="M228 128l6-9 5 10" opacity=".55" stroke="${BRASS}"/>
      <path d="M228 72a68 68 0 0 0-136 0" opacity=".3"/>
      <g opacity=".7"><circle cx="120" cy="140" r="3"/><circle cx="160" cy="148" r="3"/><circle cx="200" cy="140" r="3"/></g>
      <path d="M120 140h80M160 140v8" opacity=".25"/>`,
    mind: `<path d="M42 100Q160 32 278 100Q160 168 42 100Z" opacity=".6"/>
      <circle cx="160" cy="100" r="30" opacity=".5"/>
      <circle cx="160" cy="100" r="4.5" fill="${BRASS}" stroke="none"/>
      <g opacity=".22" stroke-dasharray="2 6"><path d="M160 40v20M160 140v20M96 100h-24M224 100h24"/></g>`,
    review: `<g opacity=".3"><rect x="92" y="52" width="148" height="24"/></g>
      <g opacity=".5"><rect x="74" y="86" width="172" height="24"/></g>
      <rect x="56" y="120" width="208" height="24" opacity=".85"/>
      <g stroke="${BRASS}" opacity=".85"><path d="M70 132l5 5 9-10"/><path d="M88 132l5 5 9-10"/><path d="M106 132l5 5 9-10"/></g>`,
    meta: `<path d="M168 24v152" opacity=".3" stroke-dasharray="3 5"/>
      <g opacity=".8">
        <path d="M112 44h58M128 62h44M108 80h62M126 98h48M118 116h56"/>
      </g>
      <g fill="currentColor" stroke="none" opacity=".9">
        <rect x="132" y="39" width="9" height="9"/><rect x="144" y="57" width="9" height="9"/>
        <rect x="128" y="75" width="9" height="9"/><rect x="138" y="93" width="9" height="9"/>
        <rect x="140" y="111" width="9" height="9"/>
      </g>
      <path d="M124 140l26-11 26 11-26 11Z" fill="none" stroke="${BRASS}"/>
      <path d="M176 140h18" opacity=".4"/>`,
    interval: `<path d="M44 158C104 158 116 44 160 44s56 114 116 114" opacity=".6"/>
      <path d="M160 44v114" stroke="${BRASS}" stroke-dasharray="3 5"/>
      <path d="M120 138h80" opacity=".55"/><path d="M120 132v12M200 132v12" opacity=".55"/>
      <circle cx="160" cy="44" r="3.2" fill="${BRASS}" stroke="none"/>`,
    shipping: `<path d="M26 148C96 148 118 44 190 44s58 44 100 44" opacity=".55" stroke="${BRASS}" stroke-dasharray="4 6"/>
      <g opacity=".3"><path d="M26 148h60M190 44h80"/></g>
      <circle cx="26" cy="148" r="3.4" fill="${BRASS}" stroke="none"/>
      <circle cx="110" cy="96" r="3" fill="currentColor" stroke="none" opacity=".8"/>
      <circle cx="190" cy="44" r="3.4" fill="${BRASS}" stroke="none"/>
      <circle cx="290" cy="88" r="3" fill="currentColor" stroke="none" opacity=".8"/>
      <path d="M110 96l24 8 22-6" opacity=".0"/>
      <g opacity=".35"><path d="M56 30v14M52 34h8"/><path d="M264 132v14M260 136h8"/></g>`,
    data: `<g opacity=".55">
        <rect x="66" y="52" width="22" height="22"/><rect x="96" y="52" width="22" height="22"/><rect x="126" y="52" width="22" height="22"/><rect x="156" y="52" width="22" height="22"/><rect x="186" y="52" width="22" height="22"/><rect x="216" y="52" width="22" height="22"/>
        <rect x="66" y="82" width="22" height="22" opacity=".6"/><rect x="126" y="82" width="22" height="22" opacity=".3"/><rect x="216" y="82" width="22" height="22" opacity=".6"/>
        <rect x="66" y="112" width="22" height="22" opacity=".3"/><rect x="96" y="112" width="22" height="22" opacity=".7"/><rect x="186" y="112" width="22" height="22" opacity=".7"/>
      </g>
      <rect x="96" y="82" width="22" height="22" fill="${BRASS}" stroke="none" opacity=".85"/>
      <rect x="156" y="112" width="22" height="22" fill="${BRASS}" stroke="none" opacity=".45"/>
      <path d="M252 52v82" opacity=".4"/><path d="M246 52h12M246 134h12" opacity=".4"/>
      <path d="M120 154h80" opacity=".3" stroke-dasharray="2 5"/>`
  }[kind];
  return `<svg class="diagram" viewBox="0 0 320 200" aria-hidden="true">${grid}${body}</svg>`;
}

/* ——— 页面骨架 ——— */
function shell({ title, desc, body, base = './', section = '', home = false, globe = false, hero = false, extra = '' }) {
  const navLinks = sections.map((s, i) =>
    `<a href="${base}${s.id}/" ${section === s.id ? 'aria-current="page"' : ''}><span>0${i + 1}</span>${s.title}</a>`).join('');
  const scripts = `${globe ? `<script src="${base}assets/land.js" defer></script><script src="${base}assets/globe.js" defer></script>` : ''}${extra || ''}`;
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#05080b"><meta name="description" content="${esc(desc)}"><title>${esc(title)}${home ? '' : ' · 睁眼看世界'}</title><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:image" content="https://alex05250.github.io/open-your-eyes/assets/earth.svg"><link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}assets/style.css"><script src="${base}assets/app.js" defer></script>${scripts}</head>
<body data-base="${base}" ${hero ? 'class="has-hero"' : ''}>
<a class="skip" href="#main">跳到主要内容</a>
<div class="scroll-progress" aria-hidden="true"></div>
<header class="site-header"><div class="header-inner">
<a class="brand" href="${base}" aria-label="睁眼看世界 · 首页"><span class="brand-mark">${icon.globe}</span><span class="brand-text"><b>睁眼看世界</b><i>OPEN YOUR EYES</i></span></a>
<nav id="navigation" aria-label="主导航">${navLinks}</nav>
<div class="nav-tools"><button class="icon-button search-open" aria-label="搜索全站">${icon.search}</button><button class="menu-button icon-button" aria-controls="navigation" aria-expanded="false" aria-label="展开导航"><span></span><span></span></button></div>
</div></header>
<main id="main">${body}</main>
<footer class="site-footer"><div class="wrap">
<div class="footer-top"><div class="footer-brand"><b>睁眼看世界</b><span class="en">STAY CURIOUS · SEE BEYOND</span><p style="font-size:13px;color:rgba(242,235,218,.5);max-width:22em;line-height:2">一个保持好奇、重视来源与上下文的独立中文知识门户。不追逐消息流，只留下可以反复阅读的理解。</p></div>
<div class="footer-nav"><div><span>栏目</span>${sections.map(s => `<a href="${base}${s.id}/">${s.title}</a>`).join('')}</div><div><span>关于</span><a href="https://github.com/Alex05250/open-your-eyes" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${base}sitemap.xml">站点地图</a><a href="#main">回到顶部</a></div></div>
</div>
<div class="footer-bottom"><span>独立知识门户 · 初版示例内容</span><span>本站不提供实时新闻；外部内容版权归原作者。</span><span>地球轮廓：Natural Earth / world-atlas</span></div>
</div></footer>
<dialog id="search-dialog" aria-labelledby="search-title"><div class="dialog-top"><h2 id="search-title">你想理解什么？</h2><button class="icon-button search-close" aria-label="关闭搜索">×</button></div><label for="global-search">搜索词条、来源或示例事件</label><input id="global-search" type="search" placeholder="试试「元认知」或「Aeon」" autocomplete="off"><p class="search-status" role="status" aria-live="polite"></p><div id="search-results"></div><p class="dialog-hint">全部结果均为示例内容或来源导航 · 按 Esc 关闭</p></dialog>
<noscript><div class="noscript">搜索与筛选需要 JavaScript；所有内容仍可通过页面链接直接阅读。</div></noscript>
</body></html>`;
}

const globeBlock = `<div class="hero-globe"><canvas data-globe aria-label="世界地球示意图，可拖动旋转"></canvas><div class="globe-frame" aria-hidden="true"><span></span><span></span><span></span><span></span></div><div class="globe-readout" aria-hidden="true">视线中心 <b data-globe-coord>24.0°N 108.0°E</b></div></div>`;

/* ——— 首页 ——— */
const home = `<section class="hero">
<div class="wrap hero-grid">
  <div class="hero-copy">
    <div class="kicker kicker--light"><em>VOL. I</em> · 一份可以慢慢读的知识地图</div>
    <h1>世界很大，<br>值得看得<span class="dot">更深</span>。</h1>
    <p class="hero-lede">穿过信息的喧嚣，连接思想与世界。</p>
    <p class="hero-desc">这里没有实时消息流，只有三件慢一点的事：读一段真正值得的思想，弄清一个反复出现的概念，看懂一件事的来龙去脉。</p>
    <div class="hero-actions"><a class="button button--brass" href="./reading/">开始探索 <span aria-hidden="true">→</span></a><a class="text-link" href="#portals" style="color:rgba(242,235,218,.7);border-color:rgba(242,235,218,.25)">看看它由什么组成 <span aria-hidden="true">↓</span></a></div>
    <div class="hero-meta"><span>卷次<b>三卷</b></span><span>条目<b>08</b></span><span>框架<b>五问</b></span><span>性质<b>示例版</b></span></div>
  </div>
  ${globeBlock}
</div>
</section>

<section class="section" id="portals"><div class="wrap">
  <div class="section-head"><div><div class="kicker">THREE WAYS TO SEE</div><h2>从三个入口，走向更大的世界。</h2></div><div class="aside"><b>03</b>条路径<br>为理解，而不只是知道</div></div>
  <div class="portals">${sections.map((s, i) => `<a class="portal" href="./${s.id}/" data-reveal><span class="portal-no"><b>0${i + 1}</b>${s.no} / ${s.en}</span><h3><small>${s.en}</small>${s.title}</h3><p>${s.id === 'reading' ? '遇见好思想，让阅读超越信息摄入。' : s.id === 'knowledge' ? '厘清关键概念，建立自己的理解坐标。' : '沿着事件的脉络，观察世界如何相连。'}</p><span class="portal-go" aria-hidden="true">${icon.upRight}</span></a>`).join('')}</div>
</div></section>

<section class="section section--tight"><div class="wrap">
  <div class="section-head"><div><div class="kicker">THE READING ROOM</div><h2>把时间，交给有深度的阅读。</h2></div><a class="text-link" href="./reading/">全部阅读来源 ${icon.upRight}</a></div>
  <a class="feature" href="./reading/aeon/" data-reveal><div class="feature-art">${diagram('aeon')}<span class="plate-en">A WORLD OF IDEAS</span></div><div class="feature-copy"><div class="kicker kicker--plain" style="font-size:10px">来源发现示例 · AEON</div><h3>一个好问题，<br>就是一扇新窗口。</h3><p>从哲学、科学到文化，为尚未想过的问题留一点空间。介绍 Aeon 作为阅读来源，不代替原文，也不冒充具体文章。</p><span class="text-link">探索这个来源 ${icon.upRight}</span></div></a>
</div></section>

<section class="section section--tight"><div class="wrap">
  <div class="section-head"><div><div class="kicker">A FOUNDATION FOR THINKING</div><h2>理解世界，从理解概念开始。</h2></div><a class="text-link" href="./knowledge/">进入知识百科 ${icon.upRight}</a></div>
  <div class="concepts">${entries.filter(e => e.section === 'knowledge').map((e, i) => `<a class="concept" href="./knowledge/${e.id}/"><span class="concept-no">0${i + 1}</span><div><h3>${e.title}</h3><span class="en">${e.en}</span></div><p>${e.summary}</p>${icon.arrow}</a>`).join('')}</div>
</div></section>

<section class="band"><div class="wrap">
  <div class="band-head"><div><div class="kicker kicker--light">THE BIGGER PICTURE</div><h2>不追逐每一条消息。<br>看懂一件事的来龙去脉。</h2></div><p>背景、起因、发展、现状与影响。把孤立的信息，放回完整的世界。</p></div>
  <div class="portals" style="border-color:rgba(242,235,218,.14)">${entries.filter(e => e.section === 'world').map(e => `<a class="portal" href="./world/${e.id}/" style="border-color:rgba(242,235,218,.14);grid-template-columns:74px minmax(0,1.4fr) minmax(0,1fr) 44px"><span class="portal-no" style="color:${BRASS}">虚构事件<br><b style="color:#f2ece0;font-size:16px;letter-spacing:.06em">结构演示</b></span><h3 style="color:#f2ece0">${e.title}</h3><p style="color:rgba(242,235,218,.55)">${e.summary}</p><span class="portal-go" aria-hidden="true" style="border-color:rgba(242,235,218,.25);color:#e6c489">${icon.upRight}</span></a>`).join('')}</div>
  <div style="margin-top:34px;display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between"><a class="button button--ghost" href="./world/">探索事件档案 <span aria-hidden="true">→</span></a><small style="font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:rgba(242,235,218,.4)">当前为虚构事件结构演示 · 非实时新闻</small></div>
</div></section>

<div class="wrap" style="padding:44px 0 64px"><div class="collection-note"><strong style="color:var(--ink);font-weight:600;letter-spacing:.06em">关于这一版</strong><p>「睁眼看世界」的首个公开版本。百科为基础示例词条；深度阅读为来源发现入口，不冒充具体文章；世界动态为明确标注的虚构情景。没有自动新闻流，也没有虚构的实时数据。</p></div></div>`;

write('index.html', shell({
  title: '睁眼看世界 — 保持好奇，看得更深',
  desc: '一个连接深度阅读、知识百科与世界动态的独立知识门户。以清晰概念与完整脉络理解世界。',
  body: home, home: true, globe: true, hero: true
}));

/* ——— 栏目页 ——— */
for (const s of sections) {
  const items = entries.filter(e => e.section === s.id);
  const isWorld = s.id === 'world';
  const body = `<section class="hero hero--page">
<div class="wrap hero-grid">
  <div class="hero-copy">
    <div class="kicker kicker--light"><em>VOL. ${['I', 'II', 'III'][sections.indexOf(s)]}</em> · ${s.en}</div>
    <h1>${s.title}<span class="dot">。</span></h1>
    <p class="hero-lede">${s.intro}</p>
    <p class="hero-desc">${s.desc}</p>
    <div class="hero-meta"><span>条目<b>${String(items.length).padStart(2, '0')}</b></span><span>性质<b>${isWorld ? '虚构演示' : s.id === 'reading' ? '来源导航' : '基础词条'}</b></span><span>更新<b>不定期</b></span></div>
  </div>
  ${globeBlock}
</div></section>
<section class="section" style="padding-top:56px"><div class="wrap">
  <div class="collection-note"><p>${isWorld ? '虚构情景 / 非实时新闻 · 以下案例仅演示事件分析框架，不代表真实事件。' : s.id === 'reading' ? '来源发现示例 · 仅介绍阅读来源，未收录未经核验的作者和文章标题。' : '基础示例词条 · 用于入门理解，参考资料见各词条末尾。'}</p></div>
  <div class="filter-bar"><div class="filters" role="group" aria-label="按主题筛选">${s.filters.map((f, i) => `<button data-filter="${f}" aria-pressed="${i === 0}">${f}</button>`).join('')}</div><div class="collection-search"><label class="visually-hidden" for="collection-search">搜索${s.title}</label><input id="collection-search" type="search" placeholder="搜索${isWorld ? '事件' : s.id === 'reading' ? '来源' : '概念'}…">${icon.search}</div></div>
  <p class="result-count" role="status" aria-live="polite">${items.length} 个${s.id === 'reading' ? '来源' : '条目'}</p>
  <div class="plates">${items.map((e, i) => `<article class="plate" data-entry data-category="${e.tag}" data-search="${esc(e.title + ' ' + e.en + ' ' + e.summary + ' ' + e.tag)}"><a href="${e.id}/"><div class="plate-art">${diagram(e.art)}<span class="plate-no">${String(i + 1).padStart(2, '0')}</span><span class="plate-en">${e.en}</span></div><div class="plate-body"><div class="tag"><i></i>${e.tag}<span class="sep">·</span><span style="font-weight:400">${e.label}</span></div><h3>${e.title}<span aria-hidden="true">↗</span></h3><p>${e.summary}</p><span class="plate-cta">${isWorld ? '展开事件档案' : s.id === 'reading' ? '探索来源' : '理解这个概念'}${icon.arrow}</span></div></a></article>`).join('')}</div>
  <div class="empty-state" hidden><h3>还没有找到这个主题。</h3><p>试试更短的关键词，或清除筛选重新探索。</p><button class="button button--ink reset-filter">清除搜索与筛选</button></div>
</div></section>
${isWorld ? `<section class="band"><div class="wrap"><div class="band-head"><div><div class="kicker kicker--light">OUR APPROACH · 方法</div><h2>用五个问题，读懂一个事件。</h2></div><p>一条消息只有几行，一件事却有几层。按顺序问完这五个问题，碎片才会连成脉络。</p></div><ol class="steps">${[['背景', '它在什么环境中发生？'], ['起因', '是什么触发了变化？'], ['发展', '关键节点如何相连？'], ['现状', '已知、未知与争议是什么？'], ['影响', '下一步值得观察什么？']].map(([t, q], i) => `<li><b>0${i + 1}</b><h3>${t}</h3><p>${q}</p></li>`).join('')}</ol><div class="band-cta"><a class="button button--ghost" href="method/">读完整的方法说明 →</a><a class="text-link" href="./" style="color:rgba(242,235,218,.6);border-color:rgba(242,235,218,.2)">五问之外，还要问什么？</a></div></div></section>` : ''}`;
  write(`${s.id}/index.html`, shell({ title: s.title, desc: s.desc, base: '../', section: s.id, body, globe: true, hero: true }));
}

/* ——— 情景页的舞台图 ——— */
const STAGE = {
  'shipping-scenario': {
    view: '0 0 480 560',
    lane: 'M74 468C132 424 128 356 190 302S300 250 320 186 382 112 420 74',
    speeds: '0.55 0 0.18 0.9 0.7',
    nodes: [['74', '468', '起点港口', 'start'], ['190', '302', '中转枢纽', 'mid'], ['320', '186', '咽喉航段', 'choke'], ['420', '74', '远端市场', 'end']],
    marks: `<g class="stage-mark" data-show="2 3"><circle cx="320" cy="186" r="27"/><path d="M310 176l20 20M330 176l-20 20"/><text x="352" y="150" text-anchor="middle">航段受阻</text></g>
      <g class="stage-mark stage-mark--soft" data-show="4 5"><circle cx="320" cy="186" r="27"/><path d="M311 186l6 6 12-13"/><text x="352" y="150" text-anchor="middle">恢复通行</text></g>`,
    caption: ['连接形成', '局部中断', '等待与绕行', '积压消化', '传导观察']
  },
  'data-scenario': {
    view: '0 0 480 560',
    lane: 'M240 502C240 470 214 452 214 418S240 372 240 340S266 300 266 268S240 222 240 196S214 156 214 124 240 78 240 46',
    speeds: '0.5 0.06 0.4 0.9 0.6',
    nodes: [['240', '502', '部门资料', 'start'], ['240', '340', '隐私与许可', 'mid'], ['240', '196', '统一发布', 'choke'], ['240', '46', '公众使用', 'end']],
    marks: `<g class="stage-mark stage-mark--soft" data-show="2 3"><circle cx="240" cy="340" r="27"/><path d="M232 340h16M240 332v16"/><text x="240" y="392" text-anchor="middle">逐项评估</text></g>
      <g class="stage-mark" data-show="4 5"><circle cx="240" cy="196" r="27"/><path d="M231 196l6 6 12-13"/><text x="240" y="248" text-anchor="middle">已可复用</text></g>`,
    caption: ['资料分散', '试点提案', '字段与许可', '测试反馈', '可用性评估']
  }
};

function stageSvg(kind) {
  const cfg = STAGE[kind];
  if (!cfg) return '';
  const nodes = cfg.nodes.map(([x, y, label, cls], i) => {
    const right = Number(x) > 300;
    const tx = right ? Number(x) - 14 : Number(x) + 14;
    const anchor = right ? 'end' : 'start';
    return `<g class="stage-node stage-node--${cls}" data-show="1 2 3 4 5"><circle class="node-halo" cx="${x}" cy="${y}" r="13"/><circle class="node-dot" cx="${x}" cy="${y}" r="3.4"/><text x="${tx}" y="${Number(y) + 4}" text-anchor="${anchor}">${label}</text><text class="node-idx" x="${tx}" y="${Number(y) + 22}" text-anchor="${anchor}">0${i + 1}</text></g>`;
  }).join('');
  return `<svg class="stage-svg" viewBox="${cfg.view}" aria-hidden="true">
    <g class="stage-grid"><path d="M0 140h480M0 280h480M0 420h480M120 0v560M240 0v560M360 0v560"/></g>
    <path class="lane-base" d="${cfg.lane}"/>
    <path class="lane" data-lane data-speeds="${cfg.speeds}" d="${cfg.lane}"/>
    ${nodes}
    ${cfg.marks}
  </svg>`;
}

function storyBody(e) {
  const s = sections.find(s => s.id === e.section);
  const cfg = STAGE[e.id];
  const steps = e.blocks.map((b, i) => {
    const [head, ...rest] = b[0].split('｜');
    return `<section class="story-step" id="part-${i + 1}" data-step="${i + 1}">
      <div class="step-head"><span class="step-number">0${i + 1}</span><span class="step-cap">${cfg.caption[i]}</span></div>
      <h2>${head}</h2>
      <p>${b[1]}</p>
    </section>`;
  }).join('');
  return `<article class="story" data-story>
<header class="article-head wrap--narrow"><nav class="breadcrumbs" aria-label="面包屑"><a href="../../">首页</a><span>/</span><a href="../">${s.title}</a><span>/</span><span aria-current="page">${e.title}</span></nav>
<div class="kicker" style="margin-top:26px">${e.en}</div>
<div class="tag" style="margin-top:14px"><i></i>${e.tag}<span class="sep">·</span><span style="font-weight:400">${e.label}</span></div>
<h1>${e.title}</h1>
<p class="article-deck">${e.summary}</p>
<div class="article-credit"><b>本站编写</b><span>虚构情景，不设真实发生日期</span><span>2026.11</span><span>五问结构</span></div>
</header>
<div class="story-wrap wrap">
  <div class="story-visual">
    <div class="stage-card">${stageSvg(e.id)}<div class="stage-caption"><span data-stage-label>${cfg.caption[0]}</span><b data-stage-meter>01 / 05</b></div></div>
    <p class="stage-hint">向下滚动，依次读五个问题</p>
  </div>
  <div class="story-text">
    <div class="notice"><span>虚构示例</span><p>${e.note}</p></div>
    ${steps}
    <section id="references" class="references"><h2>来源与说明</h2><p>本条目为本站原创虚构教学情景，无真实新闻来源。正式事件应补充原始通告、可核对的事件日期、多方独立报道与状态截至时间；在此之前不会以真实新闻发布。</p></section>
    <div class="article-end"><a href="../method/">这套读法怎么用 ↗</a><a href="../">返回${s.title} ↑</a></div>
  </div>
</div></article>`;
}

function articleBody(e) {
  const s = sections.find(s => s.id === e.section);
  return `<article>
<header class="article-head wrap--narrow"><nav class="breadcrumbs" aria-label="面包屑"><a href="../../">首页</a><span>/</span><a href="../">${s.title}</a><span>/</span><span aria-current="page">${e.title}</span></nav>
<div class="kicker" style="margin-top:26px">${e.en}</div>
<div class="tag" style="margin-top:14px"><i></i>${e.tag}<span class="sep">·</span><span style="font-weight:400">${e.label}</span></div>
<h1>${e.title}</h1>
<p class="article-deck">${e.summary}</p>
<div class="article-credit"><b>本站编写</b><span>首版示例内容</span><span>2026.11</span><span>${e.blocks.length} 节</span></div>
</header>
<div class="article-layout wrap"><aside class="toc" aria-label="本文目录"><span class="kicker kicker--plain" style="font-size:9.5px">ON THIS PAGE</span>${e.blocks.map((b, i) => `<a href="#part-${i + 1}" data-toc><span>0${i + 1}</span>${b[0].split('｜')[0]}</a>`).join('')}<a href="#references"><span>↗</span>来源与说明</a></aside>
<div class="article-body"><div class="notice"><span>内容说明</span><p>${e.note || '这是基础概念示例词条，以入门解释为目的，不替代原始文献或具体研究中的方法判断。'}</p></div>
${e.blocks.map((b, i) => `<section id="part-${i + 1}" class="prose-section"><h2><span class="step-number">0${i + 1}</span>${b[0]}</h2><p>${b[1]}</p></section>`).join('')}
<section id="references" class="references"><h2>来源与说明</h2><p>以下为参考或来源入口，点击将打开外部网站。本站未转载原文。</p><ol>${e.refs.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${t} ↗</a></li>`).join('')}</ol><p class="reference-note">参考入口核对：2026-11-09。外站内容可能更新。</p></section>
<div class="article-end"><span>让理解，成为下一次探索的起点。</span><a href="../">返回${s.title} ↑</a></div>
</div></div></article>`;
}

for (const e of entries) {
  const isStory = e.section === 'world' && STAGE[e.id];
  write(`${e.section}/${e.id}/index.html`, shell({
    title: e.title, desc: e.summary, base: '../../', section: e.section,
    body: isStory ? storyBody(e) : articleBody(e),
    extra: isStory ? '<script src="../../assets/story.js" defer></script>' : ''
  }));
}

/* ——— 方法页 ——— */
const methodQuestions = [
  ['背景', '这件事发生在什么结构里？', '先弄清参与者、规则和长期存在的条件：谁在里面，谁不在里面，什么东西一直没变。背景不是铺垫，而是可核对的结构信息——地图、制度、产业链条、历史节点。', '把背景写成抒情开场，却拿不出一个可核对的事实。'],
  ['起因', '是什么触发了变化？', '区分直接触发与深层条件。一次通告、一场事故、一纸政策是触发点；长期积累的脆弱性才是条件。两者都要写，但不能混为一谈。', '把先后发生当成因果；只承认一个原因。'],
  ['发展', '关键节点如何相连？', '把过程切成阶段，指出哪一个节点改变了局势，以及如果顺序不同，结果会不会不同。判断标准是：删掉这一步，后面的故事还成立吗？', '流水账式罗列事件，从不解释某一步为什么重要。'],
  ['现状', '已知、未知与争议在哪里？', '现状必须带时间戳。谁确认、谁否认、哪些信息还没核实，都要写清楚。承认不确定，比假装完整更可靠。', '把推测写成事实，或者拿三个月前的信息当作当下。'],
  ['影响', '下一步该看什么指标？', '影响沿路径传导：先变什么，再变什么。给出可观测的先行指标，也给出能推翻自己判断的证据条件。', '给出宏大结论，却没有任何指标可以验证。']
];

const method = `<header class="article-head wrap--narrow"><nav class="breadcrumbs" aria-label="面包屑"><a href="../../">首页</a><span>/</span><a href="../">世界动态</a><span>/</span><span aria-current="page">方法</span></nav>
<div class="kicker" style="margin-top:26px">OUR APPROACH / 读法</div>
<h1>五个问题，<br>一套读法。</h1>
<p class="article-deck">事件每天都在发生，解释却很少。这套顺序不是新闻模板，而是一种防错机制：按顺序问完，才知道自己究竟理解了什么，又还在猜什么。</p>
<div class="article-credit"><b>本站方法说明</b><span>适用于任何事件，不限于站内示例</span><span>2026.11</span></div>
</header>
<div class="method-body wrap--narrow">
  <p class="method-lead">一条消息通常只回答"发生了什么"。要理解一件事，需要依次回答五个问题：它在什么结构里发生、是什么触发了变化、过程如何展开、此刻已知什么、接下来该看什么。顺序不能随意调换——背景没有弄清，起因就会误判；现状没有时间戳，影响就只能空谈。</p>
  <ol class="method-list">${methodQuestions.map(([t, q, d, err], i) => `<li class="method-row"><span class="method-index">0${i + 1}</span><div class="method-main"><h2><b>${t}</b>${q}</h2><p>${d}</p></div><div class="method-error"><span>常见错误</span><p>${err}</p></div></li>`).join('')}</ol>
  <section class="method-demo"><div class="kicker">一次示范</div><h2>把五个问题，套在一条虚构航道上。</h2><p>站内的两条档案都是虚构情景，正好用来演示读法而不是演示新闻。以"当一条航道暂时受阻"为例：</p>
  <div class="demo-grid">${['结构：两片虚构区域通过一条主航道交换货物，替代路线更长，港口、船期与库存彼此牵制。', '触发：一次设备故障使航道暂停通行；深层条件是缓冲库存有限。', '过程：通行暂停 → 评估等待或绕行 → 部分航次调整 → 通道恢复、积压消化。', '现状：设定为"已恢复、积压待消化"，并明确标注这是虚构推演。', '影响：观察交付延迟、替代路线成本与库存变化，而不是直接推断物价。'].map((t, i) => `<div><b>0${i + 1}</b><p>${t}</p></div>`).join('')}</div>
  <a class="button button--ink" href="../shipping-scenario/">看这条档案的完整演示 →</a></section>
  <section class="method-rules"><h2>三条纪律</h2><ol><li><b>标注时间</b><p>任何"现状"都要写清截至日期。没有日期的现状，等于没有现状。</p></li><li><b>区分虚构与事实</b><p>教学情景、推演、传闻必须显式标注。把演示写成新闻，是最严重的失真。</p></li><li><b>保留不确定</b><p>写下仍待确认的问题，比补齐一个漂亮结论更有价值。</p></li></ol>
  <div style="margin-top:44px;display:flex;gap:20px;flex-wrap:wrap"><a class="button button--brass" href="../">回到世界动态 →</a><a class="text-link" href="../data-scenario/">读另一条档案</a></div></section>
</div>`;
write('world/method/index.html', shell({ title: '五个问题，一套读法', desc: '用背景、起因、发展、现状、影响五个问题，读懂一个事件的完整脉络。', base: '../../', section: 'world', body: method }));


/* ——— 索引与杂项 ——— */
write('assets/search-index.json', JSON.stringify(entries.map(e => ({ title: e.title, en: e.en, summary: e.summary, tag: e.tag, label: e.label, section: sections.find(s => s.id === e.section).title, url: `${e.section}/${e.id}/` })), null, 2));

write('404.html', shell({
  title: '这条路径还未被探索', desc: '页面未找到', base: '/open-your-eyes/',
  body: '<section class="not-found wrap--narrow"><div class="kicker">404 / UNCHARTED TERRITORY</div><h1>换个方向，<br>继续探索。</h1><p>这个页面不存在，或已经移动。</p><a class="button button--ink" href="/open-your-eyes/">回到首页 ↗</a></section>'
}));

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', 'world/method/', ...sections.map(s => s.id + '/'), ...entries.map(e => e.section + '/' + e.id + '/')].map(p => `<url><loc>https://alex05250.github.io/open-your-eyes/${p}</loc></url>`).join('')}</urlset>`);

function write(file, html) { const target = path.join(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, html); }
console.log(`Built ${entries.length + sections.length + 2} HTML pages.`);
