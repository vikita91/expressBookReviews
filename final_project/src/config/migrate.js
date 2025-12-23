const { sequelize, syncDatabase } = require('../models');

const runMigration = async () => {
  try {
    console.log('Starting database migration...');
    
    // Test connection first
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    // Sync all models with force: false (won't drop existing tables)
    // In production, you should use proper migrations (sequelize-cli)
    await syncDatabase({ alter: true });
    
    console.log('✓ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  runMigration();
}

module.exports = runMigration;

