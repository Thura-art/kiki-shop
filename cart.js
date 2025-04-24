// cart.js
let cart = [];

// Category Filtering Functionality
function setupCategoryFilters() {
  const filters = document.querySelectorAll('.category-filter');
  filters.forEach(filter => {
    filter.addEventListener('click', function() {
      filters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');
      const category = this.dataset.category;
      document.querySelectorAll('.product').forEach(product => {
        product.style.display = (category === 'all' || product.dataset.category === category)
          ? 'block'
          : 'none';
      });
    });
  });
}

// Cart Functions
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price: Number(price), quantity: 1 });
  }
  updateCartDisplay();
  showAddedNotification(name);
}

function updateCartDisplay() {
  const orderItems = document.getElementById('order-items');
  const totalElement = document.getElementById('total-amount');
  const itemCountElement = document.getElementById('item-count');
  orderItems.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    orderItems.innerHTML = '<p class="empty-message">No items added yet</p>';
    itemCountElement.textContent = '(0 items)';
  } else {
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      const itemElement = document.createElement('div');
      itemElement.className = 'order-item';
      itemElement.innerHTML = `
        <span>${item.name} × ${item.quantity}</span>
        <span>${itemTotal} Baht</span>
      `;
      orderItems.appendChild(itemElement);
    });
    itemCountElement.textContent = `(${cart.reduce((sum, i) => sum + i.quantity, 0)} items)`;
  }
  totalElement.textContent = total;
  updateTelegramLink();
}

function showContact() {
  if (cart.length === 0) {
    alert('Please add items to your order first!');
    return;
  }
  document.getElementById('contact-info').style.display = 'block';
}

function updateTelegramLink() {
  if (cart.length === 0) return;
  const telegramLink = document.getElementById('telegram-link');
  let message = "Hello! I want to order:\n";
  cart.forEach(item => {
    message += `- ${item.name} × ${item.quantity} (${item.price * item.quantity} Baht)\n`;
  });
  message += `\nTotal: ${document.getElementById('total-amount').textContent} Baht`;
  telegramLink.href = `https://t.me/JiangLe039?text=${encodeURIComponent(message)}`;
}

function showAddedNotification(itemName) {
  const notification = document.getElementById('addedNotification');
  notification.textContent = `${itemName} added to order!`;
  notification.style.opacity = '1';
  setTimeout(() => { notification.style.opacity = '0'; }, 2000);
}

function handleWindowResize() {
  const orderSummary = document.getElementById('orderSummary');
  if (window.innerWidth < 768) {
    orderSummary.style.right = '10px';
    orderSummary.style.left = 'auto';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  setupCategoryFilters();
  updateCartDisplay();
  document.getElementById('contact-info').style.display = 'none';
  window.addEventListener('resize', handleWindowResize);
  handleWindowResize();
});
