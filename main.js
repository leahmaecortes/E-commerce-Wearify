const list = document.querySelector(".navlist");
const hamburger = document.querySelector(".hamburger");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

// Cart Elements
const cartCountBadge = document.getElementById("cart-count");
const summaryItemCount = document.getElementById("summary-item-count");
const cartItemsList = document.getElementById("cart-items-list");
const cartSubtotalElement = document.getElementById("cart-subtotal");
const cartShippingElement = document.getElementById("cart-shipping");
const cartTotalElement = document.getElementById("cart-total");
const deliveryForm = document.getElementById("delivery-form");
const orderConfirmation = document.getElementById("order-confirmation");

// Constants
const SHIPPING_COST = 5.00;
let cart = []; // The actual cart array to hold products

// --- Helper Functions ---

function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

function updateCartTotals() {
    let subtotal = 0;
    let totalItems = 0;

    // 1. Calculate Subtotal and Total Items
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        totalItems += item.quantity;
    });

    const total = subtotal + SHIPPING_COST;

    // 2. Update the DOM
    cartCountBadge.textContent = totalItems;
    summaryItemCount.textContent = totalItems;
    cartSubtotalElement.textContent = formatCurrency(subtotal);
    cartTotalElement.textContent = formatCurrency(total);
    cartShippingElement.textContent = formatCurrency(SHIPPING_COST);

    // 3. Update the Cart Item List
    cartItemsList.innerHTML = ''; // Clear existing list

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-cart-message">Your cart is empty. Add some products!</p>';
        deliveryForm.style.display = 'none';
        return;
    } else {
        deliveryForm.style.display = 'block';
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <span class="cart-item-name">${item.name} (x${item.quantity})</span>
            <span class="cart-item-price">${formatCurrency(item.price * item.quantity)}</span>
        `;
        cartItemsList.appendChild(itemElement);
    });
}

// --- Main Event Listeners ---

// 1. Hamburger Menu Toggle Functionality
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("fa-x");
    list.classList.toggle("navlist-active");
});

// 2. Add to Cart Functionality
addToCartButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();

        const card = e.target.closest('.card');
        const productId = e.target.dataset.productId;
        const productTitle = card.querySelector('.title').textContent;
        // Get price from the data attribute for accurate calculation
        const price = parseFloat(card.querySelector('.amount').dataset.price); 

        // Check if the product is already in the cart
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            // If exists, just increase quantity
            existingItem.quantity++;
        } else {
            // If new, add to cart
            cart.push({
                id: productId,
                name: productTitle,
                price: price,
                quantity: 1
            });
        }

        updateCartTotals(); // Update all totals and list display

        // User feedback
        button.textContent = "Added!";
        button.disabled = true;

        setTimeout(() => {
            button.textContent = "Add to Cart";
            button.disabled = false;
        }, 1000);
    });
});

// 3. Checkout/Delivery Form Submission
deliveryForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop the form from actually submitting/reloading

    if (cart.length === 0) {
        alert("Your cart is empty! Please add items before checking out.");
        return;
    }
    
    // Simulate payment/order processing
    const orderDetails = {
        name: document.getElementById('full-name').value,
        email: document.getElementById('delivery-email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        payment: document.getElementById('payment-method').value,
        items: cart,
        total: cartTotalElement.textContent
    };

    console.log("Order placed:", orderDetails);

    // Display confirmation message and hide the form
    deliveryForm.style.display = 'none';
    orderConfirmation.style.display = 'block';

    // Clear the cart for a new session (in a real app, this would be a server-side action)
    cart = [];
    setTimeout(updateCartTotals, 500); // Wait briefly then reset cart display

    // Scroll to confirmation message
    orderConfirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Initialize cart on page load
updateCartTotals();