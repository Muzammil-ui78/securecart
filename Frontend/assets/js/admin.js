const ADMIN_PLACEHOLDER_IMAGE = "https://placehold.co/300x200?text=No+Image";

async function loadAdminProducts() {

    const res = await fetch(`${BASE_URL}/api/products`, {
        headers: authHeader()
    });

    if (!res.ok) {
        document.getElementById("adminProducts").innerHTML =
            '<div class="empty-state">Failed to load products.</div>';
        return;
    }

    const products = await res.json();

    if (products.length === 0) {
        document.getElementById("adminProducts").innerHTML =
            '<div class="empty-state">No products yet.</div>';
        return;
    }

    let html = "";
    products.forEach(p => {
        const img = p.imageUrl ? p.imageUrl : ADMIN_PLACEHOLDER_IMAGE;
        html += `
        <div class="card">
            <img src="${img}" alt="${p.name}" onerror="this.src='${ADMIN_PLACEHOLDER_IMAGE}'">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p class="price">₹${p.price.toLocaleString('en-IN')}</p>
            <p class="stock">Stock: ${p.stock}</p>
            <div style="display:flex; gap:8px;">
                <button onclick="editProduct(${p.id}, '${escapeQuotes(p.name)}', '${escapeQuotes(p.description)}', ${p.price}, ${p.stock}, '${escapeQuotes(p.imageUrl || "")}')">Edit</button>
                <button onclick="deleteProduct(${p.id})">Delete</button>
            </div>
        </div>`;
    });

    document.getElementById("adminProducts").innerHTML = html;
}

function escapeQuotes(str) {
    return (str || "").replace(/'/g, "\\'");
}

let editingId = null;

function editProduct(id, name, description, price, stock, imageUrl) {
    editingId = id;
    document.getElementById("pName").value = name;
    document.getElementById("pDescription").value = description;
    document.getElementById("pPrice").value = price;
    document.getElementById("pStock").value = stock;
    document.getElementById("pImageUrl").value = imageUrl;
    document.getElementById("formTitle").textContent = "Edit product #" + id;
    document.getElementById("submitBtn").textContent = "Update product";
    document.getElementById("cancelBtn").style.display = "inline-block";
}

function cancelEdit() {
    editingId = null;
    document.getElementById("productForm").reset();
    document.getElementById("formTitle").textContent = "Add new product";
    document.getElementById("submitBtn").textContent = "Add product";
    document.getElementById("cancelBtn").style.display = "none";
}

async function submitProduct(event) {
    event.preventDefault();

    const product = {
        name: document.getElementById("pName").value,
        description: document.getElementById("pDescription").value,
        price: parseFloat(document.getElementById("pPrice").value),
        stock: parseInt(document.getElementById("pStock").value),
        imageUrl: document.getElementById("pImageUrl").value
    };

    let res;

    if (editingId) {
        res = await fetch(`${BASE_URL}/api/products/${editingId}`, {
            method: "PUT",
            headers: authHeader(),
            body: JSON.stringify(product)
        });
    } else {
        res = await fetch(`${BASE_URL}/api/products`, {
            method: "POST",
            headers: authHeader(),
            body: JSON.stringify(product)
        });
    }

    if (res.ok) {
        alert(editingId ? "Product updated!" : "Product added!");
        cancelEdit();
        loadAdminProducts();
    } else {
        if (res.status === 403) {
            alert("Access denied. ADMIN role required.");
        } else {
            const err = await res.json();
            alert(err.message || "Operation failed");
        }
    }
}

async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: authHeader()
    });

    if (res.ok) {
        loadAdminProducts();
    } else {
        if (res.status === 403) {
            alert("Access denied. ADMIN role required.");
        } else {
            alert("Failed to delete product.");
        }
    }
}

loadAdminProducts();