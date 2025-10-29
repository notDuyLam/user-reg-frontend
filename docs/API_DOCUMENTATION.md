# User Registration API Documentation

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://your-backend.vercel.app` (replace with your deployed URL)

## Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /user/register`

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Parameters:**

| Field    | Type   | Required | Description                           |
| -------- | ------ | -------- | ------------------------------------- |
| email    | string | Yes      | Valid email address (must be unique)  |
| password | string | Yes      | Password (see validation rules below) |

**Password Requirements:**

- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (@$!%\*?&#)

**Example Success Response (201 Created):**

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

**Example Error Responses:**

**400 Bad Request - Validation Error:**

```json
{
  "statusCode": 400,
  "message": [
    "Please provide a valid email address",
    "Password must be at least 8 characters long",
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ],
  "error": "Bad Request"
}
```

**409 Conflict - Email Already Exists:**

```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

**500 Internal Server Error:**

```json
{
  "statusCode": 500,
  "message": "Failed to create user",
  "error": "Internal Server Error"
}
```

## Integration Examples

### Using Fetch API (Vanilla JavaScript)

```javascript
async function registerUser(email, password) {
  try {
    const response = await fetch('http://localhost:3001/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    console.log('Registration successful:', data);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Usage
registerUser('user@example.com', 'SecurePass123!')
  .then((result) => {
    console.log('User registered:', result.data);
  })
  .catch((error) => {
    console.error('Failed to register:', error.message);
  });
```

### Using Axios

```javascript
import axios from 'axios';

async function registerUser(email, password) {
  try {
    const response = await axios.post(
      'http://localhost:3001/user/register',
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error('Server error:', error.response.data);
      throw new Error(error.response.data.message || 'Registration failed');
    } else {
      // Network or other error
      console.error('Network error:', error.message);
      throw error;
    }
  }
}

// Usage
registerUser('user@example.com', 'SecurePass123!')
  .then((result) => {
    console.log('User registered:', result.data);
  })
  .catch((error) => {
    console.error('Failed to register:', error.message);
  });
```

### Using React with React Query

```typescript
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface RegisterData {
  email: string;
  password: string;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    createdAt: string;
  };
}

async function registerUser(data: RegisterData): Promise<UserResponse> {
  const response = await axios.post<UserResponse>(
    'http://localhost:3001/user/register',
    data
  );
  return response.data;
}

function RegisterForm() {
  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log('Registration successful:', data);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required />
      <input type="password" name="password" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Registering...' : 'Register'}
      </button>
      {isError && <p>Error: {error?.message}</p>}
      {isSuccess && <p>Registration successful!</p>}
    </form>
  );
}
```

### Using React Hook Form + React Query

```typescript
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

async function registerUser(data: RegisterFormData) {
  const response = await axios.post('http://localhost:3001/user/register', data);
  return response.data;
}

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: registerUser,
  });

  const onSubmit = (data: RegisterFormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="email"
          {...register('email')}
          placeholder="Email"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <input
          type="password"
          {...register('password')}
          placeholder="Password"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Registering...' : 'Register'}
      </button>

      {isError && <p>Registration failed. Please try again.</p>}
      {isSuccess && <p>Registration successful!</p>}
    </form>
  );
}
```

## Error Handling Guide

### 400 Bad Request

Occurs when:

- Email format is invalid
- Password doesn't meet requirements
- Required fields are missing

**Client-side validation before sending:**

```javascript
function validateForm(email, password) {
  const errors = [];

  if (!email || !email.includes('@')) {
    errors.push('Please provide a valid email address');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&#])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return errors;
}
```

### 409 Conflict

Occurs when:

- User with the provided email already exists

**Handling:**

```javascript
if (error.response?.status === 409) {
  // Show message: "This email is already registered. Please log in instead."
  // Redirect to login page
}
```

### 500 Internal Server Error

Occurs when:

- Database connection fails
- Unexpected server error

**Handling:**

```javascript
if (error.response?.status === 500) {
  // Show message: "Server error. Please try again later."
  // Log error for debugging
}
```

## Testing with cURL

```bash
# Successful registration
curl -X POST http://localhost:3001/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'

# Validation error (weak password)
curl -X POST http://localhost:3001/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com","password":"weak"}'

# Duplicate email (409 Conflict)
curl -X POST http://localhost:3001/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"AnotherPass456!"}'
```

## Notes

- ✅ Passwords are automatically hashed (never sent back in responses)
- ✅ Email addresses must be unique in the database
- ✅ CORS is enabled for development (`http://localhost:3000`)
- ✅ Production CORS must be configured with your frontend URL
- ✅ All timestamps are in ISO 8601 format (UTC)
- ✅ Response format is consistent across all endpoints

## Support

For issues or questions:

- Check API base URL is correct
- Verify CORS is configured for your frontend domain
- Check network tab in browser dev tools
- Review backend logs for server errors
