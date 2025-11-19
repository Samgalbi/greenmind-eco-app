# GreenMind API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
Currently, all endpoints are public for testing purposes. Authentication will be implemented in future versions.

---

## Users API

### Get All Users
```http
GET /api/users
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "points": 450,
    "level": 4,
    "co2Reduced": 135.5,
    "currentStreak": 5,
    "createdAt": "2024-11-17T10:00:00"
  }
]
```

### Get User by ID
```http
GET /api/users/{id}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "points": 450,
  "level": 4,
  "co2Reduced": 135.5,
  "currentStreak": 5,
  "createdAt": "2024-11-17T10:00:00"
}
```

### Create User
```http
POST /api/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "points": 0,
  "level": 0,
  "co2Reduced": 0.0,
  "currentStreak": 0
}
```

**Response:** `201 Created`
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "points": 0,
  "level": 0,
  "co2Reduced": 0.0,
  "currentStreak": 0,
  "createdAt": "2024-11-17T10:30:00"
}
```

### Update User Points
```http
PUT /api/users/{id}/points
Content-Type: application/json
```

**Request Body:**
```json
{
  "points": 50
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "points": 500,
  "level": 5,
  "co2Reduced": 135.5,
  "currentStreak": 5,
  "createdAt": "2024-11-17T10:00:00"
}
```

**Note:** Points are added to existing points. Level is automatically calculated (points / 100).

### Update User CO2 Reduction
```http
PUT /api/users/{id}/co2
Content-Type: application/json
```

**Request Body:**
```json
{
  "co2": 15.5
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "points": 500,
  "level": 5,
  "co2Reduced": 151.0,
  "currentStreak": 5,
  "createdAt": "2024-11-17T10:00:00"
}
```

**Note:** CO2 is added to existing CO2 reduction.

---

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-11-17T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/users"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-11-17T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "User not found",
  "path": "/api/users/999"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-11-17T10:00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Database connection failed",
  "path": "/api/users"
}
```

---

## Data Models

### User
```typescript
{
  id: number;              // Auto-generated
  name: string;            // Required
  email: string;           // Required, unique
  points: number;          // Default: 0
  level: number;           // Auto-calculated (points / 100)
  co2Reduced: number;      // Default: 0.0
  currentStreak: number;   // Default: 0
  createdAt: string;       // Auto-generated (ISO 8601)
}
```

---

## Testing with cURL

### Create User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

### Get All Users
```bash
curl http://localhost:8080/api/users
```

### Update Points
```bash
curl -X PUT http://localhost:8080/api/users/1/points \
  -H "Content-Type: application/json" \
  -d '{"points":50}'
```

---

## Future Endpoints (To Be Implemented)

- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes/submit` - Submit quiz answers
- `GET /api/missions` - Get all missions
- `PUT /api/missions/{id}/progress` - Update mission progress
- `GET /api/tips` - Get all eco tips
- `POST /api/tips/{id}/like` - Like a tip
- `GET /api/stats/global-co2` - Get global CO2 statistics
