const { query } = require('./database');
const fs = require('fs');
const path = require('path');

// Read the schema SQL file
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Migrate existing books from booksdb.js
const migrateBooks = async () => {
  try {
    const books = require('../../router/booksdb');
    
    console.log('Migrating books from booksdb.js to PostgreSQL...');
    
    for (const [isbn, bookData] of Object.entries(books)) {
      // Check if book already exists
      const existing = await query(
        'SELECT id FROM books WHERE isbn = $1',
        [isbn]
      );
      
      if (existing.rows.length === 0) {
        await query(
          'INSERT INTO books (isbn, title, author) VALUES ($1, $2, $3)',
          [isbn, bookData.title, bookData.author]
        );
        console.log(`Migrated book: ${bookData.title} (ISBN: ${isbn})`);
      } else {
        console.log(`Book already exists: ${bookData.title} (ISBN: ${isbn})`);
      }
    }
    
    console.log('Book migration completed!');
  } catch (error) {
    console.error('Error migrating books:', error);
    throw error;
  }
};

// Run migrations
const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    
    // Execute schema
    const statements = schema.split(';').filter(s => s.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await query(statement);
        } catch (error) {
          // Ignore "already exists" errors
          if (!error.message.includes('already exists')) {
            console.warn('Migration warning:', error.message);
          }
        }
      }
    }
    
    console.log('Schema created successfully!');
    
    // Migrate existing books
    await migrateBooks();
    
    console.log('All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations, migrateBooks };


