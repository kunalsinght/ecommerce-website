document.addEventListener('DOMContentLoaded', () => {
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
                    <button onclick="addToCart('${product.id}')">Add to Cart</button>
                `;
                productsDiv.appendChild(productDiv);
            });
        });
});

function addToCart(productId) {
    // Add product to cart logic
    alert(`Product ${productId} added to cart!`);
}
