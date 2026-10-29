# Portfólio reformulado — V1.2

Versão inicial da reformulação do portfólio de Mateus Canjerana, utilizando **HTML, CSS e JavaScript puro**. Esta pasta funciona como um projeto independente: você pode copiar para outra branch do repositório e editar no VS Code.

## O que foi preservado

- As seções: **Início (`#home`), Sobre (`#about`), Portfólio (`#portifolio`), Contato (`#contato`) e Footer**.
- As classes principais de cada seção (`.home_*`, `.about_*`, `.portifolio_*`, `.contato_*`, `.nav_*`).
- Os tokens CSS do projeto original, como `--first-color`, `--body-color`, `--title-color`, `--hue-color`, `--mb-1` e `--header-height`. Alguns valores foram revisados para acomodar a nova apresentação.
- Os links de LinkedIn, GitHub, Instagram, WhatsApp e e-mail informados no HTML original.
- O funcionamento do menu responsivo, destaque de seção ativa e botão de retornar ao topo.

## O que mudou

1. **Fundo principal** em preto/grafite, mantendo o modo claro/escuro.
2. **Paleta independente**: preto, azul, avermelhado e verde, em um controle perto do botão claro/escuro.
3. **Preferências salvas** em `localStorage` nas chaves `selected-theme` e `selected-palette`.
4. **Identidade minimalista na Home:** monograma MC em PNG transparente, sem bordas, molduras ou círculos. Em modo claro o logotipo ganha automaticamente cor escura por CSS. A seção Sobre mantém o editor de código; Contato recebeu tipografia em vez de repetir a marca.
5. **Carrossel puro** baseado no projeto anterior, com 3 cards por vez no desktop, 2 no tablet e 1 no celular. Controles por setas (ocultos no tablet), indicadores, teclado, arraste e loop infinito.
6. **Modal nativo `<dialog>`** com visual glassmorphism e imagem/informações lado a lado no desktop, empilhadas no mobile.
7. **Ícones sem biblioteca**: pequenos caracteres de fallback estilizados por CSS, evitando dependência do Unicons.
8. `modal.js` antigo **não é utilizado**: os modais antigos faziam referência a classes `.services_*` que não estão presentes neste HTML. O modal do portfólio está integrado a `carousel.js`.

## Pastas

```text
portfolio_reformulado_v1/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── script.js       # Menu, scroll e temas
    │   └── carousel.js     # Cards, loop, swipe e modal
    ├── img/
    │   ├── mc-transparent.png   # Monograma original com fundo removido
    │   ├── favicon.png          # Versão para a aba do navegador
    │   ├── login-preview.svg
    │   ├── clock-preview.svg
    │   ├── portfolio-preview.svg
    │   ├── mystorage-preview.svg
    │   └── docfusion-preview.svg
    └── pdf/
        └── [adicione aqui o seu currículo real]
```

## Executar

Abra a pasta no VS Code, instale a extensão **Live Server** caso ainda não tenha e clique com o botão direito em `index.html` → **Open with Live Server**. O arquivo também pode abrir diretamente no navegador. Não é necessário instalar Node.js ou pacotes.

**Importante:** o currículo PDF original não foi enviado. Antes de publicar, copie seu arquivo existente para `assets/pdf/CV-mateus-canjerana.pdf` (ou ajuste o link no `index.html`). Sem ele, apenas o botão de download do currículo não funcionará.

A fonte Poppins é carregada do Google Fonts quando há internet; fontes locais de reserva estão configuradas. O JavaScript do site não usa bibliotecas externas.

## Editar temas e background

Abra `assets/css/style.css`:

- `:root`: variáveis do modo claro e de tamanhos.
- `body.dark-theme`: cores de fundo e texto do modo escuro.
- `body[data-palette='blue'|'red'|'green'|'black']`: paletas disponíveis.
- `body.dark-theme[data-palette='black']`: contraste especial para paleta preta no modo escuro.
- `.home::before`: luz ambiente sutil no topo.

As preferências são controladas em `assets/js/script.js`, nas funções `setDarkMode` e `setPalette`.

## Alterar o carrossel

No `index.html`, vá para `<section class="portifolio section" id="portifolio">`. Cada `<article class="card portifolio_content">` é um projeto. Para adicionar um novo projeto, duplique esse bloco e altere:

- `data-details` (texto completo que aparece no modal);
- `<img src=... alt=...>` (thumb de proporção **16:9**);
- nome e descrição;
- link externo de demo, apenas **se houver**. Caso não exista, use `<span class="project_no_demo">Sem demo pública</span>`.

O JavaScript detecta os cards e cria automaticamente os indicadores. Não é preciso editar `carousel.js` para trocar títulos ou criar novos cards.

**Atenção aos projetos de demonstração:** os links originais de **Login Page** e **Relógio Analógico** foram mantidos. Os cards **MyStorage** (sem demo) e **DocFusion** (em desenvolvimento) têm imagens ilustrativas e descrições conservadoras. Verifique os textos antes de publicar e exclua qualquer projeto que você ainda não deseje apresentar.

As imagens SVG incluídas são **previews desenhados para esta versão**, não capturas reais dos sistemas. Se desejar, substitua seus `src` pelas imagens do projeto original (`LoginPage.png`, `RelogioAna.png`) após copiá-las para `assets/img/`.

## Histórico dos principais problemas corrigidos

- No código original, o `id="nav_close"` do HTML não correspondia ao `getElementById('nav-close')` do JavaScript.
- A regra `.home_container` apresentava valores `grid-template-columns: .5rf 3rf`, que não são unidades CSS válidas.
- O menu HTML continha `div` em uma posição incorreta dentro do `ul`; a hierarquia foi corrigida.
- O `@import` da fonte no CSS original estava com parâmetros corrompidos na cópia Markdown.
- `modal.js` antigo referenciava componentes de Serviços removidos do HTML.
- As classes do carrossel foram isoladas sob a seção Portfólio, evitando que o CSS de demonstração sobreponha o restante do site.

## Testes efetuados nesta entrega

- Sintaxe dos dois scripts verificada com `node --check`.
- Renderização em Chromium em três larguras: **1440px (desktop), 768px (tablet), 390px (celular)**.
- Sem erros de execução JavaScript nas três larguras verificadas.
- Sem overflow horizontal nas três larguras verificadas.
- Troca de paleta, alternância claro/escuro, abertura e fechamento de modal, carrossel avançando e menu mobile verificados por interação.
- Testes realizados em ambiente de visualização local; **o projeto ainda não foi publicado no seu domínio**.

## Fluxo sugerido de Git

```bash
git switch -c feat/portfolio-redesign-v1
# copie os arquivos da pasta para sua branch e teste localmente
git add .
git commit -m "feat: reformula portfolio com temas e carrossel sem biblioteca"
```

Não substitua arquivos da branch principal sem primeiro salvar suas alterações atuais.

## Ajustes da V1.2 — composição da marca

- Removidos o quadrado com fundo preto, as órbitas, os círculos decorativos e a sombra artificial em torno da imagem MC.
- `assets/img/mc-transparent.png`: monograma exportado com fundo transparente (preserva o desenho do arquivo aprovado).
- `.hero_identity` e `.hero_monogram`: novo enquadramento editorial na Home, usando respiro e uma discreta linha de identificação.
- `body:not(.dark-theme) .hero_monogram`: versão escura do símbolo no modo claro por CSS, sem duplicar a imagem.
- `.contato_signature`: tratamento tipográfico sem repetição do logotipo.
- `assets/img/favicon.png`: identidade na aba do navegador.

**Dica:** o tamanho da marca pode ser ajustado em `.hero_identity { width: min(100%, 495px) }` e a distância entre as colunas em `.home_content { gap: ... }`.
