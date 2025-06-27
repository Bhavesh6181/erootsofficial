// Global variables
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// DOM elements
const cartCountElement = document.getElementById("cart-count");
const cartItemsElement = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const cartLink = document.querySelector(".cart-link");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeCart();
  initializeVisitorCount();
  initializeMobileMenu();
  initializeScrollEffects();
  initializeAddToCartButtons();
  initializeFormHandler();
  initializeScrollAnimations();
});

// Cart functionality
function initializeCart() {
  // Load cart from localStorage
  const savedCart = safeLocalStorageOperation(() => {
    return localStorage.getItem("e-roots-cart");
  });

  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartDisplay();
    } catch (error) {
      console.warn("Failed to parse saved cart:", error);
      cart = [];
    }
  }
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: parseInt(price),
      quantity: 1,
    });
  }

  updateCartDisplay();
  saveCartToStorage();
  showSuccessMessage(`${name} added to cart!`);
  animateCartIcon();
}

function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCartDisplay();
  saveCartToStorage();
  showSuccessMessage("Item removed from cart");
}

function updateQuantity(name, change) {
  const item = cart.find((item) => item.name === name);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(name);
    } else {
      updateCartDisplay();
      saveCartToStorage();
    }
  }
}

function updateCartDisplay() {
  // Update cart count
  cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
    cartCountElement.classList.add("pulse");
    setTimeout(() => cartCountElement.classList.remove("pulse"), 300);
  }

  // Update cart total
  cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  if (cartTotalElement) {
    cartTotalElement.textContent = cartTotal;
  }

  // Update cart items display
  if (cartItemsElement) {
    if (cart.length === 0) {
      cartItemsElement.innerHTML = 
        `<p class="empty-cart">Your cart is empty</p>`;
      if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
      cartItemsElement.innerHTML = cart
        .map(
          (item) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>₹${item.price} each</p>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(\'${item.name}\', -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(\'${item.name}\', 1)">+</button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(\'${item.name}\')">Remove</button>
                    </div>
                </div>
            `
        )
        .join("");
      if (checkoutBtn) checkoutBtn.disabled = false;
    }
  }
}

function saveCartToStorage() {
  safeLocalStorageOperation(() => {
    localStorage.setItem("e-roots-cart", JSON.stringify(cart));
  });
}

function animateCartIcon() {
  if (cartLink) {
    cartLink.classList.add("bounce");
    setTimeout(() => cartLink.classList.remove("bounce"), 600);
  }
}

// Visitor count functionality
function initializeVisitorCount() {
  const visitorCountElement = document.getElementById("visitor-count");

  if (!visitorCountElement) return;

  // Get current visitor count from localStorage
  let visitorCount = safeLocalStorageOperation(() => {
    return localStorage.getItem("e-roots-visitor-count");
  });

  if (!visitorCount) {
    // First time visitor
    visitorCount = 1;
  } else {
    // Check if this is a new session
    const lastVisit = safeLocalStorageOperation(() => {
      return sessionStorage.getItem("e-roots-session-counted");
    });

    if (!lastVisit) {
      visitorCount = parseInt(visitorCount) + 1;
      safeLocalStorageOperation(() => {
        sessionStorage.setItem("e-roots-session-counted", "true");
      });
    }
  }

  // For demonstration purposes, let's simulate a more realistic visitor count
  // In a real application, this would come from your server/analytics
  const baseCount = 1247; // Starting base count
  const sessionCount = parseInt(visitorCount) || 0;
  const totalCount = baseCount + sessionCount;

  // Update display
  visitorCountElement.textContent = totalCount;

  // Save to localStorage
  safeLocalStorageOperation(() => {
    localStorage.setItem("e-roots-visitor-count", visitorCount);
  });

  // Animate the counter
  animateCounter(visitorCountElement, totalCount);
}

function animateCounter(element, targetValue) {
  let currentValue = 0;
  const increment = targetValue / 50;
  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(timer);
    }
    element.textContent = Math.floor(currentValue);
  }, 30);
}

// Mobile menu functionality
function initializeMobileMenu() {
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

// Add to cart button functionality
function initializeAddToCartButtons() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const name = this.getAttribute("data-name");
      const price = this.getAttribute("data-price");
      if (name && price) {
        addToCart(name, price);
      }
    });
  });
}

// Form handler functionality
function initializeFormHandler() {
  const form = document.querySelector("form[action*=\"formspree\"]");
  const formSuccess = document.getElementById("form-success");

  if (form && formSuccess) {
    form.addEventListener("submit", function (e) {
      // Show success message immediately
      formSuccess.style.display = "block";

      // Scroll to success message
      formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });

      // Reset form after a delay
      setTimeout(() => {
        form.reset();
      }, 1000);
    });
  }
}

// Scroll effects
function initializeScrollEffects() {
  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    window.addEventListener(
      "scroll",
      debounce(function () {
        if (window.scrollY > 100) {
          navbar.style.background = "rgba(255, 255, 255, 0.98)";
          navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
        } else {
          navbar.style.background = "rgba(255, 255, 255, 0.95)";
          navbar.style.boxShadow = "0 2px 15px rgba(0, 0, 0, 0.05)";
        }
      }, 10)
    );
  }

  // Smooth scroll for navigation links
  document.querySelectorAll("a[href^=\"#\"]").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Scroll animations
function initializeScrollAnimations() {
  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".product-card, .service-card, .project-card, blockquote, form"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Success message functionality
function showSuccessMessage(message) {
  // Remove existing message if any
  const existingMessage = document.querySelector(".success-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageElement = document.createElement("div");
  messageElement.className = "success-message";
  messageElement.textContent = message;
  document.body.appendChild(messageElement);

  // Show message
  setTimeout(() => {
    messageElement.classList.add("show");
  }, 100);

  // Hide and remove message
  setTimeout(() => {
    messageElement.classList.remove("show");
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 300);
  }, 3000);
}

// Checkout functionality
async function checkout() {
  if (cart.length === 0) {
    showSuccessMessage("Your cart is empty!");
    return;
  }

  // Collect customer information
  const customerName = prompt("Please enter your name:");
  if (!customerName) {
    showSuccessMessage("Order cancelled - name is required");
    return;
  }

  const customerEmail = prompt("Please enter your email address:");
  if (!customerEmail || !isValidEmail(customerEmail)) {
    showSuccessMessage("Order cancelled - valid email is required");
    return;
  }

  const customerPhone = prompt("Please enter your phone number:");
  if (!customerPhone) {
    showSuccessMessage("Order cancelled - phone number is required");
    return;
  }

  const customerAddress = prompt("Where do you leave ?");
  if (!customerAddress) {
    showSuccessMessage("Order cancelled - delivery address is required");
    return;
  }

  // Collect order details
  const orderDetails = {
    customerName: customerName,
    customerEmail: customerEmail,
    customerPhone: customerPhone,
    customerAddress: customerAddress,
    items: cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    })),
    total: cartTotal,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    orderNumber: 'ER' + Date.now()
  };

  // Create formatted order summary for email
  let orderSummary = `NEW ORDER RECEIVED - ${orderDetails.orderNumber}\n\n`;
  orderSummary += `Customer Information:\n`;
  orderSummary += `Name: ${orderDetails.customerName}\n`;
  orderSummary += `Email: ${orderDetails.customerEmail}\n`;
  orderSummary += `Phone: ${orderDetails.customerPhone}\n`;
  orderSummary += `Address: ${orderDetails.customerAddress}\n\n`;
  orderSummary += `Order Details:\n`;
  orderDetails.items.forEach(item => {
    orderSummary += `- ${item.name} x${item.quantity} @ ₹${item.price} each = ₹${item.subtotal}\n`;
  });
  orderSummary += `\nTotal Amount: ₹${orderDetails.total}\n`;
  orderSummary += `Order Date: ${orderDetails.timestamp}\n\n`;
  orderSummary += `Please contact the customer to confirm payment and delivery details.`;

  try {
    // Send order notification via Formspree
    const response = await fetch('https://formspree.io/f/xvgrdgza', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: `New Order #${orderDetails.orderNumber} - E_roots`,
        message: orderSummary,
        customerName: orderDetails.customerName,
        customerEmail: orderDetails.customerEmail,
        customerPhone: orderDetails.customerPhone,
        customerAddress: orderDetails.customerAddress,
        orderTotal: orderDetails.total,
        orderNumber: orderDetails.orderNumber,
        _replyto: orderDetails.customerEmail
      })
    });

    if (response.ok) {
      // Display success message to customer
      let customerMessage = `Thank you for your order, ${customerName}!\n\n`;
      customerMessage += `Order Number: ${orderDetails.orderNumber}\n\n`;
      customerMessage += `Order Summary:\n`;
      orderDetails.items.forEach(item => {
        customerMessage += `- ${item.name} x${item.quantity} = ₹${item.subtotal}\n`;
      });
      customerMessage += `\nTotal: ₹${orderDetails.total}\n\n`;
      customerMessage += `We have received your order and will contact you shortly at ${customerPhone} for payment and delivery confirmation.\n\n`;
      customerMessage += `You can also reach us directly via WhatsApp for any questions.`;

      alert(customerMessage);

      // Clear cart after successful order
      cart = [];
      updateCartDisplay();
      saveCartToStorage();

      showSuccessMessage("Order placed successfully! Check your email for confirmation.");
    } else {
      throw new Error('Failed to send order notification');
    }
  } catch (error) {
    console.error('Error sending order:', error);
    
    // Fallback: Show order details and suggest WhatsApp contact
    let fallbackMessage = `There was an issue sending your order notification, but your order details are:\n\n`;
    fallbackMessage += `Order Number: ${orderDetails.orderNumber}\n`;
    fallbackMessage += `Total: ₹${orderDetails.total}\n\n`;
    fallbackMessage += `Please contact us via WhatsApp with these details to complete your order.`;
    
    alert(fallbackMessage);
    
    // Still clear cart as customer has the order details
    cart = [];
    updateCartDisplay();
    saveCartToStorage();
  }
}

// Email validation helper function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Add checkout event listener
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", checkout);
}

// Keyboard shortcuts
document.addEventListener("keydown", function (event) {
  // Press 'C' to scroll to cart
  if (event.key === "c" || event.key === "C") {
    if (!event.ctrlKey && !event.altKey && !event.metaKey) {
      const cartSection = document.getElementById("cart");
      if (cartSection) {
        cartSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  // Press 'P' to scroll to products
  if (event.key === "p" || event.key === "P") {
    if (!event.ctrlKey && !event.altKey && !event.metaKey) {
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
});

// Performance optimization: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Error handling for localStorage
function safeLocalStorageOperation(operation) {
  try {
    return operation();
  } catch (error) {
    console.warn("localStorage operation failed:", error);

    // Show user-friendly error message
    const errorElement = document.createElement("div");
    errorElement.className = "storage-error";
    errorElement.textContent = 
      "Some features may not work properly due to browser storage limitations.";
    document.body.appendChild(errorElement);

    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 5000);

    return null;
  }
}

// Export functions for global access (if needed)
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;

// Additional utility functions
function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function validatePhone(phone) {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/\s/g, ""));
}

// Enhanced form validation
function enhanceFormValidation() {
  const form = document.querySelector("form[action*=\"formspree\"]");
  if (!form) return;

  const emailInput = form.querySelector("input[type=\"email\"]");
  const phoneInput = form.querySelector("input[type=\"tel\"]");

  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      if (this.value && !isValidEmail(this.value)) {
        this.style.borderColor = "#ef4444";
        showSuccessMessage("Please enter a valid email address");
      } else {
        this.style.borderColor = "#e2e8f0";
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("blur", function () {
      if (this.value && !validatePhone(this.value)) {
        this.style.borderColor = "#ef4444";
        showSuccessMessage("Please enter a valid phone number");
      } else {
        this.style.borderColor = "#e2e8f0";
      }
    });
  }
}

// Initialize enhanced form validation
document.addEventListener("DOMContentLoaded", enhanceFormValidation);

