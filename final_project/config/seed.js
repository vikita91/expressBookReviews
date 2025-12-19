const { sequelize, Book, User } = require('../src/models');
const { Model } = require('sequelize');
const booksData = require('../router/booksdb');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    // Seed books from booksdb.js
    console.log('\nSeeding books...');
    for (const [isbn, bookData] of Object.entries(booksData)) {
      try {
        // Use upsert for simplicity (creates or updates)
        await sequelize.models.Book.upsert({
          isbn,
          title: bookData.title,
          author: bookData.author,
        });
        
        console.log(`  ✓ Seeded book: "${bookData.title}" by ${bookData.author} (ISBN: ${isbn})`);
      } catch (error) {
        console.error(`  ✗ Error seeding book ISBN ${isbn}:`, error.message);
      }
    }
    
    console.log('\n✓ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

