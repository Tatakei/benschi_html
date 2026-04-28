const footerTemplate = document.createElement('template');
footerTemplate.innerHTML = `
  <link rel="stylesheet" href="/static/css/webDashboard.css">
  <script src="/static/js/templates/web-nav.js" defer></script>
  <script src="/static/js/templates/web-hero.js" defer></script>
  <script src="/static/js/templates/web-footer.js" defer></script>
  <footer class="footer">
      <div class="footer-content">
          <div class="footer-bottom">
              <p>&copy; <span id="year"></span> <slot>Benschi :3</slot></p>
          </div>
      </div>
  </footer>
`;

class WebFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(footerTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    const yearSpan = this.shadowRoot.getElementById('year');
    yearSpan.textContent = new Date().getFullYear();
  }
}

customElements.define('web-footer', WebFooter);