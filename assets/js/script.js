"use strict";

// Menu, seções, scroll e preferências. Nenhuma dependência externa.
(() => {
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const navLinks = [...document.querySelectorAll(".nav_link")];
  const header = document.getElementById("header");
  const scrollUp = document.getElementById("scroll-up");
  const footer = document.querySelector(".footer");
  const sections = [...document.querySelectorAll("main section[id]")];

  
function setMenu(open) {
  navMenu.classList.toggle("show-menu", open);
  document.body.classList.toggle("menu-open", open);

  navToggle.setAttribute(
    "aria-expanded",
    String(open)
  );

  if (open) {
    showPalette(false);
    showThemeModeMenu(false);
  }
}

  navToggle?.addEventListener("click", () => setMenu(true));
  navClose?.addEventListener("click", () => setMenu(false));
  navLinks.forEach((link) =>
    link.addEventListener("click", () => setMenu(false)),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scroll-header", y >= 80);
    // Esconde o botão assim que o footer começa a entrar no viewport.
    const footerVisible =
      footer && footer.getBoundingClientRect().top <= window.innerHeight - 24;
    scrollUp.classList.toggle("show-scroll", y >= 560 && !footerVisible);
    const active = [...sections]
      .reverse()
      .find((section) => y + 140 >= section.offsetTop);
    if (!active) return;
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${active.id}`;
      link.classList.toggle("active-link", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  const themeButton = document.getElementById("theme-button");
  const themeIcon = document.getElementById("theme-icon");
  const themeModeMenu = document.getElementById("theme-mode-menu");

  const themeModeButtons = [...themeModeMenu.querySelectorAll("[data-mode]")];
  const paletteButton = document.getElementById("palette-button");
  const paletteMenu = document.getElementById("palette-menu");
  const swatches = [...document.querySelectorAll(".palette_swatch")];
  const acceptedPalettes = new Set(["black", "blue", "red", "orange"]);

  function safeRead(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  function safeSave(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Preferência apenas nesta visita. */
    }
  }
  function setDarkMode(isDark) {
    document.body.classList.toggle("dark-theme", isDark);
  }
  function setPalette(color) {
    if (!acceptedPalettes.has(color)) return;
    document.body.dataset.palette = color;
    swatches.forEach((swatch) =>
      swatch.setAttribute(
        "aria-pressed",
        String(swatch.dataset.color === color),
      ),
    );
    safeSave("selected-palette", color);
  }
  function showPalette(open) {
    paletteMenu.hidden = !open;
    paletteButton.setAttribute("aria-expanded", String(open));
  }

  // ===== CONTROLE DE APARÊNCIA V1.4 =====

  // Detecta a preferência de aparência do sistema.
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Recupera a escolha do usuário.
  const allowedModes = ["system", "light", "dark"];
  const storedMode = safeRead("theme-mode");

  let currentMode = allowedModes.includes(storedMode) ? storedMode : "system";

  // Abre ou fecha o menu.
  function showThemeModeMenu(open) {
    themeModeMenu.hidden = !open;
    themeButton.setAttribute("aria-expanded", String(open));
  }

  // Aplica o tema selecionado.
  function applyThemeMode() {
    const isDark =
      currentMode === "dark" ||
      (currentMode === "system" && systemTheme.matches);

    setDarkMode(isDark);

    const icons = {
      system: "uil-desktop",
      light: "uil-sun",
      dark: "uil-moon",
    };

    const labels = {
      system: "Sistema",
      light: "Claro",
      dark: "Escuro",
    };

    themeIcon.className = `uil ${icons[currentMode]}`;
    themeButton.title = `Aparência: ${labels[currentMode]}`;

    themeButton.setAttribute(
      "aria-label",
      `Aparência: ${labels[currentMode]}. Escolher modo`,
    );

    themeModeButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.mode === currentMode),
      );
    });
  }

  // Configura a aparência inicial.
  applyThemeMode();

  // Recupera a paleta de cores.
  setPalette(safeRead("selected-palette") || "orange");

  // Abre o menu de aparência.
  themeButton.addEventListener("click", () => {
    showPalette(false);
    showThemeModeMenu(themeModeMenu.hidden);
  });

  // Seleciona Sistema, Claro ou Escuro.
  themeModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentMode = button.dataset.mode;

      safeSave("theme-mode", currentMode);

      applyThemeMode();
      showThemeModeMenu(false);

      themeButton.focus();
    });
  });

  // Acompanha as alterações do sistema.
  function handleSystemChange() {
    if (currentMode === "system") {
      applyThemeMode();
    }
  }

  if (typeof systemTheme.addEventListener === "function") {
    systemTheme.addEventListener("change", handleSystemChange);
  } else {
    systemTheme.addListener(handleSystemChange);
  }

  // Fecha o menu ao clicar fora dele.
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".theme_mode_picker")) {
      showThemeModeMenu(false);
    }
  });

  // Fecha o menu ao pressionar Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !themeModeMenu.hidden) {
      showThemeModeMenu(false);
      themeButton.focus();
    }
  });

  paletteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    showThemeModeMenu(false); // Fecha o outro menu
    showPalette(paletteMenu.hidden);
  });
  swatches.forEach((swatch) =>
    swatch.addEventListener("click", () => {
      setPalette(swatch.dataset.color);
      showPalette(false);
      paletteButton.focus();
    }),
  );
  document.addEventListener("click", (event) => {
    if (!paletteMenu.hidden && !event.target.closest(".theme_picker"))
      showPalette(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !paletteMenu.hidden) {
      showPalette(false);
      paletteButton.focus();
    }
  });

  const year = document.getElementById("footer-year");
  if (year) year.textContent = new Date().getFullYear();
})();

  // =========================================
  // V1.5 — ALTERNÂNCIA DO SUBTÍTULO DA HOME
  // =========================================

  const homeSubtitle = document.querySelector(".home_subtitle");

  const homeTitles = [
    "Desenvolvedor Web",
    "Bacharel em Ciência da Computação"
  ];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (homeSubtitle) {
    let titleIndex = 0;

    setInterval(() => {
      // Não anima com a aba oculta ou movimento reduzido.
      if (document.hidden || reduceMotion.matches) return;

      // Primeiro, faz o texto desaparecer.
      homeSubtitle.classList.add("is-fading");

      setTimeout(() => {
        // Alterna para o próximo título.
        titleIndex = (titleIndex + 1) % homeTitles.length;

        homeSubtitle.textContent = homeTitles[titleIndex];

        // Faz o novo texto reaparecer.
        homeSubtitle.classList.remove("is-fading");
      }, 350);

    }, 4500);
  }
