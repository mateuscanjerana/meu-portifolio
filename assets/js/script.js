'use strict';

// Menu, seções, scroll e preferências. Nenhuma dependência externa.
(() => {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = [...document.querySelectorAll('.nav_link')];
  const header = document.getElementById('header');
  const scrollUp = document.getElementById('scroll-up');
  const footer = document.querySelector('.footer');
  const sections = [...document.querySelectorAll('main section[id]')];

  function setMenu(open) {
    navMenu.classList.toggle('show-menu', open);
    document.body.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    if (open) showPalette(false);
  }
  navToggle?.addEventListener('click', () => setMenu(true));
  navClose?.addEventListener('click', () => setMenu(false));
  navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scroll-header', y >= 80);
    // Esconde o botão assim que o footer começa a entrar no viewport.
    const footerVisible = footer && footer.getBoundingClientRect().top <= window.innerHeight - 24;
    scrollUp.classList.toggle('show-scroll', y >= 560 && !footerVisible);
    const active = [...sections].reverse().find(section => y + 140 >= section.offsetTop);
    if (!active) return;
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${active.id}`;
      link.classList.toggle('active-link', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  const themeButton = document.getElementById('theme-button');
  const themeIcon = document.getElementById('theme-icon');
  const paletteButton = document.getElementById('palette-button');
  const paletteMenu = document.getElementById('palette-menu');
  const swatches = [...document.querySelectorAll('.palette_swatch')];
  const acceptedPalettes = new Set(['black','blue','red','green']);

  function safeRead(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function safeSave(key, value) {
    try { localStorage.setItem(key, value); } catch { /* Preferência apenas nesta visita. */ }
  }
  function setDarkMode(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    themeIcon.className = `uil ${isDark ? 'uil-sun' : 'uil-moon'}`;
    themeButton.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
    themeButton.title = isDark ? 'Ativar modo claro' : 'Ativar modo escuro';
    safeSave('selected-theme', isDark ? 'dark' : 'light');
  }
  function setPalette(color) {
    if (!acceptedPalettes.has(color)) return;
    document.body.dataset.palette = color;
    swatches.forEach(swatch => swatch.setAttribute('aria-pressed', String(swatch.dataset.color === color)));
    safeSave('selected-palette', color);
  }
  function showPalette(open) {
    paletteMenu.hidden = !open;
    paletteButton.setAttribute('aria-expanded', String(open));
  }

  // Adota a preferência antiga do seu script quando já existir.
  const rememberedTheme = safeRead('selected-theme');
  setDarkMode(rememberedTheme !== 'light');
  setPalette(safeRead('selected-palette') || 'black');
  themeButton.addEventListener('click', () => setDarkMode(!document.body.classList.contains('dark-theme')));
  paletteButton.addEventListener('click', event => {
    event.stopPropagation();
    showPalette(paletteMenu.hidden);
  });
  swatches.forEach(swatch => swatch.addEventListener('click', () => {
    setPalette(swatch.dataset.color);
    showPalette(false);
    paletteButton.focus();
  }));
  document.addEventListener('click', event => {
    if (!paletteMenu.hidden && !event.target.closest('.theme_picker')) showPalette(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !paletteMenu.hidden) { showPalette(false); paletteButton.focus(); }
  });

  const year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();
})();
