let cart = [];

function addToCart(name, price) {
  // Check if item already exists
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price: Number(price), quantity: 1 });
  }
  
  updateCartDisplay();
}

function updateCartDisplay() {
  const orderItems = document.getElementById('order-items');
  const totalElement = document.getElementById('total-amount');
  
  // Clear existing items
  orderItems.innerHTML = '';
  
  let total = 0;
  
  if (cart.length === 0) {
    orderItems.innerHTML = '<p class="empty-message">No items added yet</p>';
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
    message += `- ${item.name} × ${item.quantity}\n`;
  });
  
  message += `\nTotal: ${document.getElementById('total-amount').textContent} Baht`;
  
  telegramLink.href = `https://t.me/JiangLe039?text=${encodeURIComponent(message)}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
  document.getElementById('contact-info').style.display = 'none';
});