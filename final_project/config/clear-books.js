const { sequelize, Book } = require('../src/models');

const clearBooks = async () => {
  try {
    console.log('🗑️  Clearing all books from database...');
    
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    // Delete all books (reviews will cascade delete)
    const deleted = await Book.destroy({
      where: {},
      truncate: true,
      cascade: true,
    });
    
    console.log(`✓ Deleted ${deleted} books`);
    console.log('✓ Books cleared successfully');
    console.log('\n💡 Now run: npm run db:seed');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to clear books:', error);
    process.exit(1);
  }
};

clearBooks();

