# API Testing Guide - CRUD Operations

## Base URL
```
https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod
```

---

## 1. CREATE Product (POST /products)

### Request
**Method:** POST  
**Endpoint:** `/products`  
**Headers:**
```
Content-Type: application/json
```

### Request Body (Required Fields)
```json
{
  "name": "Product Name"
}
```

### Request Body (Full Example)
```json
{
  "name": "Wireless Gaming Mouse",
  "description": "RGB LED backlit wireless gaming mouse with 6 programmable buttons",
  "price": 49.99,
  "category": "Mouse",
  "stock": 150
}
```

### PowerShell Example
```powershell
$body = @{
    name = "Wireless Gaming Mouse"
    description = "RGB LED backlit wireless gaming mouse"
    price = 49.99
    category = "Mouse"
    stock = 150
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products" -Method Post -ContentType "application/json" -Body $body
```

### Postman Setup
**Method:** POST  
**URL:** `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Wireless Gaming Mouse",
  "description": "RGB LED backlit wireless gaming mouse with 6 programmable buttons",
  "price": 49.99,
  "category": "Mouse",
  "stock": 150
}
```

### Response (201 Created)
```json
{
  "message": "Product created successfully",
  "product": {
    "productId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Wireless Gaming Mouse",
    "description": "RGB LED backlit wireless gaming mouse",
    "price": 49.99,
    "category": "Mouse",
    "stock": 150,
    "createdAt": 1701331200,
    "updatedAt": 1701331200
  }
}
```

---

## 2. LIST Products (GET /products)

### Request
**Method:** GET  
**Endpoint:** `/products`  
**Query Parameters:** (Optional)
- `limit` - Number of items to return (default: 50)
- `lastKey` - Product ID for pagination

### PowerShell Examples

**Basic List:**
```powershell
Invoke-RestMethod -Uri "https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products" -Method Get
```

**With Limit:**
```powershell
Invoke-RestMethod -Uri "https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products?limit=10" -Method Get
```

**With Pagination:**
```powershell
Invoke-RestMethod -Uri "https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products?limit=10&lastKey=PRODUCT_ID_HERE" -Method Get
```

### Postman Setup

**Basic List:**
- **Method:** GET
- **URL:** `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products`
- **Headers:** None required
- **Body:** None

**With Limit:**
- **Method:** GET
- **URL:** `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products?limit=10`

**With Pagination:**
- **Method:** GET
- **URL:** `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products?limit=10&lastKey=YOUR_PRODUCT_ID`

### Response (200 OK)
```json
{
  "products": [
    {
      "productId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Wireless Gaming Mouse",
      "description": "RGB LED backlit wireless gaming mouse",
      "price": 49.99,
      "category": "Mouse",
      "stock": 150,
      "createdAt": 1701331200,
      "updatedAt": 1701331200
    },
    {
      "productId": "223e4567-e89b-12d3-a456-426614174001",
      "name": "Mechanical Keyboard",
      "description": "Cherry MX switches with RGB",
      "price": 129.99,
      "category": "Keyboard",
      "stock": 85,
      "createdAt": 1701331300,
      "updatedAt": 1701331300
    }
  ],
  "count": 2,
  "lastKey": "223e4567-e89b-12d3-a456-426614174001"
}
```

---

## 3. GET Single Product (GET /products/{productId})

### Request
**Method:** GET  
**Endpoint:** `/products/{productId}`  
**Path Parameters:**
- `productId` - The UUID of the product

### PowerShell Example
```powershell
$productId = "123e4567-e89b-12d3-a456-426614174000"
Invoke-RestMethod -Uri "https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/$productId" -Method Get
```

### Postman Setup
**Method:** GET  
**URL:** `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/123e4567-e89b-12d3-a456-426614174000`

**Headers:** None required  
**Body:** None

> **Note:** Replace `123e4567-e89b-12d3-a456-426614174000` with actual product ID from CREATE response

### Response (200 OK)
```json
{
  "product": {
    "productId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Wireless Gaming Mouse",
    "description": "RGB LED backlit wireless gaming mouse",
    "price": 49.99,
    "category": "Mouse",
    "stock": 150,
    "createdAt": 1701331200,
    "updatedAt": 1701331200
  }
}
```

### Response (404 Not Found)
```json
{
  "error": "Product not found"
}
```

---

## 4. UPDATE Product (PUT /products/{productId})

### Request
**Method:** PUT  
**Endpoint:** `/products/{productId}`  
**Headers:**
```
Content-Type: application/json
```
**Path Parameters:**
- `productId` - The UUID of the product

### Request Body (Partial Update)
You can update one or more fields. Only provided fields will be updated.

```json
{
  "name": "Updated Product Name"
}
```

### Request Body (Full Update Example)
```json
{
  "name": "Wireless Gaming Mouse Pro",
  "description": "Updated description with new features",
  "price": 59.99,
  "category": "Gaming",
  "stock": 200
}
```

### PowerShell Examples

**Update Single Field:**
```powershell
$productId = "123e4567-e89b-12d3-a456-426614174000"
$body = @{
    price = 59.99
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/$productId" -Method Put -ContentType "application/json" -Body $body
```

**Update Multiple Fields:**
```powershell
$productId = "123e4567-e89b-12d3-a456-426614174000"
$body = @{
    name = "Wireless Gaming Mouse Pro"
    price = 59.99
    stock = 200
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/$productId" -Method Put -ContentType "application/json" -Body $body
```

### Postman Setup

**Update Single Field:**
- **Method:** PUT
- **URL:** `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/YOUR_PRODUCT_ID`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "price": 59.99
  }
  ```

**Update Multiple Fields:**
- **Method:** PUT
- **URL:** `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/YOUR_PRODUCT_ID`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "name": "Wireless Gaming Mouse Pro",
    "description": "Updated description with new features",
    "price": 59.99,
    "stock": 200
  }
  ```

> **Note:** Replace `YOUR_PRODUCT_ID` with actual product ID

### Response (200 OK)
```json
{
  "message": "Product updated successfully",
  "product": {
    "productId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Wireless Gaming Mouse Pro",
    "description": "RGB LED backlit wireless gaming mouse",
    "price": 59.99,
    "category": "Mouse",
    "stock": 200,
    "createdAt": 1701331200,
    "updatedAt": 1701335000
  }
}
```

### Response (404 Not Found)
```json
{
  "error": "Product not found"
}
```

---

## 5. DELETE Product (DELETE /products/{productId})

### Request
**Method:** DELETE  
**Endpoint:** `/products/{productId}`  
**Path Parameters:**
- `productId` - The UUID of the product

### PowerShell Example
```powershell
$productId = "123e4567-e89b-12d3-a456-426614174000"
Invoke-RestMethod -Uri "https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/$productId" -Method Delete
```

### Postman Setup
**Method:** DELETE  
**URL:** `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/YOUR_PRODUCT_ID`

**Headers:** None required  
**Body:** None

> **Note:** Replace `YOUR_PRODUCT_ID` with actual product ID from CREATE response

### Response (200 OK)
```json
{
  "message": "Product deleted successfully"
}
```

### Response (404 Not Found)
```json
{
  "error": "Product not found"
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "error": "Product name is required"
}
```

```json
{
  "error": "Invalid JSON in request body"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

```json
{
  "error": "Path not found: /invalid-path"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method POST not allowed on /products/{id}"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error: <error details>"
}
```

---

## Postman Testing Workflow

### Step-by-Step Testing in Postman

#### 1. CREATE a Product
1. Create new request in Postman
2. Set method to **POST**
3. Enter URL: `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products`
4. Go to **Headers** tab, add:
   - Key: `Content-Type`
   - Value: `application/json`
5. Go to **Body** tab, select **raw** and **JSON**
6. Paste this JSON:
```json
{
  "name": "Wireless Gaming Mouse",
  "description": "RGB LED backlit wireless gaming mouse with 6 programmable buttons",
  "price": 49.99,
  "category": "Mouse",
  "stock": 150
}
```
7. Click **Send**
8. **Save the productId** from response for next steps

#### 2. LIST All Products
1. Create new request
2. Set method to **GET**
3. Enter URL: `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products`
4. Click **Send** (no headers or body needed)

#### 3. GET Single Product
1. Create new request
2. Set method to **GET**
3. Enter URL: `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/{PRODUCT_ID}`
   - Replace `{PRODUCT_ID}` with actual ID from step 1
4. Click **Send**

#### 4. UPDATE Product
1. Create new request
2. Set method to **PUT**
3. Enter URL: `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/{PRODUCT_ID}`
4. Go to **Headers** tab, add:
   - Key: `Content-Type`
   - Value: `application/json`
5. Go to **Body** tab, select **raw** and **JSON**
6. Paste this JSON (update any fields):
```json
{
  "name": "Wireless Gaming Mouse Pro",
  "price": 59.99,
  "stock": 200
}
```
7. Click **Send**

#### 5. DELETE Product
1. Create new request
2. Set method to **DELETE**
3. Enter URL: `https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products/{PRODUCT_ID}`
4. Click **Send** (no headers or body needed)

### Test Data - Complete Product Examples

**Example 1: Gaming Mouse**
```json
{
  "name": "Wireless Gaming Mouse",
  "description": "RGB LED backlit wireless gaming mouse with 6 programmable buttons",
  "price": 49.99,
  "category": "Mouse",
  "stock": 150
}
```

**Example 2: Mechanical Keyboard**
```json
{
  "name": "Mechanical Keyboard RGB",
  "description": "Cherry MX Blue switches with full RGB backlighting and aluminum frame",
  "price": 129.99,
  "category": "Keyboard",
  "stock": 85
}
```

**Example 3: USB-C Docking Station**
```json
{
  "name": "USB-C Docking Station",
  "description": "Multi-port hub with 4K HDMI, USB 3.0, and 100W power delivery",
  "price": 89.99,
  "category": "Docking Station",
  "stock": 60
}
```

**Example 4: Bluetooth Headset**
```json
{
  "name": "Wireless Bluetooth Headset",
  "description": "Noise-cancelling over-ear headset with 30-hour battery life",
  "price": 79.99,
  "category": "Headset",
  "stock": 120
}
```

**Example 5: Webcam**
```json
{
  "name": "Webcam 1080P HD",
  "description": "Full HD webcam with auto-focus and built-in microphone",
  "price": 59.99,
  "category": "Webcam",
  "stock": 95
}
```

**Example 6: External SSD**
```json
{
  "name": "External SSD 1TB",
  "description": "Portable solid-state drive with USB 3.2 Gen 2 interface",
  "price": 119.99,
  "category": "Storage",
  "stock": 75
}
```

**Example 7: Gaming Mouse Pad**
```json
{
  "name": "Gaming Mouse Pad XXL",
  "description": "Extended gaming surface with anti-slip rubber base",
  "price": 24.99,
  "category": "Mouse Pad",
  "stock": 200
}
```

**Example 8: USB Microphone**
```json
{
  "name": "USB Condenser Microphone",
  "description": "Professional-grade USB microphone with pop filter and stand",
  "price": 69.99,
  "category": "Microphone",
  "stock": 110
}
```

**Example 9: Monitor Stand**
```json
{
  "name": "Monitor Stand Dual Arm",
  "description": "Adjustable dual monitor arm mount for screens up to 27 inches",
  "price": 89.99,
  "category": "Monitor Stand",
  "stock": 45
}
```

**Example 10: Wireless Presenter**
```json
{
  "name": "Wireless Presenter Remote",
  "description": "Presentation clicker with laser pointer and 100ft range",
  "price": 29.99,
  "category": "Presenter",
  "stock": 180
}
```

---

## Complete Testing Script

### PowerShell Script to Test All Operations
```powershell
$apiUrl = "https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products"

# 1. CREATE a product
Write-Host "`n=== CREATE Product ===" -ForegroundColor Cyan
$createBody = @{
    name = "Test Mouse"
    description = "Test product for API"
    price = 25.99
    category = "Test"
    stock = 100
} | ConvertTo-Json

$createResponse = Invoke-RestMethod -Uri $apiUrl -Method Post -ContentType "application/json" -Body $createBody
$productId = $createResponse.product.productId
Write-Host "Created Product ID: $productId" -ForegroundColor Green
$createResponse | ConvertTo-Json

# 2. GET single product
Write-Host "`n=== GET Single Product ===" -ForegroundColor Cyan
$getResponse = Invoke-RestMethod -Uri "$apiUrl/$productId" -Method Get
$getResponse | ConvertTo-Json

# 3. LIST all products
Write-Host "`n=== LIST All Products ===" -ForegroundColor Cyan
$listResponse = Invoke-RestMethod -Uri $apiUrl -Method Get
Write-Host "Total Products: $($listResponse.count)" -ForegroundColor Green
$listResponse | ConvertTo-Json

# 4. UPDATE product
Write-Host "`n=== UPDATE Product ===" -ForegroundColor Cyan
$updateBody = @{
    name = "Updated Test Mouse"
    price = 29.99
    stock = 150
} | ConvertTo-Json

$updateResponse = Invoke-RestMethod -Uri "$apiUrl/$productId" -Method Put -ContentType "application/json" -Body $updateBody
$updateResponse | ConvertTo-Json

# 5. DELETE product
Write-Host "`n=== DELETE Product ===" -ForegroundColor Cyan
$deleteResponse = Invoke-RestMethod -Uri "$apiUrl/$productId" -Method Delete
$deleteResponse | ConvertTo-Json

Write-Host "`n=== All Tests Completed ===" -ForegroundColor Green
```

---

## Batch Operations Script

### Create Multiple Products from JSON File
```powershell
$apiUrl = "https://vef41juwgj.execute-api.ap-south-1.amazonaws.com/prod/products"
$products = Get-Content "test-data\products.json" | ConvertFrom-Json

foreach ($product in $products) {
    $body = $product | ConvertTo-Json
    Write-Host "Creating: $($product.name)..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -ContentType "application/json" -Body $body
        Write-Host "✓ Success: Product ID = $($response.product.productId)" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}
```

---

## Field Specifications

### Product Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Product name |
| `description` | String | No | Product description (default: empty string) |
| `price` | Number | No | Product price (default: 0) |
| `category` | String | No | Product category (default: "General") |
| `stock` | Number | No | Available stock quantity (default: 0) |
| `productId` | String | Auto-generated | UUID identifier |
| `createdAt` | Number | Auto-generated | Unix timestamp |
| `updatedAt` | Number | Auto-generated | Unix timestamp |

---

## HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful (GET, PUT, DELETE) |
| 201 | Created | Product created successfully (POST) |
| 400 | Bad Request | Invalid request body or missing required fields |
| 404 | Not Found | Product not found or invalid path |
| 405 | Method Not Allowed | HTTP method not supported for endpoint |
| 500 | Internal Server Error | Server-side error |

---

## Tips for Testing

1. **Save Product IDs**: After creating products, save the returned `productId` for GET/PUT/DELETE operations
2. **Use Variables**: Store API URL and product IDs in variables for easier testing
3. **Error Handling**: Wrap API calls in try-catch blocks for better error handling
4. **Rate Limiting**: Add delays between bulk operations to avoid throttling
5. **JSON Formatting**: Use `ConvertTo-Json` and `ConvertFrom-Json` for proper JSON handling in PowerShell
6. **Logging**: Enable verbose logging to debug API interactions

---

**Document Version:** 1.0  
**Last Updated:** November 30, 2025  
**API Version:** prod
