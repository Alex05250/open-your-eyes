/* 情景档案：五问滚动叙事
   舞台图随滚动步骤切换；货流/数据流沿路径移动。 */
(() => {
  'use strict';
  const stories = [...document.querySelectorAll('[data-story]')];
  if (!stories.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const DOTS = 5;

  stories.forEach(story => {
    const svg = story.querySelector('.stage-svg');
    if (!svg) return;
    const steps = [...story.querySelectorAll('[data-step]')];
    const groups = [...svg.querySelectorAll('[data-show]')];
    const lanes = [...svg.querySelectorAll('[data-lane]')];
    const label = story.querySelector('[data-stage-label]');
    const meter = story.querySelector('[data-stage-meter]');
    let stage = 1;

    const flows = lanes.map(lane => {
      const total = lane.getTotalLength();
      const speeds = (lane.dataset.speeds || '0.6').split(/\s+/).map(Number);
      const dots = [];
      for (let i = 0; i < DOTS; i++) {
        const c = document.createElementNS(SVGNS, 'circle');
        c.setAttribute('r', '2.4');
        c.setAttribute('class', 'cargo');
        svg.appendChild(c);
        dots.push({ el: c, t: (i / DOTS) % 1 });
      }
      return { lane, total, speeds, dots };
    });

    function paint() {
      flows.forEach(flow => {
        flow.dots.forEach((dot, i) => {
          const p = flow.lane.getPointAtLength(((dot.t % 1) + 1) % 1 * flow.total);
          dot.el.setAttribute('cx', p.x.toFixed(2));
          dot.el.setAttribute('cy', p.y.toFixed(2));
          dot.el.style.opacity = String(0.35 + 0.5 * (i % 2));
        });
      });
    }

    function setStage(n) {
      stage = Math.max(1, Math.min(steps.length, n));
      svg.setAttribute('data-stage', String(stage));
      groups.forEach(g => {
        const list = (g.dataset.show || '').split(/\s+/);
        g.classList.toggle('is-on', list.includes(String(stage)));
      });
      steps.forEach(s => s.classList.toggle('is-active', Number(s.dataset.step) === stage));
      if (label) label.textContent = steps[stage - 1]?.querySelector('.step-cap')?.textContent || '';
      if (meter) meter.textContent = `0${stage} / 0${steps.length}`;
      if (reduced) paint();
    }

    // 初始进度：让每条路径上的点均匀分布
    flows.forEach(flow => {
      flow.dots.forEach((dot, i) => { dot.t = i / flow.dots.length; });
    });
    story.classList.add('is-live');
    setStage(1);
    paint();

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setStage(Number(entry.target.dataset.step));
        });
      }, { rootMargin: '-42% 0px -50% 0px', threshold: 0 });
      steps.forEach(s => io.observe(s));
    }

    if (!reduced) {
      let last = 0;
      const tick = t => {
        const dt = last ? Math.min(t - last, 80) : 16;
        last = t;
        let moving = false;
        flows.forEach(flow => {
          const speed = flow.speeds[stage - 1] ?? 0.6;
          if (speed <= 0.001) return;
          moving = true;
          flow.dots.forEach(dot => { dot.t += speed * 0.075 * dt / 1000; });
        });
        if (moving) paint();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    // 舞台可点击：点标记切到对应步骤
    svg.querySelectorAll('[data-step-jump]').forEach(el => {
      el.addEventListener('click', () => setStage(Number(el.dataset.stepJump)));
    });
  });
})();
