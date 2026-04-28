const navTemplate = document.createElement('template');

navTemplate.innerHTML = `
  <link rel="stylesheet" href="/static/css/webDashboard.css">
  <script src="/static/js/templates/web-nav.js" defer></script>
  <script src="/static/js/templates/web-hero.js" defer></script>
  <script src="/static/js/templates/web-footer.js" defer></script>
  <nav>
      <div class="nav-container">
          <a data-route="homepage" class="logo">Benschi</a>
          <ul class="nav-links">
              <li><a data-route="atm">ATM10</a></li>
              <li><a data-route="notes">Notizen</a></li>
              <li><a data-route="coding">Coding</a></li>
          </ul>
          <div class="nav-bottom">
              <a data-route="calendar" class="cyber-button">Kalendar</a>
          </div>
          <button class="mobile-menu-button" id="mobileMenuBtn">
              <div class="hamburger">
                  <span></span><span></span><span></span>
              </div>
          </button>
      </div>
  </nav>
`;

class WebNav extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(navTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    const btn = this.shadowRoot.getElementById('mobileMenuBtn');
    btn?.addEventListener('click', () => {
       this.shadowRoot.querySelector('.nav-links').classList.toggle('active');
    });
  }
}

customElements.define('web-nav', WebNav);