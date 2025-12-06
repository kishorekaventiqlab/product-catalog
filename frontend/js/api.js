// API Service Layer
class ProductAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Create a new product
    async createProduct(productData) {
        return await this.request(API_CONFIG.ENDPOINTS.PRODUCTS, {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    // Get all products
    async getAllProducts(limit = 50) {
        const endpoint = `${API_CONFIG.ENDPOINTS.PRODUCTS}?limit=${limit}`;
        return await this.request(endpoint, {
            method: 'GET'
        });
    }

    // Get single product by ID
    async getProduct(productId) {
        const endpoint = `${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`;
        return await this.request(endpoint, {
            method: 'GET'
        });
    }

    // Update a product
    async updateProduct(productId, productData) {
        const endpoint = `${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`;
        return await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    // Delete a product
    async deleteProduct(productId) {
        const endpoint = `${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`;
        return await this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

// Initialize API instance
const api = new ProductAPI(API_CONFIG.BASE_URL);
