/* site.js — consentimiento de cookies + Google Analytics 4 + eventos de conversión
   ⚠ Sustituye GA_ID por tu ID de medición real (formato G-XXXXXXXXXX).
   Mientras siga el valor de ejemplo, Analytics NO se carga. */
(function () {
  var GA_ID = 'G-XXXXXXXXXX';
  var KEY = 'fb_cookie_consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });

  var loaded = false;
  function loadGA() {
    if (loaded || !GA_ID || GA_ID.indexOf('XXXX') !== -1) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }
  function grant() { gtag('consent', 'update', { analytics_storage: 'granted' }); loadGA(); }

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var css = '.ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:300;max-width:520px;background:#141414;color:#f7f5f2;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:18px 20px;font:14px/1.55 Inter,sans-serif;box-shadow:0 20px 50px -12px rgba(0,0,0,.7)}' +
    '.ck p{margin:0 0 14px;color:#cfcfcf}.ck a{color:#f7f5f2;text-decoration:underline}' +
    '.ck-row{display:flex;gap:10px;flex-wrap:wrap}' +
    '.ck button{font:700 13px Inter,sans-serif;padding:11px 20px;border-radius:999px;cursor:pointer;border:1px solid rgba(255,255,255,.25);background:transparent;color:#f7f5f2}' +
    '.ck button.ok{background:#e0264f;border-color:#e0264f}' +
    '@media(max-width:640px){.ck{bottom:76px}}';

  function banner() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div');
    d.className = 'ck'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Aviso de cookies');
    d.innerHTML = '<p>Uso cookies analíticas (Google Analytics) para entender qué partes de la web funcionan y mejorarla. Solo se activan si las aceptas. Más info en la <a href="privacidad.html#cookies">Política de Privacidad</a>.</p>' +
      '<div class="ck-row"><button type="button" class="ok">Aceptar</button><button type="button" class="no">Rechazar</button></div>';
    d.querySelector('.ok').onclick = function () { set('granted'); grant(); d.remove(); };
    d.querySelector('.no').onclick = function () { set('denied'); d.remove(); };
    document.body.appendChild(d);
  }

  function track(name, params) { try { gtag('event', name, params || {}); } catch (e) {} }
  window.fbTrack = track;

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (a) {
      var h = a.getAttribute('href') || '';
      if (h.indexOf('wa.me') !== -1) track('click_whatsapp', { link_url: h, page: location.pathname });
      else if (h.indexOf('tel:') === 0) track('click_llamar', { page: location.pathname });
      else if (h.indexOf('mailto:') === 0) track('click_email', { page: location.pathname });
    }
    var c = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (c) { e.preventDefault(); try { localStorage.removeItem(KEY); } catch (x) {} banner(); }
  });

  function init() {
    var v = get();
    if (v === 'granted') grant();
    else if (v !== 'denied') banner();
    if (document.body && document.body.hasAttribute('data-thanks')) {
      var f = new URLSearchParams(location.search).get('f') || 'contacto';
      track('generate_lead', { form: f });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
