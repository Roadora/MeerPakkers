(function () {
  'use strict';

  const dataPaths = {
    providers: '../../data/provider-affiliate-status.json',
    deals: '../../data/deals.json',
    affiliateLinks: '../../data/affiliate-links.json'
  };

  const statusLabels = {
    not_applied: 'Nog aanvragen',
    applied: 'Aangevraagd',
    pending: 'In behandeling',
    approved: 'Goedgekeurd',
    live: 'Live',
    active: 'Actief',
    placeholder: 'Placeholder',
    expired: 'Verlopen'
  };

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = String(value);
  }

  function badge(status) {
    const safeStatus = status || 'placeholder';
    const label = statusLabels[safeStatus] || safeStatus;
    return `<span class="mp-admin-badge is-${escapeHtml(safeStatus)}">${escapeHtml(label)}</span>`;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalizeCategory(category) {
    return String(category || '').replace('-', ' & ');
  }

  async function loadJson(path) {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Kon ${path} niet laden`);
    return response.json();
  }

  function renderProviders(providers, deals, currentFilter) {
    const target = document.getElementById('providerRows');
    if (!target) return;

    const dealCountByProvider = deals.reduce((map, deal) => {
      const providerId = deal.providerId || deal.provider || 'onbekend';
      map.set(providerId, (map.get(providerId) || 0) + 1);
      return map;
    }, new Map());

    const filtered = providers.filter((provider) => {
      if (currentFilter === 'all') return true;
      return provider.applicationStatus === currentFilter || provider.affiliateStatus === currentFilter;
    });

    if (!filtered.length) {
      target.innerHTML = '<tr><td colspan="7">Geen providers gevonden voor dit filter.</td></tr>';
      return;
    }

    target.innerHTML = filtered.map((provider) => {
      const categories = Array.isArray(provider.categories) ? provider.categories.map(normalizeCategory).join(', ') : '';
      const count = dealCountByProvider.get(provider.providerId) || 0;
      return `
        <tr>
          <td><strong>${escapeHtml(provider.provider || provider.providerId)}</strong><br><small>${escapeHtml(provider.providerId)}</small></td>
          <td>${escapeHtml(categories)}</td>
          <td>${escapeHtml(provider.affiliateNetwork || 'placeholder')}</td>
          <td>${badge(provider.applicationStatus)}</td>
          <td>${badge(provider.affiliateStatus)}</td>
          <td>${count}</td>
          <td>${escapeHtml(provider.adminNotes || '—')}</td>
        </tr>
      `;
    }).join('');
  }

  function renderDeals(deals, affiliateLinks) {
    const target = document.getElementById('dealRows');
    if (!target) return;

    const linkByDeal = affiliateLinks.reduce((map, link) => {
      map.set(link.dealId, link);
      return map;
    }, new Map());

    target.innerHTML = deals.map((deal) => {
      const link = linkByDeal.get(deal.id) || {};
      const finalUrl = link.finalUrl || deal.affiliateUrl || deal.url || '—';
      return `
        <tr>
          <td><strong>${escapeHtml(deal.title || deal.id)}</strong><br><small>${escapeHtml(deal.id)}</small></td>
          <td>${escapeHtml(deal.provider || deal.providerId)}</td>
          <td>${escapeHtml(normalizeCategory(deal.category))}</td>
          <td>${badge(link.status || deal.dealStatus || 'placeholder')}</td>
          <td>${escapeHtml(link.network || deal.network || 'placeholder')}</td>
          <td><div class="mp-admin-url" title="${escapeHtml(finalUrl)}">${escapeHtml(finalUrl)}</div></td>
        </tr>
      `;
    }).join('');
  }

  function bindFilters(providers, deals) {
    const buttons = document.querySelectorAll('[data-filter]');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        renderProviders(providers, deals, button.dataset.filter || 'all');
      });
    });
  }

  async function init() {
    try {
      const [providers, deals, affiliateLinks] = await Promise.all([
        loadJson(dataPaths.providers),
        loadJson(dataPaths.deals),
        loadJson(dataPaths.affiliateLinks)
      ]);

      const liveStatuses = new Set(['live', 'approved', 'active']);
      const liveCount = affiliateLinks.filter((link) => liveStatuses.has(link.status)).length;
      const placeholderCount = affiliateLinks.filter((link) => !liveStatuses.has(link.status)).length;

      setText('providerCount', providers.length);
      setText('dealCount', deals.length);
      setText('liveCount', liveCount);
      setText('placeholderCount', placeholderCount);

      renderProviders(providers, deals, 'all');
      renderDeals(deals, affiliateLinks);
      bindFilters(providers, deals);
    } catch (error) {
      const providerRows = document.getElementById('providerRows');
      const dealRows = document.getElementById('dealRows');
      const message = `Dashboard kon niet laden: ${escapeHtml(error.message)}`;
      if (providerRows) providerRows.innerHTML = `<tr><td colspan="7">${message}</td></tr>`;
      if (dealRows) dealRows.innerHTML = `<tr><td colspan="6">${message}</td></tr>`;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
}());
