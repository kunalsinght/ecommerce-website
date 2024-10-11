document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products')) {
        fetch('/api/products')
            .then(response => response.json())
            .then(products => {
                const productsDiv = document.getElementById('products');
                products.forEach(product => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product';
                    productDiv.innerHTML = `
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                        <button onclick="addToCart('${product._id}')">Add to Cart</button>
                    `;
                    productsDiv.appendChild(productDiv);
                });
            });
    }

    if (document.getElementById('cart-items')) {
        fetchCartItems();
    }

    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    alert('Login successful');
                    window.location.href = 'index.html';
                } else {
                    alert('Login failed');
                }
            });
        });
    }

    if (document.getElementById('signup-form')) {
        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            })
            .then(response => {
                if (response.status === 201) {
                    alert('Sign up successful');
                    window.location.href = 'login.html';
                } else {
                    alert('Sign up failed');
                }
            });
        });
    }
});

function addToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to the cart');
        window.location.href = 'login.html';
        return;
    }
    fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, productId, quantity: 1 })
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
    });
}

function fetchCartItems() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to view your cart');
        window.location.href = 'login.html';
        return;
    }
    fetch(`/api/cart?token=${token}`)
        .then(response => response.json())
        .then(cart => {
            const cartItemsDiv = document.getElementById('cart-items');
            cart.products.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.innerHTML = `
                    <h2>${item.productId.name}</h2>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.productId.price}</p>
                `;
                cartItemsDiv.appendChild(cartItemDiv);
            });
        });
}

function checkout() {
    alert('Checkout functionality is not implemented yet.');
}
