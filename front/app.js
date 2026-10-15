/* =============================================
   EstoqueDB – app.js
   Consome a API REST via caminho relativo (/produtos)
   Endpoints: GET/POST/PUT/DELETE /produtos
   ============================================= */

const API_BASE = ''; // caminho relativo – funciona em localhost e no Railway

// ---- State ----
let allProducts = [];
let deleteTargetId = null;

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  checkApiStatus();
  loadProducts();
});

// =============================================
// API STATUS CHECK
// =============================================
async function checkApiStatus() {
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  try {
    const res = await fetch(`${API_BASE}/produtos`, { method: 'GET', signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      dot.className  = 'status-dot online';
      text.textContent = 'API conectada';
    } else {
      throw new Error('status ' + res.status);
    }
  } catch {
    dot.className  = 'status-dot offline';
    text.textContent = 'API offline';
  }
}

// =============================================
// NAVIGATION
// =============================================
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(`section-${name}`).classList.add('active');
  document.getElementById(`nav-${name}`).classList.add('active');
  document.getElementById('page-title').textContent =
    name === 'dashboard' ? 'Dashboard' : 'Produtos';

  const showExtras = name === 'produtos';
  document.getElementById('search-wrapper').style.display = showExtras ? '' : 'none';
  document.getElementById('btn-add').style.display        = showExtras ? '' : 'none';
}

// =============================================
// LOAD PRODUCTS
// =============================================
async function loadProducts() {
  try {
    const res  = await fetch(`${API_BASE}/produtos`);
    if (!res.ok) throw new Error('Erro HTTP ' + res.status);
    allProducts = await res.json();

    renderDashboard(allProducts);
    renderTable(allProducts);
    updateBadge(allProducts.length);
  } catch (err) {
    console.error(err);
    const emptyMsg = '<tr><td colspan="6" class="empty-state">⚠️ Não foi possível carregar os produtos. Verifique se a API está em execução.</td></tr>';
    document.getElementById('products-tbody').innerHTML = emptyMsg;
    document.getElementById('recent-tbody').innerHTML   = emptyMsg.replace('6', '5');
    showToast('Falha ao conectar com a API.', 'error');
  }
}

// =============================================
// DASHBOARD
// =============================================
function renderDashboard(products) {
  // Total produtos
  document.getElementById('stat-total').textContent = products.length;

  // Valor total em estoque (valor × quantidade)
  const totalValor = products.reduce((acc, p) => acc + (parseFloat(p.valor) * parseInt(p.quantidade)), 0);
  document.getElementById('stat-valor').textContent = formatCurrency(totalValor);

  // Categorias únicas
  const cats = new Set(products.map(p => p.categoria));
  document.getElementById('stat-categorias').textContent = cats.size;

  // Total de itens em estoque
  const totalQty = products.reduce((acc, p) => acc + parseInt(p.quantidade), 0);
  document.getElementById('stat-estoque').textContent = totalQty.toLocaleString('pt-BR');

  // Recent table (últimos 5)
  const recent  = [...products].slice(-5).reverse();
  const tbody   = document.getElementById('recent-tbody');
  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Nenhum produto cadastrado ainda.</td></tr>';
    return;
  }
  tbody.innerHTML = recent.map(p => `
    <tr>
      <td class="td-id">#${p.id_produtos}</td>
      <td class="td-name">${escHtml(p.nome)}</td>
      <td><span class="td-category">${escHtml(p.categoria)}</span></td>
      <td class="td-value">${formatCurrency(p.valor)}</td>
      <td class="${qtyClass(p.quantidade)}">${p.quantidade}</td>
    </tr>
  `).join('');
}

// =============================================
// PRODUCTS TABLE
// =============================================
function renderTable(products) {
  const tbody = document.getElementById('products-tbody');
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum produto encontrado.</td></tr>';
    return;
  }
  tbody.innerHTML = products.map(p => `
    <tr id="row-${p.id_produtos}">
      <td class="td-id">#${p.id_produtos}</td>
      <td class="td-name">${escHtml(p.nome)}</td>
      <td><span class="td-category">${escHtml(p.categoria)}</span></td>
      <td class="td-value">${formatCurrency(p.valor)}</td>
      <td class="${qtyClass(p.quantidade)}">${p.quantidade}</td>
      <td class="td-actions">
        <button class="btn btn-icon edit"   onclick="openModal('edit', ${p.id_produtos})"   title="Editar produto"   aria-label="Editar ${escHtml(p.nome)}">✏️</button>
        <button class="btn btn-icon delete" onclick="openConfirm(${p.id_produtos})"          title="Excluir produto"  aria-label="Excluir ${escHtml(p.nome)}">🗑</button>
      </td>
    </tr>
  `).join('');
}

function updateBadge(count) {
  document.getElementById('produto-count-badge').textContent =
    `${count} produto${count !== 1 ? 's' : ''}`;
}

// =============================================
// SEARCH / FILTER
// =============================================
function filterTable() {
  const q = document.getElementById('search-input').value.toLowerCase().trim();
  const filtered = allProducts.filter(p =>
    p.nome.toLowerCase().includes(q)      ||
    p.categoria.toLowerCase().includes(q) ||
    String(p.id_produtos).includes(q)
  );
  renderTable(filtered);
  updateBadge(filtered.length);
}

// =============================================
// MODAL – CREATE / EDIT
// =============================================
function openModal(mode, id = null) {
  clearFormErrors();
  document.getElementById('product-form').reset();
  document.getElementById('form-id').value = '';

  if (mode === 'create') {
    document.getElementById('modal-title').textContent  = 'Novo Produto';
    document.getElementById('submit-label').textContent = 'Salvar Produto';
  } else {
    const p = allProducts.find(x => x.id_produtos === id);
    if (!p) return;
    document.getElementById('modal-title').textContent  = 'Editar Produto';
    document.getElementById('submit-label').textContent = 'Atualizar Produto';
    document.getElementById('form-id').value        = p.id_produtos;
    document.getElementById('form-nome').value      = p.nome;
    document.getElementById('form-categoria').value = p.categoria;
    document.getElementById('form-valor').value     = p.valor;
    document.getElementById('form-quantidade').value = p.quantidade;
  }

  document.getElementById('modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('form-nome').focus(), 300);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// =============================================
// FORM SUBMIT
// =============================================
async function submitForm(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const id         = document.getElementById('form-id').value;
  const nome       = document.getElementById('form-nome').value.trim();
  const categoria  = document.getElementById('form-categoria').value.trim();
  const valor      = parseFloat(document.getElementById('form-valor').value);
  const quantidade = parseInt(document.getElementById('form-quantidade').value);

  const payload = { nome, valor, quantidade, categoria };
  const isEdit  = !!id;
  const url     = isEdit ? `${API_BASE}/produtos/${id}` : `${API_BASE}/produtos`;
  const method  = isEdit ? 'PUT' : 'POST';

  const btn = document.getElementById('form-submit-btn');
  btn.disabled = true;
  document.getElementById('submit-label').textContent = isEdit ? 'Salvando...' : 'Criando...';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || 'Erro desconhecido');

    closeModal();
    showToast(isEdit ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!', 'success');
    await loadProducts();
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    document.getElementById('submit-label').textContent = isEdit ? 'Atualizar Produto' : 'Salvar Produto';
  }
}

// =============================================
// FORM VALIDATION
// =============================================
function validateForm() {
  let valid = true;
  clearFormErrors();

  const nome       = document.getElementById('form-nome').value.trim();
  const categoria  = document.getElementById('form-categoria').value.trim();
  const valor      = document.getElementById('form-valor').value;
  const quantidade = document.getElementById('form-quantidade').value;

  if (!nome) {
    setError('form-nome', 'err-nome', 'Nome é obrigatório');
    valid = false;
  }
  if (!categoria) {
    setError('form-categoria', 'err-categoria', 'Categoria é obrigatória');
    valid = false;
  }
  if (!valor || parseFloat(valor) < 0) {
    setError('form-valor', 'err-valor', 'Informe um valor válido (≥ 0)');
    valid = false;
  }
  if (!quantidade || parseInt(quantidade) < 0) {
    setError('form-quantidade', 'err-quantidade', 'Informe uma quantidade válida (≥ 0)');
    valid = false;
  }

  return valid;
}

function setError(inputId, errId, msg) {
  document.getElementById(inputId).classList.add('error');
  document.getElementById(errId).textContent = msg;
}

function clearFormErrors() {
  ['form-nome','form-categoria','form-valor','form-quantidade'].forEach(id => {
    document.getElementById(id).classList.remove('error');
  });
  ['err-nome','err-categoria','err-valor','err-quantidade'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
}

// =============================================
// DELETE CONFIRM
// =============================================
function openConfirm(id) {
  const p = allProducts.find(x => x.id_produtos === id);
  if (!p) return;
  deleteTargetId = id;
  document.getElementById('confirm-product-name').textContent = `"${p.nome}"`;
  document.getElementById('confirm-overlay').classList.add('open');
}

function closeConfirm() {
  deleteTargetId = null;
  document.getElementById('confirm-overlay').classList.remove('open');
}

async function confirmDelete() {
  if (!deleteTargetId) return;

  const btn = document.getElementById('confirm-delete-btn');
  btn.disabled = true;
  btn.textContent = 'Excluindo...';

  try {
    const res = await fetch(`${API_BASE}/produtos/${deleteTargetId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || 'Erro ao excluir');

    closeConfirm();
    showToast('Produto excluído com sucesso!', 'success');
    await loadProducts();
  } catch (err) {
    showToast(`Erro: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Excluir';
  }
}

// =============================================
// TOAST
// =============================================
let toastTimeout;
function showToast(msg, type = 'info') {
  clearTimeout(toastTimeout);
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = `toast ${type} show`;
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 4000);
}

// =============================================
// UTILS
// =============================================
function formatCurrency(val) {
  return parseFloat(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function qtyClass(qty) {
  const n = parseInt(qty);
  if (n <= 0)  return 'td-qty low';
  if (n < 10)  return 'td-qty medium';
  return 'td-qty good';
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Fechar modais com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeConfirm();
  }
});
