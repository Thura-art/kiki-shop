// cart.js
let cart = [];

// Category Filters (unchanged)
function setupCategoryFilters() {
  const filters = document.querySelectorAll('.category-filter');
  filters.forEach(f => f.addEventListener('click', function() {
    filters.forEach(x=>x.classList.remove('active'));
    this.classList.add('active');
    const cat = this.dataset.category;
    document.querySelectorAll('.product').forEach(p => {
      p.style.display = (cat==='all' || p.dataset.category===cat) ? 'block' : 'none';
    });
  }));
}

// Add or increment
function addToCart(name, price) {
  const existing = cart.find(i => i.name===name);
  if (existing) existing.quantity++;
  else cart.push({ name, price:Number(price), quantity:1 });
  updateCartDisplay();
  showAddedNotification(name);
}

// Remove entirely
function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  updateCartDisplay();
}

// Re-render the order summary
function updateCartDisplay() {
  const orderItems = document.getElementById('order-items');
  const totalEl    = document.getElementById('total-amount');
  const countEl    = document.getElementById('item-count');
  orderItems.innerHTML = '';
  let total = 0;
  
  if (cart.length===0) {
    orderItems.innerHTML = '<p class="empty-message">No items added yet</p>';
    countEl.textContent='(0 items)';
  } else {
    cart.forEach(item => {
      const lineTotal = item.price * item.quantity;
      total += lineTotal;
      const div = document.createElement('div');
      div.className = 'order-item';
      div.innerHTML = `
        <span>${item.name} × ${item.quantity} — ${lineTotal} Baht</span>
        <button class="remove-btn" data-name="${item.name}">&times;</button>
      `;
      // hook remove
      div.querySelector('.remove-btn')
         .addEventListener('click', e => removeFromCart(e.target.dataset.name));
      orderItems.appendChild(div);
    });
    const qty = cart.reduce((sum,i)=>sum+i.quantity,0);
    countEl.textContent = `(${qty} items)`;
  }

  totalEl.textContent = total;
  updateTelegramLink();
}

// Show contact block
function showContact() {
  if (cart.length===0) { alert('Please add items first!'); return; }
  document.getElementById('contact-info').style.display = 'block';
}

// Build Telegram link
function updateTelegramLink() {
  if (!cart.length) return;
  let msg = "Hello! I want to order:\n";
  cart.forEach(i => {
    msg += `- ${i.name} × ${i.quantity} (${i.price*i.quantity} Baht)\n`;
  });
  msg += `\nTotal: ${document.getElementById('total-amount').textContent} Baht`;
  document.getElementById('telegram-link')
          .href = `https://t.me/JiangLe039?text=${encodeURIComponent(msg)}`;
}

// Notification toast
function showAddedNotification(name) {
  const n = document.getElementById('addedNotification');
  n.textContent = `${name} added to order!`;
  n.style.opacity = '1';
  setTimeout(()=> n.style.opacity='0', 2000);
}

// init
document.addEventListener('DOMContentLoaded', () => {
  setupCategoryFilters();
  updateCartDisplay();
  document.getElementById('contact-info').style.display='none';
  window.addEventListener('resize', ()=>{/*<nothing special>*/});
});
