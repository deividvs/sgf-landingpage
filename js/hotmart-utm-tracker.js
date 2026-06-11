/**
 * ============================================================================
 * HOTMART UTM TRACKER — Script Universal de Passagem de Parâmetros
 * ============================================================================
 *
 * O QUE ESSE SCRIPT FAZ:
 *   1. Captura UTMs da URL na primeira visita (utm_source, utm_medium, etc.)
 *   2. Salva em sessionStorage + cookie (atribuição persiste mesmo se o
 *      usuário navegar pelo site antes de comprar)
 *   3. Injeta automaticamente os parâmetros em TODOS os links de checkout
 *      Hotmart da página (pay.hotmart.com, hotmart.net.br, go.hotmart.com,
 *      checkout.hotmart.com)
 *   4. Atualiza dinamicamente: se botões forem adicionados depois (modais,
 *      carregamento dinâmico), eles também recebem os parâmetros
 *
 * AUTOR: Desenvolvido com Claude para Deivid Oliveira / Victor Darido
 * VERSÃO: 1.0
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // CONFIGURAÇÃO
  // ==========================================================================
  const CONFIG = {
    hotmartDomains: [
      'pay.hotmart.com',
      'hotmart.net.br',
      'go.hotmart.com',
      'checkout.hotmart.com',
      'hotmart.com'
    ],
    attributionDays: 30,
    storageKey: 'hm_utm_data',
    cookieKey: 'hm_utm_data',
    refreshInterval: 1500
  };

  // ==========================================================================
  // 1. CAPTURA E ARMAZENAMENTO DOS UTMs
  // ==========================================================================

  function getUTMsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const tracked = {};

    const utmKeys = [
      'utm_source', 'utm_medium', 'utm_campaign',
      'utm_content', 'utm_term', 'utm_id'
    ];

    const hotmartKeys = ['src', 'sck', 'xcod'];

    const platformKeys = [
      'fbclid',
      'gclid',
      'ttclid',
      'msclkid'
    ];

    [...utmKeys, ...hotmartKeys, ...platformKeys].forEach(function (key) {
      const value = params.get(key);
      if (value) tracked[key] = value;
    });

    return tracked;
  }

  function saveUTMs(data) {
    const payload = {
      data: data,
      timestamp: Date.now()
    };

    try {
      sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(payload));
    } catch (e) {}

    const expires = new Date();
    expires.setDate(expires.getDate() + CONFIG.attributionDays);
    document.cookie =
      CONFIG.cookieKey + '=' + encodeURIComponent(JSON.stringify(payload)) +
      '; expires=' + expires.toUTCString() +
      '; path=/; SameSite=Lax';
  }

  function loadStoredUTMs() {
    let payload = null;

    try {
      const stored = sessionStorage.getItem(CONFIG.storageKey);
      if (stored) payload = JSON.parse(stored);
    } catch (e) {}

    if (!payload) {
      const match = document.cookie.match(
        new RegExp('(^|;\\s*)' + CONFIG.cookieKey + '=([^;]+)')
      );
      if (match) {
        try {
          payload = JSON.parse(decodeURIComponent(match[2]));
        } catch (e) {}
      }
    }

    if (!payload || !payload.data) return {};

    const ageMs = Date.now() - (payload.timestamp || 0);
    const maxAgeMs = CONFIG.attributionDays * 24 * 60 * 60 * 1000;
    if (ageMs > maxAgeMs) return {};

    return payload.data;
  }

  function captureUTMs() {
    const fromURL = getUTMsFromURL();
    const stored = loadStoredUTMs();

    if (Object.keys(fromURL).length === 0 && Object.keys(stored).length === 0) {
      return {};
    }

    if (fromURL.utm_source || fromURL.fbclid || fromURL.gclid) {
      saveUTMs(fromURL);
      return fromURL;
    }

    return stored;
  }

  // ==========================================================================
  // 2. CONSTRUÇÃO DA STRING DE TRACKING PRO HOTMART
  // ==========================================================================

  function buildSCK(utms) {
    const parts = [
      utms.utm_source || 'direct',
      utms.utm_medium || 'none',
      utms.utm_campaign || 'none',
      utms.utm_content || 'none',
      utms.utm_term || 'none'
    ];

    return parts
      .join('|')
      .replace(/_/g, '-')
      .replace(/[^\w\-|.]/g, '-')
      .substring(0, 250);
  }

  function buildSRC(utms) {
    const value = utms.utm_campaign || utms.utm_source || 'direct';
    return value.replace(/_/g, '-').replace(/[^\w\-|.]/g, '-').substring(0, 30);
  }

  // ==========================================================================
  // 3. INJEÇÃO NOS LINKS DO CHECKOUT
  // ==========================================================================

  function isHotmartCheckout(url) {
    if (!url || typeof url !== 'string') return false;
    return CONFIG.hotmartDomains.some(function (domain) {
      return url.indexOf(domain) !== -1;
    });
  }

  function appendParams(url, params) {
    try {
      const urlObj = new URL(url, window.location.origin);

      Object.keys(params).forEach(function (key) {
        if (!urlObj.searchParams.has(key) && params[key]) {
          urlObj.searchParams.set(key, params[key]);
        }
      });

      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

  function enrichHotmartLinks(utms) {
    if (Object.keys(utms).length === 0) return;

    const trackingParams = {
      sck: buildSCK(utms),
      src: buildSRC(utms),
      utm_source: utms.utm_source,
      utm_medium: utms.utm_medium,
      utm_campaign: utms.utm_campaign,
      utm_content: utms.utm_content,
      utm_term: utms.utm_term,
      utm_id: utms.utm_id
    };

    Object.keys(trackingParams).forEach(function (k) {
      if (!trackingParams[k]) delete trackingParams[k];
    });

    const links = document.querySelectorAll('a[href]');

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!isHotmartCheckout(href)) return;

      if (link.dataset.hmTracked === '1') return;

      const newHref = appendParams(href, trackingParams);
      link.setAttribute('href', newHref);
      link.dataset.hmTracked = '1';
    });
  }

  // ==========================================================================
  // 4. INICIALIZAÇÃO + OBSERVADOR DE MUDANÇAS NA PÁGINA
  // ==========================================================================

  function init() {
    const utms = captureUTMs();

    enrichHotmartLinks(utms);

    setInterval(function () {
      enrichHotmartLinks(utms);
    }, CONFIG.refreshInterval);

    if (window.MutationObserver) {
      var observer = new MutationObserver(function () {
        enrichHotmartLinks(utms);
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (isHotmartCheckout(href) && link.dataset.hmTracked !== '1') {
        enrichHotmartLinks(utms);
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
