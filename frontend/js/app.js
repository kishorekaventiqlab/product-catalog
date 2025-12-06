// Application State
let currentEditingProductId = null;
let allProducts = [];

// DOM Elements
const productForm = document.getElementById('productForm');
const productsContainer = document.getElementById('productsContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');
const alertMessage = document.getElementById('alertMessage');
const refreshBtn = document.getElementById('refreshBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');

// Form Input Elements
const productIdInput = document.getElementById('productId');
const productNameInput = document.getElementById('productName');
const productDescriptionInput = document.getElementById('productDescription');
const productPriceInput = document.getElementById('productPrice');
const productStockInput = document.getElementById('productStock');
const productCategoryInput = document.getElementById('productCategory');
const productBrandInput = document.getElementById('productBrand');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    productForm.addEventListener('submit', handleFormSubmit);
    refreshBtn.addEventListener('click', loadProducts);
    cancelBtn.addEventListener('click', resetForm);
}

// Show Alert Message
function showAlert(message, type = 'success') {
    alertMessage.textContent = message;
    alertMessage.className = `alert ${type}`;
    alertMessage.style.display = 'block';

    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 5000);
}

// Show Loading State
function showLoading(show = true) {
    loadingSpinner.style.display = show ? 'block' : 'none';
    productsContainer.style.display = show ? 'none' : 'grid';
}

// Load All Products
async function loadProducts() {
    try {
        showLoading(true);
        const response = await api.getAllProducts();
        allProducts = response.products || [];
        
        if (allProducts.length === 0) {
            emptyState.style.display = 'block';
            productsContainer.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            renderProducts(allProducts);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Failed to load products: ' + error.message, 'error');
        emptyState.style.display = 'block';
        productsContainer.style.display = 'none';
    } finally {
        showLoading(false);
    }
}

// Render Products to DOM
function renderProducts(products) {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Create Product Card Element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const createdDate = new Date(product.createdAt * 1000).toLocaleDateString();
    const updatedDate = new Date(product.updatedAt * 1000).toLocaleDateString();
    
    card.innerHTML = `
        <div class="product-header">
            <div class="product-name">${escapeHtml(product.name)}</div>
            <span class="product-category">${escapeHtml(product.category || 'General')}</span>
        </div>
        
        <div class="product-description">
            ${escapeHtml(product.description || 'No description available')}
        </div>
        
        ${product.brand ? `<div class="product-brand"><strong>Brand:</strong> ${escapeHtml(product.brand)}</div>` : ''}
        
        <div class="product-details">
            <div class="product-price">$${parseFloat(product.price || 0).toFixed(2)}</div>
            <div class="product-stock">
                <div class="stock-label">In Stock</div>
                <div class="stock-value">${product.stock || 0}</div>
            </div>
        </div>
        
        <div class="product-meta">
            Created: ${createdDate} | Updated: ${updatedDate}
        </div>
        
        <div class="product-actions">
            <button class="btn btn-edit" onclick="editProduct('${product.productId}')">
                ✏️ Edit
            </button>
            <button class="btn btn-delete" onclick="deleteProduct('${product.productId}', '${escapeHtml(product.name)}')">
                🗑️ Delete
            </button>
        </div>
    `;
    
    return card;
}

// Handle Form Submit (Create or Update)
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const productData = {
        name: productNameInput.value.trim(),
        description: productDescriptionInput.value.trim(),
        price: parseFloat(productPriceInput.value),
        stock: parseInt(productStockInput.value),
        category: productCategoryInput.value.trim() || 'General',
        brand: productBrandInput.value.trim() || ''
    };
    
    // Disable submit button during request
    submitBtn.disabled = true;
    btnText.textContent = currentEditingProductId ? 'Updating...' : 'Adding...';
    
    try {
        if (currentEditingProductId) {
            // Update existing product
            await api.updateProduct(currentEditingProductId, productData);
            showAlert('Product updated successfully!', 'success');
        } else {
            // Create new product
            await api.createProduct(productData);
            showAlert('Product created successfully!', 'success');
        }
        
        resetForm();
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        showAlert('Failed to save product: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = currentEditingProductId ? 'Update Product' : 'Add Product';
    }
}

// Edit Product
async function editProduct(productId) {
    try {
        const response = await api.getProduct(productId);
        const product = response.product;
        
        // Populate form with product data
        currentEditingProductId = productId;
        productIdInput.value = productId;
        productNameInput.value = product.name;
        productDescriptionInput.value = product.description || '';
        productPriceInput.value = product.price;
        productStockInput.value = product.stock;
        productCategoryInput.value = product.category || '';
        productBrandInput.value = product.brand || '';
        
        // Update form UI
        formTitle.textContent = 'Edit Product';
        btnText.textContent = 'Update Product';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll to form
        productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error('Error loading product:', error);
        showAlert('Failed to load product details: ' + error.message, 'error');
    }
}

// Delete Product
async function deleteProduct(productId, productName) {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
        return;
    }
    
    try {
        await api.deleteProduct(productId);
        showAlert('Product deleted successfully!', 'success');
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Failed to delete product: ' + error.message, 'error');
    }
}

// Reset Form
function resetForm() {
    currentEditingProductId = null;
    productForm.reset();
    productIdInput.value = '';
    formTitle.textContent = 'Add New Product';
    btnText.textContent = 'Add Product';
    cancelBtn.style.display = 'none';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format Date
function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
