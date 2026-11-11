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

    navToggle.setAttribute("aria-expanded", String(open));

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
  "Bacharel em Ciência da Computação",
  "Criando soluções para problemas reais",
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

// =========================================
// V1.5 — DIGITAÇÃO NATURAL DO BLOCO SOBRE MIM
// =========================================

const codeEditor = document.querySelector(".editor_body");

const typingReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

if (
  codeEditor &&
  !typingReducedMotion.matches &&
  "IntersectionObserver" in window
) {
  const typingParts = [];

  // Guarda o texto original, preservando as cores do código.
  codeEditor.querySelectorAll("p").forEach((line) => {
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode;

      // Não anima os números das linhas.
      if (node.parentElement.closest(".code_line")) continue;

      const originalText = node.nodeValue.replace(/\s+/g, " ");

      if (!originalText.trim()) continue;

      node.nodeValue = "";

      typingParts.push({
        node,
        text: originalText,
        line,
      });
    }
  });

  const typingObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;

      typingObserver.disconnect();

      let partIndex = 0;
      let charIndex = 0;
      let activeLine = null;

      function typeNextChar() {
        // Pausa quando a aba não está visível.
        if (document.hidden) {
          setTimeout(typeNextChar, 250);
          return;
        }

        // Respeita a preferência por movimento reduzido.
        if (typingReducedMotion.matches) {
          typingParts.forEach((part) => {
            part.node.nodeValue = part.text;
          });

          activeLine?.classList.remove("is-typing");
          return;
        }

        const part = typingParts[partIndex];

        // Terminou: mantém o cursor piscando na última linha.

        // Terminou: ativa o piscar na última linha.
        if (!part) {
          activeLine?.classList.add("is-complete");
          return;
        }

        // Move o cursor para a linha atual.
        if (activeLine !== part.line) {
          activeLine?.classList.remove("is-typing");

          activeLine = part.line;
          activeLine.classList.add("is-typing");
        }

        // Digita o próximo caractere.
        const char = part.text[charIndex];

        part.node.nodeValue += char;
        charIndex++;

        // Varia a velocidade para simular digitação humana.
        let delay = 80 + Math.random() * 65;

        // Pequena pausa após pontuação.
        if (/[.,;:!?]/.test(char)) {
          delay += 180;
        }

        // Passa para o próximo trecho.
        if (charIndex >= part.text.length) {
          partIndex++;
          charIndex = 0;

          // Pausa ao mudar de linha.
          const nextPart = typingParts[partIndex];

          if (nextPart && nextPart.line !== part.line) {
            delay += 280;
          }
        }

        // Agenda o próximo caractere.
        setTimeout(typeNextChar, delay);
      }

      typeNextChar();
    },
    { threshold: 0.2 },
  );

  typingObserver.observe(codeEditor);
}

// =========================================
// V1.5 — REVELAR ELEMENTOS AO ROLAR
// =========================================

const revealElements = document.querySelectorAll(
  // Home
  ".home_social, " +
    ".home_img, " +
    ".home_data, " +
    // Demais seções
    ".section_title, " +
    ".section_subtitle, " +
    ".about_visual, " +
    ".about_data, " +
    ".portifolio_container, " +
    ".contato_container",
);

const revealReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

if (!revealReducedMotion.matches && "IntersectionObserver" in window) {
  // Prepara os elementos que receberão a animação.
  revealElements.forEach((element) => {
    element.classList.add("reveal-item");
  });

  // Observa quando os elementos entram na tela.

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Entrou na tela: aparece.
          entry.target.classList.add("is-visible");
        } else {
          // Saiu da tela: prepara para aparecer novamente.
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -24px 0px",
    },
  );

  // Prepara os elementos antes da animação inicial.
  document.body.classList.add("reveal-ready", "reveal-initializing");

  // Aguarda o navegador preparar o estado inicial.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove("reveal-initializing");

      // Inicia a observação dos elementos.
      revealElements.forEach((element) => {
        revealObserver.observe(element);
      });
    });
  });
}
