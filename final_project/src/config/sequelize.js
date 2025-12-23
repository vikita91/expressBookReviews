const { Sequelize } = require('sequelize');
const config = require('./config');

// Create Sequelize instance with production-ready configuration
const sequelize = new Sequelize(
  config.database.database,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    
    // Connection pool configuration
    pool: {
      max: config.database.max,
      min: 5,
      acquire: 30000, // Maximum time (ms) to wait for connection
      idle: config.database.idleTimeoutMillis,
    },
    
    // Logging configuration
    logging: config.env === 'development' ? console.log : false,
    
    // Performance optimizations
    define: {
      timestamps: true,
      underscored: true, // Use snake_case for auto-generated fields
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
    },
    
    // Retry configuration for production
    retry: {
      max: 3,
      timeout: 3000,
    },
    
    // Timezone configuration
    timezone: '+00:00',
    
    // Benchmark queries in development
    benchmark: config.env === 'development',
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('✗ Unable to connect to database:', error.message);
    return false;
  }
};

// Graceful shutdown
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});

module.exports = { sequelize, testConnection, closeConnection };

