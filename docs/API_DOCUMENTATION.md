## User API (Brief)

### Base URL

- **Dev**: `http://localhost:3001`
- **Prod**: `https://your-backend.vercel.app`

### Endpoints

1. Register user

- **POST** `/user/register`
- **Body**:

```json
{ "email": "user@example.com", "password": "SecurePass123!" }
```

- **Password rules**: min 8 chars, 1 upper, 1 lower, 1 number, 1 special.
- **201**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

- **Errors**: 400 invalid payload, 409 email exists, 500 server error

2. Login

- **POST** `/user/login`
- **Body**:

```json
{ "email": "user@example.com", "password": "SecurePass123!" }
```

- **200**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

- **Errors**: 401 invalid credentials, 400 invalid payload

3. List users

- **GET** `/user`
- **200**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Notes

- Passwords are never returned.
- See Swagger UI at `/api` for full schema and try-it-out.

### Quick cURL

```bash
# Register
curl -X POST http://localhost:3001/user/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"SecurePass123!"}'

# Login
curl -X POST http://localhost:3001/user/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"SecurePass123!"}'

# List users
curl http://localhost:3001/user
```
