const { sequelize } = require('./sequelize');

async function removeUniqueConstraint() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected successfully.\n');

    // Find all unique constraints on reviews table
    console.log('Checking for unique constraints on reviews table...\n');
    const [constraints] = await sequelize.query(`
      SELECT 
        conname AS constraint_name,
        pg_get_constraintdef(oid) AS constraint_definition
      FROM pg_constraint
      WHERE conrelid = 'reviews'::regclass
      AND contype = 'u';
    `);

    if (constraints.length === 0) {
      console.log('✓ No unique constraints found on reviews table.');
      console.log('The table is already configured to allow multiple reviews per user per book.\n');
    } else {
      console.log(`Found ${constraints.length} unique constraint(s):\n`);
      constraints.forEach(constraint => {
        console.log(`  - ${constraint.constraint_name}`);
        console.log(`    ${constraint.constraint_definition}\n`);
      });

      // Drop all unique constraints
      console.log('Removing unique constraints...\n');
      for (const constraint of constraints) {
        try {
          await sequelize.query(`
            ALTER TABLE reviews 
            DROP CONSTRAINT IF EXISTS ${constraint.constraint_name};
          `);
          console.log(`✓ Removed constraint: ${constraint.constraint_name}`);
        } catch (error) {
          console.error(`✗ Failed to remove ${constraint.constraint_name}:`, error.message);
        }
      }
    }

    // Also check for unique indexes
    console.log('\nChecking for unique indexes...\n');
    const [indexes] = await sequelize.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename = 'reviews'
      AND indexdef LIKE '%UNIQUE%';
    `);

    if (indexes.length > 0) {
      console.log(`Found ${indexes.length} unique index(es):\n`);
      indexes.forEach(index => {
        console.log(`  - ${index.indexname}`);
        console.log(`    ${index.indexdef}\n`);
      });

      console.log('Removing unique indexes...\n');
      for (const index of indexes) {
        try {
          await sequelize.query(`DROP INDEX IF EXISTS ${index.indexname};`);
          console.log(`✓ Removed index: ${index.indexname}`);
        } catch (error) {
          console.error(`✗ Failed to remove ${index.indexname}:`, error.message);
        }
      }
    } else {
      console.log('✓ No unique indexes found.\n');
    }
    
    console.log('\n✓ Migration completed successfully!');
    console.log('Users can now add multiple reviews per book.\n');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

removeUniqueConstraint();
