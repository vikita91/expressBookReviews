# Book Reviews API

A production-ready RESTful API for managing book reviews with JWT authentication, built with Node.js and Express.js.

## 🚀 Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation with express-validator
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ CORS support
- ✅ Error handling middleware
- ✅ Request logging (Morgan)
- ✅ Environment-based configuration
- ✅ Clean architecture (MVC pattern)

## 📁 Project Structure

```
final_project/
├── config/           # Configuration files
│   └── config.js     # App configuration
├── controllers/      # Route controllers
│   ├── authController.js
│   ├── bookController.js
│   └── reviewController.js
├── middleware/       # Custom middleware
│   ├── auth.js       # Authentication middleware
│   ├── errorHandler.js
│   └── notFound.js
├── models/           # Data models/services
│   ├── User.js
│   └── Book.js
├── routes/           # Route definitions
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   └── reviewRoutes.js
├── utils/            # Utility functions
│   └── jwt.js        # JWT helpers
├── validators/       # Input validation
│   ├── authValidator.js
│   └── reviewValidator.js
├── router/           # Legacy (booksdb.js)
│   └── booksdb.js
├── index.js          # Server entry point
├── package.json
└── .env.example      # Environment variables template
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expressBookReviews/final_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the values:
   - `JWT_SECRET` - Strong secret for JWT tokens
   - `SESSION_SECRET` - Strong secret for sessions
   - `PORT` - Server port (default: 5000)

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication

- **POST** `/api/customer/register` - Register a new user
  ```json
  {
    "username": "alice",
    "password": "password123"
  }
  ```

- **POST** `/api/customer/login` - Login user
  ```json
  {
    "username": "alice",
    "password": "password123"
  }
  ```

### Books (Public)

- **GET** `/api/books` - Get all books
- **GET** `/api/isbn/:isbn` - Get book by ISBN
- **GET** `/api/author/:author` - Get books by author
- **GET** `/api/title/:title` - Get books by title
- **GET** `/api/review/:isbn` - Get reviews for a book

### Reviews (Protected - Requires Authentication)

- **PUT** `/api/customer/auth/review/:isbn` - Add/update review
  ```json
  {
    "review": "This is a great book!"
  }
  ```

- **DELETE** `/api/customer/auth/review/:isbn` - Delete review

### Health Check

- **GET** `/health` - Server health check

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcrypt before storage
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse (100 requests per 15 minutes)
- **Helmet**: Security headers protection
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: All inputs are validated and sanitized
- **Session Security**: Secure, httpOnly cookies in production

## 🧪 Testing with Postman

1. **Register a user**
   ```
   POST http://localhost:5000/api/customer/register
   Body: { "username": "alice", "password": "password123" }
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/customer/login
   Body: { "username": "alice", "password": "password123" }
   ```
   Note: Session cookie is automatically saved

3. **Browse books**
   ```
   GET http://localhost:5000/api/books
   ```

4. **Add review** (requires login)
   ```
   PUT http://localhost:5000/api/customer/auth/review/1
   Body: { "review": "Great book!" }
   ```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `JWT_SECRET` | Secret for JWT tokens | access |
| `JWT_EXPIRES_IN` | Token expiration time | 1h |
| `SESSION_SECRET` | Secret for sessions | fingerprint_customer |
| `CORS_ORIGIN` | Allowed CORS origin | * |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🏗️ Architecture

### **MVC Pattern**
- **Models**: Data access layer (User, Book)
- **Controllers**: Business logic and request handling
- **Routes**: Route definitions
- **Middleware**: Authentication, validation, error handling

### **Separation of Concerns**
- Business logic in controllers
- Data access in models
- Validation in validators
- Authentication in middleware
- Configuration in config files

## 🔄 Migration from Legacy Code

The old routes are still functional but deprecated:
- Old: `/register` → New: `/api/customer/register`
- Old: `/customer/login` → New: `/api/customer/login`
- Old: `/books/` → New: `/api/books`
- Old: `/isbn/:isbn` → New: `/api/isbn/:isbn`

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong secrets for `JWT_SECRET` and `SESSION_SECRET`
3. Configure `CORS_ORIGIN` to your frontend domain
4. Use a process manager like PM2
5. Set up proper logging
6. Use HTTPS in production
7. Replace in-memory storage with a database

## 📦 Dependencies

- **express** - Web framework
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - CORS support
- **express-rate-limit** - Rate limiting
- **morgan** - HTTP request logger
- **dotenv** - Environment variables
- **express-session** - Session management

## 📄 License

MIT

## 👤 Author

Your Name

---

**Note**: This is a production-ready structure. For actual production deployment, consider:
- Database integration (MongoDB, PostgreSQL, etc.)
- Redis for session storage
- Proper logging service
- Monitoring and alerting
- CI/CD pipeline
- API documentation (Swagger/OpenAPI)



