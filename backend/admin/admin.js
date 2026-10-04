'use strict';

// Modhesh admin page: manage stores, offers and the app settings the mobile
// app reads from /api/v1/app-config. Talks to the /api/admin endpoints.

const SECTORS = ['HoReCa', 'Retail', 'Wholesale'];
const TOKEN_KEY = 'modhesh-admin-token';

const state = {
  token: null,
  stores: [],
  offers: [],
  settings: {},
  slides: [],
  sectorImages: {},
  imageFields: {},
  imageUrlSample: '/api/images/file/KEY',
};

const $ = (selector, root = document) => root.querySelector(selector);

const esc = value =>
  String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);

// ---------- storage / API ----------

const readToken = () => {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
};
const writeToken = token => {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch { /* storage unavailable: token stays in memory */ }
};

class ApiError extends Error {}

async function api(method, path, body) {
  const headers = {};
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const isForm = body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const response = await fetch(`/api/admin${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  if (response.status === 401 && path !== '/login') {
    signOut('Your session expired. Please sign in again.');
    throw new ApiError('Session expired');
  }
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data.message) {
        message = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      }
    } catch { /* not JSON */ }
    throw new ApiError(message);
  }
  return response.status === 204 ? null : response.json();
}

const uploadImage = async file => {
  const form = new FormData();
  form.append('file', file);
  return api('POST', '/uploads', form);
};

const previewUrl = key => {
  if (!key) return '';
  if (/^https?:\/\//i.test(key)) return key;
  const encoded = key.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
  return state.imageUrlSample.replace('KEY', encoded);
};

// ---------- UI helpers ----------

let toastTimer;
function toast(message, isError = false) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.toggle('error', isError);
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
}

const thumb = (url, alt = '') =>
  url
    ? `<img class="thumb" src="${esc(url)}" alt="${esc(alt)}" loading="lazy" />`
    : '<div class="thumb empty">No image</div>';

const stars = rate =>
  rate ? `<span class="stars" title="${rate} / 5">${'★'.repeat(rate)}${'☆'.repeat(5 - rate)}</span>` : '—';

const isExpired = date => date && date < new Date().toISOString().slice(0, 10);

function confirmDelete(text) {
  const dialog = $('#confirm');
  $('#confirm-text').textContent = text;
  dialog.returnValue = '';
  dialog.showModal();
  return new Promise(resolve => {
    dialog.addEventListener('close', () => resolve(dialog.returnValue === 'ok'), { once: true });
  });
}

// An image picker bound to a key: preview, upload, clear.
function imageField(container, { label, value, onChange, extraButtons = [] }) {
  let current = value || '';
  const render = () => {
    container.innerHTML = `
      ${label ? `<div class="field-label">${esc(label)}</div>` : ''}
      <div class="image-row">
        ${thumb(previewUrl(current))}
        <div class="image-actions">
          <div class="key">${current ? esc(current) : 'No image selected'}</div>
          <div class="buttons">
            <label class="btn secondary small">${current ? 'Replace' : 'Upload'}
              <input type="file" accept="image/*" hidden />
            </label>
            ${extraButtons.map((b, i) => `<button type="button" class="btn ghost small" data-extra="${i}">${esc(b.label)}</button>`).join('')}
            ${current ? '<button type="button" class="btn ghost small" data-clear>Remove</button>' : ''}
          </div>
        </div>
      </div>`;
    $('input[type=file]', container).addEventListener('change', async event => {
      const file = event.target.files[0];
      if (!file) return;
      const keyEl = $('.key', container);
      keyEl.textContent = 'Uploading…';
      try {
        const { key } = await uploadImage(file);
        set(key);
        toast('Image uploaded');
      } catch (err) {
        keyEl.textContent = current || 'No image selected';
        toast(err.message, true);
      }
    });
    const clear = $('[data-clear]', container);
    if (clear) clear.addEventListener('click', () => set(''));
    container.querySelectorAll('[data-extra]').forEach(btn =>
      btn.addEventListener('click', () => {
        const next = extraButtons[Number(btn.dataset.extra)].getValue();
        if (next) set(next);
      }),
    );
  };
  const set = next => {
    current = next;
    onChange?.(next);
    render();
  };
  render();
  return { get: () => current, set };
}

// ---------- auth ----------

function showView(signedIn) {
  $('#login-view').hidden = signedIn;
  $('#app-view').hidden = !signedIn;
}

function signOut(message) {
  state.token = null;
  writeToken(null);
  showView(false);
  if (message) {
    const error = $('#login-error');
    error.textContent = message;
    error.hidden = false;
  }
}

$('#login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.target;
  const error = $('#login-error');
  const button = $('button', form);
  error.hidden = true;
  button.disabled = true;
  try {
    const { token } = await api('POST', '/login', {
      username: form.username.value.trim(),
      password: form.password.value,
    });
    state.token = token;
    writeToken(token);
    form.reset();
    await startApp();
  } catch (err) {
    error.textContent = err.message;
    error.hidden = false;
  } finally {
    button.disabled = false;
  }
});

$('#logout').addEventListener('click', () => signOut());

// ---------- tabs ----------

const TABS = ['offers', 'stores', 'settings'];

function openTab(name) {
  const tab = TABS.includes(name) ? name : 'offers';
  document.querySelectorAll('.tab').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.tab === tab),
  );
  document.querySelectorAll('[data-panel]').forEach(panel => {
    panel.hidden = panel.dataset.panel !== tab;
  });
  if (location.hash !== `#${tab}`) history.replaceState(null, '', `#${tab}`);
}

document.querySelectorAll('.tab').forEach(btn =>
  btn.addEventListener('click', () => openTab(btn.dataset.tab)),
);

// ---------- stores ----------

async function loadStores() {
  state.stores = await api('GET', '/stores');
  renderStores();
  renderStoreFilter();
}

function renderStores() {
  const query = $('#stores-search').value.trim().toLowerCase();
  const rows = state.stores.filter(s =>
    [s.storeName, s.storeType, s.address].some(v => v && v.toLowerCase().includes(query)),
  );
  $('#stores-count').textContent = `(${state.stores.length})`;
  $('#stores-body').innerHTML = rows.length
    ? rows.map(s => `
      <tr>
        <td>${thumb(s.logoUrl, s.storeName)}</td>
        <td><strong>${esc(s.storeName)}</strong></td>
        <td>${s.storeType ? `<span class="pill">${esc(s.storeType)}</span>` : '—'}</td>
        <td>${esc(s.address) || '—'}</td>
        <td>${stars(s.storeRate)}</td>
        <td>${s.activeOffers ?? 0}</td>
        <td class="actions">
          <button class="btn ghost small" data-edit-store="${s.id}">Edit</button>
          <button class="btn danger small" data-delete-store="${s.id}">Delete</button>
        </td>
      </tr>`).join('')
    : `<tr class="empty-row"><td colspan="7">${state.stores.length ? 'No stores match your search.' : 'No stores yet. Add your first store.'}</td></tr>`;
}

function renderStoreFilter() {
  const select = $('#offers-store-filter');
  const selected = select.value;
  select.innerHTML = '<option value="">All stores</option>' +
    state.stores.map(s => `<option value="${s.id}">${esc(s.storeName)}</option>`).join('');
  select.value = state.stores.some(s => String(s.id) === selected) ? selected : '';
}

$('#stores-search').addEventListener('input', renderStores);
$('#add-store').addEventListener('click', () => openStoreEditor());

$('#stores-body').addEventListener('click', async event => {
  const editId = event.target.dataset.editStore;
  const deleteId = event.target.dataset.deleteStore;
  if (editId) openStoreEditor(state.stores.find(s => String(s.id) === editId));
  if (deleteId) {
    const store = state.stores.find(s => String(s.id) === deleteId);
    const offers = store.activeOffers ?? 0;
    const ok = await confirmDelete(
      `Delete "${store.storeName}"${offers ? ` and its ${offers} offer${offers === 1 ? '' : 's'}` : ''}? This cannot be undone.`,
    );
    if (!ok) return;
    try {
      await api('DELETE', `/stores/${store.id}`);
      toast('Store deleted');
      await Promise.all([loadStores(), loadOffers()]);
    } catch (err) {
      toast(err.message, true);
    }
  }
});

// ---------- offers ----------

async function loadOffers() {
  state.offers = await api('GET', '/offers');
  renderOffers();
}

function renderOffers() {
  const query = $('#offers-search').value.trim().toLowerCase();
  const storeId = $('#offers-store-filter').value;
  const rows = state.offers.filter(o =>
    (!storeId || String(o.storeId) === storeId) &&
    [o.offerDescription, o.storeName, o.storeType].some(v => v && v.toLowerCase().includes(query)),
  );
  $('#offers-count').textContent = `(${state.offers.length})`;
  $('#offers-body').innerHTML = rows.length
    ? rows.map(o => `
      <tr>
        <td>${thumb(o.imageUrl, o.offerDescription)}</td>
        <td><strong>${esc(o.offerDescription)}</strong><div class="hint">Added ${esc(o.creationDate) || '—'}</div></td>
        <td>${esc(o.storeName)}</td>
        <td>${o.storeType ? `<span class="pill">${esc(o.storeType)}</span>` : '—'}</td>
        <td>${o.expireDate ? `<span class="pill ${isExpired(o.expireDate) ? 'expired' : ''}">${esc(o.expireDate)}${isExpired(o.expireDate) ? ' · expired' : ''}</span>` : '—'}</td>
        <td class="actions">
          <button class="btn ghost small" data-edit-offer="${o.id}">Edit</button>
          <button class="btn danger small" data-delete-offer="${o.id}">Delete</button>
        </td>
      </tr>`).join('')
    : `<tr class="empty-row"><td colspan="6">${state.offers.length ? 'No offers match your filters.' : 'No offers yet.'}</td></tr>`;
}

$('#offers-search').addEventListener('input', renderOffers);
$('#offers-store-filter').addEventListener('change', renderOffers);
$('#add-offer').addEventListener('click', () => {
  if (!state.stores.length) {
    toast('Add a store first', true);
    openTab('stores');
    return;
  }
  openOfferEditor();
});

$('#offers-body').addEventListener('click', async event => {
  const editId = event.target.dataset.editOffer;
  const deleteId = event.target.dataset.deleteOffer;
  if (editId) openOfferEditor(state.offers.find(o => String(o.id) === editId));
  if (deleteId) {
    const offer = state.offers.find(o => String(o.id) === deleteId);
    if (!(await confirmDelete(`Delete the offer "${offer.offerDescription}"?`))) return;
    try {
      await api('DELETE', `/offers/${offer.id}`);
      toast('Offer deleted');
      await Promise.all([loadOffers(), loadStores()]);
    } catch (err) {
      toast(err.message, true);
    }
  }
});

// ---------- editor dialog ----------

let saveHandler = null;

function openEditor(title, html, onReady, onSave) {
  $('#editor-title').textContent = title;
  $('#editor-fields').innerHTML = html;
  $('#editor-error').hidden = true;
  saveHandler = onSave;
  onReady();
  $('#editor').showModal();
}

$('#editor-cancel').addEventListener('click', () => $('#editor').close());

$('#editor-form').addEventListener('submit', async event => {
  event.preventDefault();
  const button = $('#editor-save');
  const error = $('#editor-error');
  error.hidden = true;
  button.disabled = true;
  try {
    await saveHandler(event.target);
    $('#editor').close();
  } catch (err) {
    error.textContent = err.message;
    error.hidden = false;
  } finally {
    button.disabled = false;
  }
});

function openStoreEditor(store) {
  const sectors = [...new Set([...SECTORS, ...state.stores.map(s => s.storeType).filter(Boolean)])];
  let logo;
  openEditor(
    store ? `Edit ${store.storeName}` : 'Add store',
    `
      <label>Store name<input name="storeName" required maxlength="120" value="${esc(store?.storeName)}" /></label>
      <label>Sector
        <select name="storeType">
          <option value="">— None —</option>
          ${sectors.map(s => `<option ${store?.storeType === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}
        </select>
      </label>
      <label>Address<input name="address" value="${esc(store?.address)}" placeholder="City - Street" /></label>
      <label>Rating
        <select name="storeRate">
          <option value="">— Not rated —</option>
          ${[5, 4, 3, 2, 1].map(r => `<option value="${r}" ${store?.storeRate === r ? 'selected' : ''}>${'★'.repeat(r)} (${r})</option>`).join('')}
        </select>
      </label>
      <div class="image-field" id="store-logo"></div>`,
    () => {
      logo = imageField($('#store-logo'), { label: 'Logo', value: store?.logoPath });
    },
    async form => {
      const body = {
        storeName: form.storeName.value.trim(),
        storeType: form.storeType.value || null,
        address: form.address.value.trim() || null,
        storeRate: form.storeRate.value ? Number(form.storeRate.value) : null,
        logoPath: logo.get() || null,
      };
      await api(store ? 'PUT' : 'POST', store ? `/stores/${store.id}` : '/stores', body);
      toast(store ? 'Store updated' : 'Store added');
      await Promise.all([loadStores(), loadOffers()]);
    },
  );
}

function openOfferEditor(offer) {
  let image;
  const storeLogo = () => {
    const store = state.stores.find(s => String(s.id) === $('#offer-store').value);
    if (!store?.logoPath) toast('This store has no logo', true);
    return store?.logoPath;
  };
  openEditor(
    offer ? 'Edit offer' : 'Add offer',
    `
      <label>Offer text<textarea name="offerDescription" rows="3" required maxlength="500">${esc(offer?.offerDescription)}</textarea></label>
      <label>Store
        <select name="storeId" id="offer-store" required>
          ${state.stores.map(s => `<option value="${s.id}" ${offer?.storeId === s.id ? 'selected' : ''}>${esc(s.storeName)}${s.storeType ? ` · ${esc(s.storeType)}` : ''}</option>`).join('')}
        </select>
      </label>
      <label>Ends on <span class="hint">(optional)</span><input name="expireDate" type="date" value="${esc(offer?.expireDate)}" /></label>
      <div class="image-field" id="offer-image"></div>`,
    () => {
      image = imageField($('#offer-image'), {
        label: 'Ad image',
        value: offer?.imagePath,
        extraButtons: [{ label: 'Use store logo', getValue: storeLogo }],
      });
    },
    async form => {
      const body = {
        offerDescription: form.offerDescription.value.trim(),
        storeId: Number(form.storeId.value),
        expireDate: form.expireDate.value || null,
        imagePath: image.get() || null,
      };
      await api(offer ? 'PUT' : 'POST', offer ? `/offers/${offer.id}` : '/offers', body);
      toast(offer ? 'Offer updated' : 'Offer added');
      await Promise.all([loadOffers(), loadStores()]);
    },
  );
}

// ---------- settings ----------

const splitList = value => (value || '').split(',').map(v => v.trim()).filter(Boolean);

async function loadSettings() {
  const settings = await api('GET', '/settings');
  state.settings = settings;
  const form = $('#settings-form');
  for (const [key, value] of Object.entries(settings)) {
    const input = form.elements.namedItem(key);
    if (input) input.value = key === 'SERVICE_NUMBERS' ? splitList(value).join('\n') : value;
  }

  state.slides = splitList(settings.HOME_SLIDES);
  renderSlides();

  document.querySelectorAll('#settings-form .image-field[data-setting]').forEach(container => {
    const key = container.dataset.setting;
    state.imageFields[key] = imageField(container, {
      label: container.dataset.label,
      value: settings[key],
    });
  });

  state.sectorImages = {};
  for (const entry of splitList(settings.SECTOR_IMAGES)) {
    const separator = entry.indexOf(':');
    if (separator > 0) state.sectorImages[entry.slice(0, separator).trim()] = entry.slice(separator + 1).trim();
  }
  const sectorNames = [...new Set([...SECTORS, ...Object.keys(state.sectorImages)])];
  const sectorsEl = $('#sector-images');
  sectorsEl.innerHTML = sectorNames.map((_, i) => `<div class="image-field" data-sector-index="${i}"></div>`).join('');
  sectorNames.forEach((name, i) => {
    imageField($(`[data-sector-index="${i}"]`, sectorsEl), {
      label: name,
      value: state.sectorImages[name],
      onChange: key => {
        if (key) state.sectorImages[name] = key;
        else delete state.sectorImages[name];
      },
    });
  });
}

function renderSlides() {
  const list = $('#slides-list');
  list.innerHTML = state.slides.length
    ? state.slides.map((key, i) => `
      <div class="slide">
        <img src="${esc(previewUrl(key))}" alt="Banner ${i + 1}" />
        <div class="slide-actions">
          <button type="button" class="btn ghost small" data-move="${i}:-1" ${i === 0 ? 'disabled' : ''} aria-label="Move left">←</button>
          <button type="button" class="btn ghost small" data-move="${i}:1" ${i === state.slides.length - 1 ? 'disabled' : ''} aria-label="Move right">→</button>
          <button type="button" class="btn danger small" data-remove-slide="${i}">Remove</button>
        </div>
      </div>`).join('')
    : '<p class="hint">No banners: the app shows its built-in images.</p>';
}

$('#slides-list').addEventListener('click', event => {
  const move = event.target.dataset.move;
  const remove = event.target.dataset.removeSlide;
  if (move) {
    const [index, delta] = move.split(':').map(Number);
    const [item] = state.slides.splice(index, 1);
    state.slides.splice(index + delta, 0, item);
    renderSlides();
  }
  if (remove !== undefined) {
    state.slides.splice(Number(remove), 1);
    renderSlides();
  }
});

$('#slide-upload').addEventListener('change', async event => {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file) return;
  try {
    const { key } = await uploadImage(file);
    state.slides.push(key);
    renderSlides();
    toast('Banner added — remember to save');
  } catch (err) {
    toast(err.message, true);
  }
});

$('#settings-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.target;
  const button = $('button[type=submit]', form);
  const text = name => form.elements.namedItem(name).value.trim();
  const body = {
    HOME_SLIDES: state.slides.join(','),
    AD_POPUP_IMAGE: state.imageFields.AD_POPUP_IMAGE.get(),
    AD_POPUP_SECONDS: text('AD_POPUP_SECONDS'),
    SPONSOR_NAME: text('SPONSOR_NAME'),
    SPONSOR_URL: text('SPONSOR_URL'),
    SPONSOR_LOGO: state.imageFields.SPONSOR_LOGO.get(),
    SECTOR_IMAGES: Object.entries(state.sectorImages).map(([k, v]) => `${k}:${v}`).join(','),
    SOCIAL_FACEBOOK_URL: text('SOCIAL_FACEBOOK_URL'),
    SOCIAL_INSTAGRAM_URL: text('SOCIAL_INSTAGRAM_URL'),
    SOCIAL_WHATSAPP_URL: text('SOCIAL_WHATSAPP_URL'),
    SUPPORT_EMAIL: text('SUPPORT_EMAIL'),
    SERVICE_NUMBERS: text('SERVICE_NUMBERS').split(/\s*\n\s*/).filter(Boolean).join(','),
  };
  button.disabled = true;
  try {
    state.settings = await api('PUT', '/settings', body);
    toast('Settings saved');
  } catch (err) {
    toast(err.message, true);
  } finally {
    button.disabled = false;
  }
});

// ---------- start ----------

async function startApp() {
  showView(true);
  openTab(location.hash.slice(1));
  try {
    const { sample } = await api('GET', '/image-url');
    state.imageUrlSample = sample;
    await Promise.all([loadStores(), loadOffers(), loadSettings()]);
  } catch (err) {
    if (!(err instanceof ApiError && err.message === 'Session expired')) toast(err.message, true);
  }
}

state.token = readToken();
if (state.token) startApp();
else showView(false);
