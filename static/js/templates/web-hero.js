const heroTemplate = document.createElement('template');
heroTemplate.innerHTML = `
  <link rel="stylesheet" href="/static/css/webDashboard.css">
  <script src="/static/js/templates/web-nav.js" defer></script>
  <script src="/static/js/templates/web-hero.js" defer></script>
  <script src="/static/js/templates/web-footer.js" defer></script>
  <section class="hero">
      <div class="hero-container">
          <h1 class="hero-title">
              <span class="hero-nexus">Ben</span><span class="hero-flow">schi</span>
          </h1>

          <p class="hero-subtitle" id="subtitle-text"></p>

          <div class="hero-buttons" id="button-container">
              <a class="btn-primary" data-route="atm">ATM10</a>
              <a class="btn-secondary" data-route="others">Anderes</a>
          </div>
      </div>
  </section>
`;

class WebHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(heroTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    const subtitle = this.getAttribute('subtitle');
    const showButtons = this.getAttribute('show-buttons');

    const subtitleEl = this.shadowRoot.getElementById('subtitle-text');
    const buttonEl = this.shadowRoot.getElementById('button-container');

    if (subtitle) {
      subtitleEl.textContent = subtitle;
    } else {
      subtitleEl.style.display = 'none';
    }

    if (showButtons !== 'true') {
      buttonEl.style.display = 'none';
    }
  }
}

customElements.define('web-hero', WebHero);