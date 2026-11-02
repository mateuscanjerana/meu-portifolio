<div align="center">

# Portfólio MC

### Mateus Canjerana · Desenvolvedor Web

Portfólio pessoal desenvolvido com **HTML5, CSS3 e JavaScript puro**, com foco em interfaces responsivas, acessibilidade, personalização visual e aprendizado contínuo.

[**Acessar o portfólio**](https://mateuscanjerana.github.io/) · [**GitHub**](https://github.com/MateusCanjerana) · [**LinkedIn**](https://www.linkedin.com/in/mateus-canjerana-bb62bb226/)

**Versão atual: V1.3**

</div>

---

## Sobre o projeto

Criei este portfólio para apresentar minha trajetória em Ciência da Computação, reunir projetos e praticar fundamentos de desenvolvimento web. O objetivo é manter uma interface clara e uma base de código organizada, evoluindo o site gradualmente a cada versão.

A identidade visual utiliza o monograma **MC**, uma paleta personalizável e uma apresentação que se adapta a diferentes tamanhos de tela.

## Funcionalidades

- **Layout responsivo:** adaptação para smartphones, tablets e desktops, com navegação inferior em telas menores.
- **Modo claro/escuro:** alternância manual, com preferência salva no `localStorage`.
- **Paletas de destaque:** preto, azul, vermelho e verde, aplicadas com variáveis CSS.
- **Carrossel de projetos:** implementação própria em JavaScript, com loop infinito, indicadores e navegação por toque, mouse e teclado. As setas são ocultadas em telas menores.
- **Modal de projetos:** detalhes abertos com o elemento nativo `<dialog>`, sem biblioteca de modal.
- **Navegação por âncoras:** rolagem suave, indicação da seção ativa e botão para voltar ao topo.
- **Cuidados com dispositivos móveis:** dimensionamento dos componentes e suporte à área segura inferior do iPhone (`viewport-fit=cover` e `env(safe-area-inset-bottom)`).
- **Preferências persistentes:** armazenamento local da paleta e do modo de aparência escolhidos.

> A preferência automática de aparência do sistema operacional **ainda não está implementada**; está planejada para uma versão futura.

## Tecnologias utilizadas

| Tecnologia | Utilização |
| --- | --- |
| **HTML5** | Estrutura semântica das seções, navegação e modal |
| **CSS3** | Grid, Flexbox, media queries, variáveis, temas e transições |
| **JavaScript** | Manipulação do DOM, eventos, carrossel e comportamento do menu |
| **LocalStorage** | Persistência das preferências visuais |
| **Unicons** | Ícones da interface |
| **Google Fonts** | Fonte Poppins |

O projeto não utiliza frameworks de interface nem bibliotecas de carrossel. A fonte e os ícones são recursos externos.

## Projetos em destaque

| Projeto | Descrição | Situação |
| --- | --- | --- |
| **Login Page** | Interface de login para praticar formulários e interações | [Ver demonstração](https://mateuscanjerana.github.io/login-page/) |
| **Relógio Analógico** | Relógio desenvolvido com HTML, CSS e JavaScript | [Ver demonstração](https://mateuscanjerana.github.io/relogioanalogico-js/) |
| **MyStorage** | Sistema CRUD de controle de produtos e estoque com PHP e MySQL | Sem demonstração pública |
| **DocFusion** | Ferramenta planejada para organizar e mesclar documentos PDF | Em desenvolvimento |

As imagens exibidas nos cards podem ser **ilustrações conceituais** e não representam necessariamente telas de funcionalidades já publicadas.

## Estrutura do projeto

```text
.
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── script.js
    │   └── carousel.js
    ├── img/
    │   ├── mc-transparent.png
    │   ├── favicon.png
    │   ├── login-preview.svg
    │   ├── clock-preview.svg
    │   ├── mystorage-preview.svg
    │   └── docfusion-preview.svg
    └── pdf/
        └── CV-mateus-canjerana.pdf  # Adicionar este arquivo
```

**Responsabilidades dos scripts:**

- `script.js`: navegação, menu mobile, scroll, tema e paletas de cores.
- `carousel.js`: carrossel, gestos de arraste, paginação e modal dos projetos.

## Executar localmente

1. Baixe ou clone este repositório.
2. Abra a pasta no **Visual Studio Code**.
3. Inicie `index.html` com a extensão **Live Server**.
4. Acesse o endereço local informado pela extensão, normalmente `http://127.0.0.1:5500`.

Também é possível executar um servidor local com Python:

```bash
python -m http.server 5500
```

Não é necessário instalar Node.js nem executar `npm install`.

## Responsividade e testes

O layout foi preparado para funcionar em diferentes resoluções. Para conferir alterações, utilize o DevTools do Chrome (`F12` → modo dispositivo) e teste especialmente **320px, 375px, 393px, 430px, 768px e desktop**.

No iPhone, a barra de gestos exige atenção especial: o menu inferior utiliza a área segura disponibilizada pelo navegador. O resultado deve ser conferido em um aparelho real, pois as barras do Safari e do Chrome no iOS podem mudar de tamanho conforme a navegação.

## Histórico e planejamento

### V1.3 — Responsividade e manutenção

- Revisão dos espaçamentos e alinhamentos das seções.
- Ajustes no posicionamento das âncoras de navegação.
- Melhoria da largura dos cards em telas pequenas.
- Remoção das setas do carrossel no tablet e no celular.
- Revisão do menu mobile, dos controles de tema e do botão **Voltar ao topo**.
- Limpeza de componentes e arquivos herdados de versões antigas.
- Proteção da navegação inferior em relação à área segura do iPhone.

### V1.4 — Personalização e carrossel *(planejada)*

- Aplicar a cor da paleta ao botão do WhatsApp.
- Adicionar rolagem automática ao carrossel, com opção de pausar e retomar.
- Seguir o modo claro/escuro do sistema na primeira visita; depois, respeitar uma escolha manual gravada no `localStorage`.

### V1.5 — Microinterações *(planejada)*

- Refinar as transições dos botões de tema ao abrir/fechar o menu mobile.
- Criar animação de digitação no painel `sobre-mim.js`.
- Avaliar animações discretas de entrada e transições, respeitando `prefers-reduced-motion`.

> O planejamento descreve intenções futuras; não significa que esses recursos já estejam disponíveis.

## Publicação

O site pode ser hospedado gratuitamente no **GitHub Pages**. Mantenha o `index.html` na raiz do repositório e configure a publicação em **Settings → Pages**, selecionando a branch e a pasta correspondentes à sua estrutura.

## Observação sobre o currículo

O botão **Download CV** utiliza o caminho `assets/pdf/CV-mateus-canjerana.pdf`. Adicione o PDF nesse local antes de publicar, caso queira disponibilizar o currículo para download.

## Contato

Você pode acompanhar meus projetos e entrar em contato pelos links abaixo:

- [GitHub — @MateusCanjerana](https://github.com/MateusCanjerana)
- [LinkedIn — Mateus Canjerana](https://www.linkedin.com/in/mateus-canjerana-bb62bb226/)
- [Portfólio online](https://mateuscanjerana.github.io/)

---

<div align="center">

Desenvolvido por **Mateus Canjerana** · 2026

</div>
