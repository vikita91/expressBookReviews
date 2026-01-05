const { sequelize, Review } = require('../models');

const clearReviews = async () => {
  try {
    console.log('🗑️  Clearing all reviews from database...');
    
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    // Delete all reviews
    const deleted = await Review.destroy({
      where: {},
      truncate: true,
    });
    
    console.log(`✓ Deleted all reviews`);
    console.log('✓ Reviews cleared successfully');
    console.log('\n💡 Books and users remain intact.');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to clear reviews:', error);
    process.exit(1);
  }
};

clearReviews();


