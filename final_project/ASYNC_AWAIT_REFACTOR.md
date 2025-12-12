# Async/Await and Promises Refactoring

## Summary

All CRUD operations have been refactored to use **Async/Await** and **Promises** pattern. Axios has been added as a dependency for potential future external API calls.

## Changes Made

### 1. Package Dependencies
- ✅ Added `axios: ^1.6.0` to `package.json`
- ✅ Installed axios via `npm install`

### 2. CRUD Operations Refactored

#### **CREATE Operations**
- ✅ `POST /register` - User registration (async/await)
- ✅ `PUT /customer/auth/review/:isbn` - Add/Update review (async/await)

#### **READ Operations**
- ✅ `GET /books/` - Get all books (async/await)
- ✅ `GET /isbn/:isbn` - Get book by ISBN (async/await)
- ✅ `GET /author/:author` - Get books by author (async/await)
- ✅ `GET /title/:title` - Get books by title (async/await)
- ✅ `GET /review/:isbn` - Get book reviews (async/await)
- ✅ `POST /customer/login` - User login (async/await)

#### **UPDATE Operations**
- ✅ `PUT /customer/auth/review/:isbn` - Update review (async/await)

#### **DELETE Operations**
- ✅ `DELETE /customer/auth/review/:isbn` - Delete review (async/await)

### 3. Promise-Based Helper Functions Created

#### In `router/auth_users.js`:
- `isValid(username)` - Returns Promise
- `authenticatedUser(username, password)` - Returns Promise
- `getBookByIsbn(isbn)` - Returns Promise
- `createJWT(username)` - Returns Promise

#### In `router/general.js`:
- `getAllBooks()` - Returns Promise
- `getBookByIsbn(isbn)` - Returns Promise
- `getBooksByAuthor(author)` - Returns Promise
- `getBooksByTitle(title)` - Returns Promise
- `getBookReviews(isbn)` - Returns Promise
- `registerUser(username, password)` - Returns Promise

### 4. Error Handling

All route handlers now use `try/catch` blocks for proper error handling:
```javascript
try {
  // async operations
} catch (error) {
  // error handling
}
```

## Code Pattern Examples

### Before (Synchronous):
```javascript
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  // ... rest of code
});
```

### After (Async/Await with Promises):
```javascript
regd_users.put("/auth/review/:isbn", async (req, res) => {
  try {
    const book = await getBookByIsbn(isbn);
    // ... rest of code
  } catch (error) {
    if (error.message === 'Book not found') {
      return res.status(404).json({message: "Book not found"});
    }
    return res.status(500).json({message: "Internal server error"});
  }
});
```

## Benefits

1. ✅ **Consistent Async Pattern**: All operations use async/await
2. ✅ **Better Error Handling**: Try/catch blocks for all operations
3. ✅ **Scalable**: Easy to add database calls or external API calls
4. ✅ **Axios Ready**: Axios is installed for future HTTP requests
5. ✅ **Promise-Based**: All helper functions return Promises

## Testing

All endpoints should work exactly as before, but now with async/await pattern:
- Register user: `POST /register`
- Login: `POST /customer/login`
- Get books: `GET /books/`
- Get book by ISBN: `GET /isbn/:isbn`
- Add review: `PUT /customer/auth/review/:isbn`
- Delete review: `DELETE /customer/auth/review/:isbn`

## Future Enhancements

With this async/await pattern, you can easily:
- Add database operations (MongoDB, PostgreSQL, etc.)
- Make external API calls using Axios
- Add caching layers
- Implement rate limiting
- Add logging/monitoring

## Notes

- All operations are still in-memory (no database yet)
- Axios is available but not currently used (ready for external API calls)
- All Promise-based functions can be easily replaced with actual async operations (database, APIs, etc.)

