const { sequelize } = require('../config/sequelize');
const User = require('./User');
const Book = require('./Book');
const Review = require('./Review');

// Define associations
Book.hasMany(Review, {
  foreignKey: 'book_id',
  as: 'reviews',
  onDelete: 'CASCADE',
});

Review.belongsTo(Book, {
  foreignKey: 'book_id',
  as: 'book',
});

User.hasMany(Review, {
  foreignKey: 'user_id',
  as: 'reviews',
  onDelete: 'SET NULL',
});

Review.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Sync all models (only for development, use migrations in production)
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✓ Database synced successfully');
  } catch (error) {
    console.error('✗ Database sync failed:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Book,
  Review,
  syncDatabase,
};



