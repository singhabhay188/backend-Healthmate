# API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication
Some endpoints require authentication token in the header:
```http
auth: Bearer {user-id}
```

## User Routes
### Sign Up
- **Endpoint:** `POST /user/signup`
- **Description:** Create a new user account
- **Body:**
```json
{
    "name": "string (required)",
    "phone": "string (required)",
    "email": "string (optional)"
}
```
- **Response:** 
```json
{
    "success": true,
    "token": "user_id"
}
```

### Login
- **Endpoint:** `POST /user/login`
- **Description:** Login with phone number
- **Body:**
```json
{
    "phone": "string"
}
```
- **Response:** Message indicating OTP sent

### Verify OTP
- **Endpoint:** `POST /user/verifyOtp`
- **Description:** Verify OTP (default: 1234)
- **Body:**
```json
{
    "phone": "string",
    "otp": "string"
}
```
- **Response:**
```json
{
    "success": true,
    "token": "user_id"
}
```

### Verify Login Status
- **Endpoint:** `GET /user/verifyLoggedIn`
- **Auth Required:** Yes
- **Response:** Success status

### Get User Orders
- **Endpoint:** `GET /user/orders`
- **Auth Required:** Yes
- **Response:** Array of user's orders with product details

## Product Routes
### Get All Products
- **Endpoint:** `GET /product/all`
- **Description:** Returns maximum 15 products
- **Response:** Array of products

### Search Products
- **Endpoint:** `GET /product/search?query={searchTerm}`
- **Description:** Search products by name (minimum 3 characters)
- **Query Params:** `query` (string, min length: 3)
- **Response:** Array of matching products

## Order Routes
### Create New Order
- **Endpoint:** `POST /order/new`
- **Auth Required:** Yes
- **Body:**
```json
{
    "products": [
        {
            "id": "string",
            "quantity": number
        }
    ]
}
```
- **Response:** Created order details

### Get User Orders
- **Endpoint:** `GET /order/all`
- **Auth Required:** Yes
- **Description:** Returns maximum 5 orders
- **Response:** Array of orders with product details

## Admin Routes
### Add New Product
- **Endpoint:** `POST /admin/new`
- **Body:**
```json
{
    "name": "string",
    "description": "string",
    "imageLink": ["string"],
    "type": "string",
    "quantity": number,
    "productType": "string",
    "categories": ["string"],
    "brand": "string"
}
```

### Get All Orders
- **Endpoint:** `GET /admin/orders`
- **Description:** Returns maximum 10 orders

### Get Pending Orders
- **Endpoint:** `GET /admin/pendingOrders`
- **Description:** Returns all pending orders

### Get Order Details
- **Endpoint:** `GET /admin/order/:id`
- **Params:** `id` (order ID)

### Update Order Status
- **Endpoint:** `POST /admin/order/:id`
- **Params:** `id` (order ID)
- **Body:**
```json
{
    "status": "string"
}
```

## Brand Routes
### Get All Brands
- **Endpoint:** `GET /brand/all`
- **Response:** List of all brands

### Get Products by Brand
- **Endpoint:** `GET /brand/:brandName`
- **Params:** `brandName` (string)
- **Response:** Products of specified brand

## Category Routes
### Get All Categories
- **Endpoint:** `GET /category/all`
- **Response:** List of all categories

### Get Products by Category
- **Endpoint:** `GET /category/:categoryName`
- **Params:** `categoryName` (string)
- **Response:** Products in specified category

## Response Format
Most endpoints return data in this format:
```json
{
    "success": boolean,
    "data": object | array
}
```

## Error Responses
Error responses follow this format:
```json
{
    "success": false,
    "message": "Error description"
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error