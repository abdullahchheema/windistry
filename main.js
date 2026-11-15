(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // loader
  addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 500));
  setTimeout(() => $('#loader').classList.add('done'), 2500); // safety net

  // nav + hero parallax
  const nav = $('#nav'), bg = $('#heroBg');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 60);
    if (!reduce && y < innerHeight * 1.2) bg.style.transform = `translate3d(0,${y * 0.25}px,0)`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  // count up
  const count = el => {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0), suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 2000;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), v = end * (1 - Math.pow(1 - p, 4));
      el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString()) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  setTimeout(() => $$('[data-count]').forEach(count), 2200);

  // reviews
  const reviews = [
    ['“I used to dread the dentist. At Windistry I fell asleep listening to the music.”', 'Priya S., Aligner patient'],
    ['“Same-day crown, zero pain, and they explained every single step. Unreal.”', 'Marcus T., Restoration'],
    ['“My kids actually ask when we’re going back. That says everything.”', 'Elena R., Family care']
  ];
  const q = $('#quote'), who = $('#who'), dots = $$('.dots button');
  let i = 0, timer;
  const show = n => {
    i = n; q.classList.add('out'); who.classList.add('out');
    setTimeout(() => {
      q.textContent = reviews[n][0]; who.textContent = reviews[n][1];
      q.classList.remove('out'); who.classList.remove('out');
      dots.forEach((d, k) => d.classList.toggle('on', k === n));
    }, 450);
  };
  const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show((i + 1) % reviews.length), 5500); };
  dots.forEach((d, k) => d.addEventListener('click', () => { show(k); auto(); }));
  auto();

  // magnetic button
  if (!reduce) $$('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
})();
