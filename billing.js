let allProducts = [];
let cartItems = [];
let savedBillId = null;

// ---- INIT ----
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  document.getElementById('searchInput').addEventListener('input', renderProducts);
  document.getElementById('discountInput').addEventListener('input', calcTotals);
});

async function loadProducts() {
  const res = await fetch('/api/products');
  allProducts = await res.json();
  buildCategoryTabs();
  renderProducts();
}

// ---- CATEGORIES ----
function buildCategoryTabs() {
  const cats = ['All', ...new Set(allProducts.map(p => p.category))];
  const tabs = document.getElementById('categoryTabs');
  tabs.innerHTML = '';
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-tab' + (cat === 'All' ? ' active' : '');
    btn.dataset.cat = cat;
    btn.textContent = cat;
    btn.onclick = () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    };
    tabs.appendChild(btn);
  });
}

// ---- PRODUCTS GRID ----
function renderProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const activeCat = document.querySelector('.cat-tab.active')?.dataset.cat || 'All';
  const grid = document.getElementById('productGrid');

  let filtered = allProducts.filter(p => {
    const matchCat = activeCat === 'All' || p.category === activeCat;
    const matchQ = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:#b0c4b8;font-size:13px;grid-column:1/-1;text-align:center;padding:20px">No products found</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" onclick="addToCart('${p.id}')">
      <div class="p-name">${p.name}</div>
      <div class="p-price">₹${parseFloat(p.price).toFixed(2)}</div>
      <div class="p-unit">per ${p.unit}</div>
      <div class="p-stock">Stock: ${p.stock}</div>
    </div>
  `).join('');
}

// ---- CART ----
function addToCart(productId) {
  const p = allProducts.find(x => x.id === productId);
  if (!p) return;
  const existing = cartItems.find(x => x.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ id: p.id, name: p.name, price: p.price, unit: p.unit, qty: 1 });
  }
  renderCart();
}

function changeQty(id, delta) {
  const item = cartItems.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cartItems = cartItems.filter(x => x.id !== id);
  renderCart();
}

function removeItem(id) {
  cartItems = cartItems.filter(x => x.id !== id);
  renderCart();
}

function renderCart() {
  const container = document.getElementById('billItems');
  if (cartItems.length === 0) {
    container.innerHTML = `<div class="empty-bill"><span>🛒</span><p>Add products to start billing</p></div>`;
    calcTotals();
    return;
  }

  container.innerHTML = cartItems.map(item => `
    <div class="bill-item">
      <div>
        <div class="item-name">${item.name}</div>
        <div class="item-sub">₹${parseFloat(item.price).toFixed(2)} / ${item.unit}</div>
      </div>
      <div class="item-right">
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty('${item.id}',-1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}',1)">+</button>
        </div>
        <span class="item-total">₹${(item.qty * item.price).toFixed(2)}</span>
        <button class="item-del" onclick="removeItem('${item.id}')">🗑</button>
      </div>
    </div>
  `).join('');
  calcTotals();
}

function calcTotals() {
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);
  const discPct = parseFloat(document.getElementById('discountInput').value) || 0;
  const discAmt = subtotal * discPct / 100;
  const taxable = subtotal - discAmt;
  const tax = taxable * 0.05;
  const total = taxable + tax;

  document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('taxAmt').textContent = `₹${tax.toFixed(2)}`;
  document.getElementById('totalAmt').textContent = `₹${total.toFixed(2)}`;
}

function clearBill() {
  if (cartItems.length > 0 && !confirm('Clear the current bill?')) return;
  cartItems = [];
  document.getElementById('customerName').value = '';
  document.getElementById('discountInput').value = '0';
  document.getElementById('paymentMode').value = 'Cash';
  renderCart();
}

// ---- SAVE BILL ----
async function saveBill() {
  if (cartItems.length === 0) { alert('Add at least one item.'); return; }
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);
  const discPct = parseFloat(document.getElementById('discountInput').value) || 0;
  const discAmt = subtotal * discPct / 100;
  const taxable = subtotal - discAmt;
  const tax = taxable * 0.05;
  const total = taxable + tax;

  const payload = {
    customer: document.getElementById('customerName').value || 'Walk-in',
    items: cartItems,
    subtotal,
    discount: discAmt,
    tax,
    total,
    payment_mode: document.getElementById('paymentMode').value,
  };

  const res = await fetch('/save_bill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (data.success) {
    savedBillId = data.bill_id;
    document.getElementById('modalBillId').textContent = `Bill ID: ${data.bill_id}`;
    document.getElementById('successModal').style.display = 'flex';
    cartItems = [];
    document.getElementById('discountInput').value = '0';
    document.getElementById('customerName').value = '';
    renderCart();
  } else {
    alert('Error saving bill.');
  }
}

function closeModal() {
  document.getElementById('successModal').style.display = 'none';
}
function printSaved() {
  if (savedBillId) window.open(`/bill_print/${savedBillId}`, '_blank');
  closeModal();
}

// ---- PRINT (unsaved) ----
function printBill() {
  if (cartItems.length === 0) { alert('No items to print.'); return; }
  alert('Please save the bill first, then print from Bill History.');
}
