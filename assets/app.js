(() => {
  'use strict';
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('#navigation');
  function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','展开导航');nav.classList.remove('is-open');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'收起导航':'展开导航');nav.classList.toggle('is-open',open);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
  document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
  const cards=[...document.querySelectorAll('[data-entry]')];
  const input=document.querySelector('#collection-search');
  const buttons=[...document.querySelectorAll('[data-filter]')];
  let category='全部';
  const normalize=s=>s.normalize('NFKC').toLocaleLowerCase().trim();
  function filter(){if(!input)return;const query=normalize(input.value);let count=0;cards.forEach(card=>{const show=(category==='全部'||card.dataset.category===category)&&normalize(card.dataset.search).includes(query);card.hidden=!show;if(show)count++;});document.querySelector('.result-count').textContent=`${count} 个结果${category==='全部'?'':` · ${category}`}`;document.querySelector('.empty-state').hidden=count>0;}
  buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filter();}));
  input?.addEventListener('input',filter);
  document.querySelector('.reset-filter')?.addEventListener('click',()=>{input.value='';category='全部';buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='全部')));filter();input.focus();});
  const dialog=document.querySelector('#search-dialog'), search=document.querySelector('#global-search'), results=document.querySelector('#search-results'), status=document.querySelector('.search-status');
  const base=document.body.dataset.base;
  let index=null,loadPromise=null;
  async function loadIndex(){if(index)return index;if(!loadPromise)loadPromise=fetch(`${base}assets/search-index.json`).then(r=>{if(!r.ok)throw new Error('search unavailable');return r.json();}).then(data=>{index=data;return data;}).catch(()=>{status.textContent='搜索暂时无法加载。你仍可通过三个板块的页面链接阅读内容。';loadPromise=null;return null;});return loadPromise;}
  function renderSearch(){if(!index)return;const q=normalize(search.value);const found=index.filter(e=>normalize(`${e.title} ${e.en} ${e.tag} ${e.summary}`).includes(q));results.replaceChildren();status.textContent=q?`找到 ${found.length} 个结果`:'从这些入口开始探索';found.forEach(e=>{const link=document.createElement('a');link.className='search-result';link.href=`${base}${e.url}`;const meta=document.createElement('span');meta.textContent=`${e.section} · ${e.label}`;const title=document.createElement('strong');title.textContent=e.title;const summary=document.createElement('p');summary.textContent=e.summary;link.append(meta,title,summary);results.append(link);});if(!found.length){const p=document.createElement('p');p.textContent='暂未找到相关内容。试试「元认知」「研究方法」或「Aeon」。';p.className='dialog-hint';results.append(p);}}
  document.querySelector('.search-open').addEventListener('click',async()=>{closeMenu();dialog.showModal();search.focus();status.textContent='正在载入搜索…';if(await loadIndex())renderSearch();});
  document.querySelector('.search-close').addEventListener('click',()=>dialog.close());
  search.addEventListener('input',renderSearch);
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  const progress=document.querySelector('.scroll-progress');
  if(progress){let queued=0;const paintProgress=()=>{queued=0;const max=document.documentElement.scrollHeight-window.innerHeight;const p=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;progress.style.transform=`scaleX(${p})`;};window.addEventListener('scroll',()=>{if(!queued)queued=requestAnimationFrame(paintProgress);},{passive:true});paintProgress();}
  const heroEl=document.querySelector('.hero'),globeWrap=document.querySelector('.hero-globe');
  if(heroEl&&globeWrap&&!matchMedia('(prefers-reduced-motion: reduce)').matches){let queued=0;const paintHero=()=>{queued=0;const span=heroEl.offsetHeight;const y=Math.min(window.scrollY,span);const k=y/span;globeWrap.style.transform=`translate3d(0,${(y*0.07).toFixed(1)}px,0) scale(${(1-k*0.05).toFixed(3)})`;globeWrap.style.opacity=String((1-k*0.5).toFixed(3));};window.addEventListener('scroll',()=>{if(!queued)queued=requestAnimationFrame(paintHero);},{passive:true});paintHero();}
  const tocLinks=[...document.querySelectorAll('[data-toc]')];
  if(tocLinks.length&&'IntersectionObserver'in window){
    const map=new Map(tocLinks.map(a=>[a.getAttribute('href').slice(1),a]));
    const spy=new IntersectionObserver(list=>{list.forEach(entry=>{if(entry.isIntersecting){tocLinks.forEach(a=>a.classList.remove('is-current'));map.get(entry.target.id)?.classList.add('is-current');}});},{rootMargin:'-15% 0px -75% 0px'});
    tocLinks.forEach(a=>{const target=document.getElementById(a.getAttribute('href').slice(1));if(target)spy.observe(target);});
  }
  const stepItems=[...document.querySelectorAll('.steps li')];
  if(stepItems.length&&'IntersectionObserver'in window){const sio=new IntersectionObserver(list=>{list.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-lit');});},{rootMargin:'-20% 0px -40% 0px'});stepItems.forEach(el=>sio.observe(el));}
  const revealables=[...document.querySelectorAll('[data-reveal]')];
  if(revealables.length&&'IntersectionObserver'in window){
    const io=new IntersectionObserver((list)=>{list.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-in');io.unobserve(entry.target);}});},{rootMargin:'0px 0px -12% 0px'});
    revealables.forEach(el=>io.observe(el));
  }else revealables.forEach(el=>el.classList.add('is-in'));
  window.setTimeout(()=>revealables.forEach(el=>el.classList.add('is-in')),1500);
})();
