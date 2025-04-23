// cart.js - Complete Shopping Cart with Telegram Integration
let cart = JSON.parse(localStorage.getItem('kiki-shop-cart')) || [];

// ======================
// CART MANAGEMENT
// ======================

function saveCart() {
  localStorage.setItem('kiki-shop-cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(name, price) {
  price = Number(price);
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  
  saveCart();
  updateCartDisplay();
  showFeedback(`✓ Added ${name}`);
}

function adjustQuantity(name, change) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.name !== name);
    }
    saveCart();
    updateCartDisplay();
  }
}

// ======================
// DISPLAY FUNCTIONS
// ======================

function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  
  let total = 0;
  let itemCount = 0;
  
  if (cartItems) {
    cartItems.innerHTML = '';
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      itemCount += item.quantity;
      
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <div class="item-info">
          <span>${item.name}</span>
          <span>${itemTotal} Baht</span>
        </div>
        <div class="quantity-controls">
          <button onclick="adjustQuantity('${item.name}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="adjustQuantity('${item.name}', 1)">+</button>
        </div>
      `;
      cartItems.appendChild(itemElement);
    });
    
    cartTotal.textContent = total;
  }
  
  if (cartCount) {
    cartCount.textContent = itemCount;
  }
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) cartCount.textContent = count;
}

// ======================
// CART POPUP CONTROLS
// ======================

function openCart() {
  document.getElementById('cart-popup').style.display = 'flex';
  updateCartDisplay();
}

function closeCart() {
  document.getElementById('cart-popup').style.display = 'none';
  document.getElementById('contact-info').style.display = 'none';
}

function showContact() {
  document.getElementById('contact-info').style.display = 'block';
}

// ======================
// UTILITIES
// ======================

function showFeedback(message) {
  const feedback = document.createElement('div');
  feedback.className = 'cart-feedback';
  feedback.textContent = message;
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.classList.add('fade-out');
    setTimeout(() => feedback.remove(), 300);
  }, 1500);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  
  // Setup cart button if exists
  const cartBtn = document.querySelector('.cart-button');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  }
});
function shareShop() {
    const shopUrl = window.location.href.replace('index.html', 'menu.html');
    
    if (navigator.share) {
      // Mobile share dialog
      navigator.share({
        title: 'Visit Kiki Shop - Premium Snacks & Drinks',
        text: 'Check out these delicious snacks at Kiki Shop!',
        url: shopUrl
      }).catch(err => {
        copyToClipboard(shopUrl);
      });
    } else {
      // Fallback for desktop
      copyToClipboard(shopUrl);
    }
  }
  
  function copyToClipboard(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    
    showFeedback('Link copied to clipboard!');
  }