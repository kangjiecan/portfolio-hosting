# OAuth Token Exchange API Documentation

## Endpoints

### Exchange Authorization Code for Tokens
Exchange an OAuth authorization code for access and ID tokens.

**Endpoint:** `POST /token-exchange`

#### Curl Example
```bash
curl -X POST https://your-api-endpoint/token-exchange \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  --include \
  -d '{
    "code": "your-authorization-code"
  }'
```

#### Request Format
```http
POST /token-exchange HTTP/1.1
Host: your-api-endpoint
Content-Type: application/json
Origin: http://localhost:5173

{
    "code": "your-authorization-code"
}
```

#### Successful Response (200 OK)
```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Set-Cookie: accessToken=<token>; HttpOnly; Secure; SameSite=None; Domain=execute-api.ca-central-1.amazonaws.com; Path=/; Max-Age=3600

{
    "success": true,
    "tokens": {
        "access_token": "eyJhbGci...",
        "id_token": "eyJhbGci..."
    }
}
```

#### Error Response (400 Bad Request)
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
    "error": "Invalid authorization code format"
}
```

#### Error Response (500 Server Error)
```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
    "error": "Failed to process token exchange",
    "details": "Error message details"
}
```

## Code Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

async function exchangeToken(code) {
  try {
    const response = await axios.post('https://your-api-endpoint/token-exchange', {
      code: code
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    return response.data;
  } catch (error) {
    console.error('Exchange failed:', error.response?.data || error.message);
    throw error;
  }
}
```

### Python
```python
import requests

def exchange_token(code):
    url = 'https://your-api-endpoint/token-exchange'
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
    }
    data = {
        'code': code
    }
    
    response = requests.post(
        url,
        json=data,
        headers=headers,
        cookies=True  # Enable cookie handling
    )
    
    response.raise_for_status()
    return response.json()
```

### Browser Fetch
```javascript
async function exchangeToken(code) {
  const response = await fetch('https://your-api-endpoint/token-exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ code })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}
```

## Important Notes

1. **CORS Requirements**
   ```bash
   # Test CORS preflight
   curl -X OPTIONS https://your-api-endpoint/token-exchange \
     -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -v
   ```

2. **Cookie Handling**
   - Tokens are automatically stored in HTTP-only cookies
   - Cookies are secure and SameSite=None
   - Cookie lifetime is 1 hour
   - Domain is set to execute-api.ca-central-1.amazonaws.com

3. **Security Requirements**
   - Always use HTTPS
   - Include credentials in requests
   - Only requests from http://localhost:5173 are allowed

## Testing Examples

### Test with curl (including cookie handling)
```bash
# Full test with cookie handling
curl -X POST https://your-api-endpoint/token-exchange \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  --cookie-jar cookies.txt \
  --include \
  -d '{
    "code": "test-auth-code"
  }'

# Subsequent request using stored cookie
curl https://your-api-endpoint/protected-resource \
  --cookie cookies.txt \
  -H "Origin: http://localhost:5173" \
  --include
```

### Test Error Handling
```bash
# Test invalid code
curl -X POST https://your-api-endpoint/token-exchange \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  --include \
  -d '{
    "code": ""
  }'
```




# DynamoDB Query API Documentation

## API Endpoint
`GET /items`

This API provides access to posts and media items stored in DynamoDB, with options to query by ID or user ID.

## Query Parameters

| Parameter | Type   | Description                              |
|-----------|--------|------------------------------------------|
| type      | string | Item type: "post" or "media" (optional, defaults to "post") |
| id        | string | Specific item ID to retrieve (optional)  |
| userId    | string | User ID to filter items by (optional)    |

## Examples

### Get Post by ID

```bash
# Get a specific post
curl "https://your-api-endpoint/items?type=post&id=post123"
```

Response:
```json
{
    "postID": "post123",
    "title": "Sample Post",
    "content": "Post content here",
    "userID": "user456",
    "timestamp": "2024-01-01T12:00:00Z"
}
```

### Get Media by ID

```bash
# Get a specific media item
curl "https://your-api-endpoint/items?type=media&id=media789"
```

Response:
```json
{
    "mediaID": "media789",
    "url": "https://example.com/media.jpg",
    "type": "image",
    "userID": "user456",
    "timestamp": "2024-01-01T12:00:00Z"
}
```

### List User's Posts

```bash
# Get all posts for a specific user
curl "https://your-api-endpoint/items?type=post&userId=user456"
```

Response:
```json
[
    {
        "postID": "post123",
        "title": "First Post",
        "content": "Content here",
        "userID": "user456",
        "timestamp": "2024-01-01T12:00:00Z"
    },
    {
        "postID": "post124",
        "title": "Second Post",
        "content": "More content",
        "userID": "user456",
        "timestamp": "2024-01-01T13:00:00Z"
    }
]
```

### List User's Media

```bash
# Get all media items for a specific user
curl "https://your-api-endpoint/items?type=media&userId=user456"
```

Response:
```json
[
    {
        "mediaID": "media789",
        "url": "https://example.com/media1.jpg",
        "type": "image",
        "userID": "user456",
        "timestamp": "2024-01-01T12:00:00Z"
    },
    {
        "mediaID": "media790",
        "url": "https://example.com/media2.jpg",
        "type": "image",
        "userID": "user456",
        "timestamp": "2024-01-01T13:00:00Z"
    }
]
```

### List All Posts

```bash
# Get all posts (default behavior)
curl "https://your-api-endpoint/items"
# OR explicitly specify type
curl "https://your-api-endpoint/items?type=post"
```

Response:
```json
[
    {
        "postID": "post123",
        "title": "Sample Post 1",
        "content": "Content here",
        "userID": "user456",
        "timestamp": "2024-01-01T12:00:00Z"
    },
    {
        "postID": "post124",
        "title": "Sample Post 2",
        "content": "More content",
        "userID": "user789",
        "timestamp": "2024-01-01T13:00:00Z"
    }
]
```

### List All Media

```bash
# Get all media items
curl "https://your-api-endpoint/items?type=media"
```

Response:
```json
[
    {
        "mediaID": "media789",
        "url": "https://example.com/media1.jpg",
        "type": "image",
        "userID": "user456",
        "timestamp": "2024-01-01T12:00:00Z"
    },
    {
        "mediaID": "media790",
        "url": "https://example.com/media2.jpg",
        "type": "image",
        "userID": "user789",
        "timestamp": "2024-01-01T13:00:00Z"
    }
]
```

## JavaScript Examples

```javascript
// Fetch a specific post
async function getPost(postId) {
    const response = await fetch(`https://your-api-endpoint/items?type=post&id=${postId}`);
    return response.json();
}

// Get all posts for a user
async function getUserPosts(userId) {
    const response = await fetch(`https://your-api-endpoint/items?type=post&userId=${userId}`);
    return response.json();
}

// Get all media for a user
async function getUserMedia(userId) {
    const response = await fetch(`https://your-api-endpoint/items?type=media&userId=${userId}`);
    return response.json();
}
```

## Error Responses

### Not Found (404)
```json
{
    "message": "Post not found"
}
```

### Internal Server Error (500)
```json
{
    "message": "Internal server error"
}
```

## Notes

1. The API uses CORS and allows requests from any origin (`*`)
2. All responses are in JSON format
3. When no type is specified, the API defaults to returning all posts
4. The API supports three main query patterns:
   - Get single item by ID
   - Get items by user ID
   - Get all items of a type


# DynamoDB CRUD Operations API

## Base URL
`https://your-api-endpoint`

## Posts API

### Create Post
Create a new post in the system.

```http
POST /post
```

#### Request Body
```json
{
    "postID": "string",
    "userID": "string",
    "title": "string",
    "content": "string"
}
```

```bash
curl -X POST https://your-api-endpoint/post \
  -H "Content-Type: application/json" \
  -d '{
    "postID": "post123",
    "userID": "user456",
    "title": "My First Post",
    "content": "Hello World!"
  }'
```

#### Success Response (201)
```json
{
    "message": "Post created successfully",
    "postID": "post123",
    "title": "My First Post"
}
```

### Update Post
Update an existing post.

```http
PUT /post/{postID}
```

#### Request Body
```json
{
    "title": "string",   // optional
    "content": "string"  // optional
}
```

```bash
curl -X PUT https://your-api-endpoint/post/post123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content"
  }'
```

#### Success Response (200)
```json
{
    "message": "Post updated successfully",
    "post": {
        "postID": "post123",
        "title": "Updated Title",
        "content": "Updated content",
        "updatedAt": "2024-12-27T10:00:00Z"
    }
}
```

### Delete Post
Delete an existing post.

```http
DELETE /post/{postID}
```

```bash
curl -X DELETE https://your-api-endpoint/post/post123
```

#### Success Response (200)
```json
{
    "message": "Post deleted successfully"
}
```

## Media API

### Create Media
Create a new media entry.

```http
POST /media
```

#### Request Body
```json
{
    "mediaID": "string",
    "userID": "string",
    "type": "string",
    "url": "string"
}
```

```bash
curl -X POST https://your-api-endpoint/media \
  -H "Content-Type: application/json" \
  -d '{
    "mediaID": "media789",
    "userID": "user456",
    "type": "image",
    "url": "https://example.com/image.jpg"
  }'
```

#### Success Response (201)
```json
{
    "message": "Media created successfully",
    "mediaID": "media789"
}
```

### Delete Media
Delete an existing media entry.

```http
DELETE /media/{mediaID}
```

```bash
curl -X DELETE https://your-api-endpoint/media/media789
```

#### Success Response (200)
```json
{
    "message": "Media deleted successfully"
}
```

## Error Responses

### Bad Request (400)
```json
{
    "message": "Title is required"
}
```

### Not Found (404)
```json
{
    "message": "Post not found"
}
```

### Conflict (409)
```json
{
    "message": "Post already exists"
}
```

### Internal Server Error (500)
```json
{
    "message": "Internal server error",
    "details": "Error details message"
}
```

## JavaScript Examples

### Create Post
```javascript
async function createPost(postData) {
    const response = await fetch('https://your-api-endpoint/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });
    return response.json();
}

// Usage
const post = await createPost({
    postID: 'post123',
    userID: 'user456',
    title: 'My Post',
    content: 'Content here'
});
```

### Update Post
```javascript
async function updatePost(postId, updateData) {
    const response = await fetch(`https://your-api-endpoint/post/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    return response.json();
}

// Usage
const updated = await updatePost('post123', {
    title: 'Updated Title',
    content: 'Updated content'
});
```

### Delete Post
```javascript
async function deletePost(postId) {
    const response = await fetch(`https://your-api-endpoint/post/${postId}`, {
        method: 'DELETE'
    });
    return response.json();
}

// Usage
const result = await deletePost('post123');
```

### Create Media
```javascript
async function createMedia(mediaData) {
    const response = await fetch('https://your-api-endpoint/media', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mediaData)
    });
    return response.json();
}

// Usage
const media = await createMedia({
    mediaID: 'media789',
    userID: 'user456',
    type: 'image',
    url: 'https://example.com/image.jpg'
});
```

## Notes

1. All responses include CORS headers allowing any origin (`*`)
2. Timestamps (`createdAt`, `updatedAt`) are automatically added in ISO 8601 format
3. Post updates will always include an `updatedAt` timestamp
4. All IDs must be unique within their respective tables
5. Required fields:
   - Posts: `postID`, `title`
   - Media: `mediaID`, `userID`, `type`, `url`
