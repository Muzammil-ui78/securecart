const PLACEHOLDER_IMAGE = "https://placehold.co/300x200?text=No+Image";

async function loadProducts(search = "", minPrice = "", maxPrice = "") {

    let url = `${BASE_URL}/api/products?`;

    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (minPrice) url += `minPrice=${minPrice}&`;
    if (maxPrice) url += `maxPrice=${maxPrice}&`;

    const res = await fetch(url, {
        headers: authHeader()
    });

    if (!res.ok) {
        document.getElementById("products").innerHTML =
            '<div class="empty-state">Failed to load products.</div>';
        return;
    }

    const products = await res.json();

    const countEl = document.getElementById("productCount");
    if (countEl) {
        countEl.textContent = `${products.length} result(s)`;
    }

    if (products.length === 0) {
        document.getElementById("products").innerHTML =
            '<div class="empty-state">No products found.</div>';
        return;
    }

    let html = "";
    products.forEach(p => {
        const img = p.imageUrl ? p.imageUrl : PLACEHOLDER_IMAGE;
        html += `
        <div class="card">
            <img src="${img}" alt="${p.name}" onerror="this.src='${PLACEHOLDER_IMAGE}'">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p class="price">₹${p.price.toLocaleString('en-IN')}</p>
            <p class="stock">In stock: ${p.stock}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>`;
    });

    document.getElementById("products").innerHTML = html;
}

function searchProducts() {
    const search = document.getElementById("searchInput").value;
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;
    loadProducts(search, minPrice, maxPrice);
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    loadProducts();
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("searchInput");
    if (input) {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") searchProducts();
        });
    }
});

loadProducts();