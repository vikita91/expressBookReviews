# Book Reviews API

A RESTful API for managing book reviews with JWT authentication, PostgreSQL database, and Docker support.

## 🚀 Features

- ✅ **Docker Compose** - One command to run everything
- ✅ **PostgreSQL Database** with Sequelize ORM
- ✅ **Hot Reload** - Auto-restart on code changes
- ✅ **Database Seeding** - Sample data included
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation
- ✅ Rate limiting & security headers
- ✅ CORS support
- ✅ Clean MVC architecture

## 📁 Project Structure

```
final_project/
├── config/              # Configuration files
│   ├── config.js        # App configuration
│   ├── database.js      # PostgreSQL database connection
│   ├── migrate.js       # Database migration script
│   └── schema.sql       # Database schema
├── src/                  # Source code
│   ├── controllers/     # Route controllers (business logic)
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── reviewController.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js      # Authentication middleware
│   │   ├── errorHandler.js  # Global error handler
│   │   └── notFound.js  # 404 handler
│   ├── models/          # Data models/services
│   │   ├── User.js      # User model (currently in-memory)
│   │   └── Book.js      # Book model (currently in-memory)
│   ├── routes/          # Route definitions
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   └── reviewRoutes.js
│   ├── utils/           # Utility functions
│   │   └── jwt.js       # JWT helpers
│   └── validators/      # Input validation
│       ├── authValidator.js
│       └── reviewValidator.js
├── router/              # Legacy router files
│   ├── auth_users.js    # Legacy auth (deprecated)
│   ├── booksdb.js       # In-memory book database
│   └── general.js       # Legacy routes (deprecated)
├── index.js             # Server entry point
├── package.json
├── .env.example         # Environment variables template
└── .gitignore           # Git ignore rules
```

## 🛠️ Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- That's it! No need to install Node.js, PostgreSQL, or anything else

### Start the Application

```bash
# Clone the repository
git clone <repository-url>
cd expressBookReviews/final_project

# Start everything with Docker Compose
docker-compose up

# That's it! 🎉
```

The API is now running at **http://localhost:5000**

**What just happened?**
- ✅ PostgreSQL database started
- ✅ Database tables created
- ✅ Sample books seeded
- ✅ API server running with hot reload

### Stop the Application

```bash
# Stop containers (keeps data)
docker-compose down

# Stop and remove all data
docker-compose down -v
```

### View Logs

```bash
# View all logs
docker-compose logs -f

# View only API logs
docker-compose logs -f api
```

## 🧪 Test the API

```bash
# Health check
curl http://localhost:5000/health

# Get all books
curl http://localhost:5000/api/books

# Register a user
curl -X POST http://localhost:5000/api/customer/register \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}'

# Login
curl -X POST http://localhost:5000/api/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}' \
  -c cookies.txt

# Add a review (requires login)
curl -X PUT http://localhost:5000/api/customer/auth/review/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"review": "Great book!"}'
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

## 💻 Local Development

### Making Code Changes

The application uses **hot reload** - any code changes automatically restart the server!

1. Edit files in your IDE
2. Save the file
3. Watch the terminal - you'll see:
   ```
   bookreviews-api  | [nodemon] restarting due to changes...
   bookreviews-api  | [nodemon] starting `node index.js`
   ```
4. Test your changes immediately!

### Access the Database

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d bookreviews

# View tables
\dt

# View books
SELECT * FROM books;

# View users
SELECT id, username, created_at FROM users;

# Exit
\q
```

### Useful Commands

```bash
# Restart the API (picks up environment changes)
docker-compose restart api

# Rebuild after dependency changes
docker-compose up --build

# View container status
docker-compose ps

# Execute command in container
docker-compose exec api npm run db:seed

# Clean restart
docker-compose down -v && docker-compose up
```

## 🗄️ Database Management

### Seed Data

```bash
# Seed sample books
docker-compose exec api npm run db:seed

# Clear all books and re-seed
docker-compose exec api npm run db:seed:force

# Clear books only
docker-compose exec api npm run db:clear
```

### Reset Database

```bash
# Complete reset (removes all data)
docker-compose down -v
docker-compose up

# Or manually
docker-compose exec postgres psql -U postgres -d bookreviews -c "TRUNCATE books, users, reviews CASCADE;"
```

### Database Credentials (Docker)

When running with Docker Compose, these are pre-configured:
- **Host**: postgres (container name)
- **Port**: 5432
- **Database**: bookreviews
- **User**: postgres
- **Password**: postgres

## 📝 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start server (production) |
| `npm run dev` | Start with auto-reload (development) |
| `npm run db:migrate` | Create database tables |
| `npm run db:seed` | Seed sample books |
| `npm run db:seed:force` | Clear and re-seed |
| `npm run db:clear` | Clear all books |
| `npm run docker:up` | Start Docker Compose |
| `npm run docker:down` | Stop Docker Compose |
| `npm run docker:logs` | View Docker logs |

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

## 📚 Additional Documentation

- **[DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)** - Quick Docker reference
- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Complete Docker guide with production deployment
- **[SEEDING_GUIDE.md](SEEDING_GUIDE.md)** - How to add and manage seed data
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Production deployment guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change ports in docker-compose.yml
services:
  api:
    ports:
      - "3000:5000"  # Use port 3000 instead
```

### Database Connection Error

```bash
# Check if containers are running
docker-compose ps

# Check logs
docker-compose logs postgres
docker-compose logs api

# Restart everything
docker-compose restart
```

### Can't See Code Changes

```bash
# Rebuild containers
docker-compose up --build

# Or restart API only
docker-compose restart api
```

### Reset Everything

```bash
# Complete reset
docker-compose down -v
docker-compose up --build
```

## 🏗️ Project Structure

```
final_project/
├── config/
│   ├── config.js           # App configuration
│   ├── sequelize.js        # Database connection
│   ├── migrate.js          # Database migrations
│   ├── seed.js             # Database seeding
│   └── clear-books.js      # Clear database
├── src/
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, error handling
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   └── validators/         # Input validation
├── docker-compose.yml      # Docker services config
├── Dockerfile              # Docker image config
├── index.js                # Server entry point
└── package.json            # Dependencies
```

## 🔧 Tech Stack

- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT + Session-based
- **Security**: Helmet, bcrypt, rate limiting
- **Validation**: express-validator
- **Containerization**: Docker & Docker Compose
- **Development**: Nodemon (hot reload)

## 📄 License

MIT

## 👤 Author

Your Name

---

## ⚡ Features & Benefits

### Development Experience
- ✅ **One-command setup** - `docker-compose up` and you're ready
- ✅ **Hot reload** - Changes reflect instantly
- ✅ **No local setup** - Everything runs in containers
- ✅ **Sample data** - Pre-seeded books for testing
- ✅ **Easy cleanup** - Remove everything with one command

### Production Ready
- ✅ **PostgreSQL** - Enterprise-grade database
- ✅ **Sequelize ORM** - Type-safe database queries
- ✅ **Connection pooling** - Handles concurrent requests
- ✅ **Security** - Password hashing, rate limiting, CORS
- ✅ **Error handling** - Comprehensive error messages
- ✅ **Logging** - Request and query logging

### Architecture
- ✅ **MVC Pattern** - Organized code structure
- ✅ **RESTful API** - Standard HTTP methods
- ✅ **JWT Auth** - Stateless authentication
- ✅ **Input validation** - Server-side validation
- ✅ **Docker ready** - Easy deployment anywhere

## 📄 License

MIT

---

**Happy Coding!** 🚀

For questions or issues, check the documentation or review the code comments.



