const { sequelize, Book, User } = require('../models');
const { Model } = require('sequelize');
const booksData = require('../../scripts/booksdb');

const seedDatabase = async () => {
  try {
    // Skip seeding in production unless explicitly enabled
    if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_SEEDING) {
      console.log('⚠️  Skipping seeding in production mode.');
      console.log('   Set ENABLE_SEEDING=true to enable seeding in production.');
      process.exit(0);
    }

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

