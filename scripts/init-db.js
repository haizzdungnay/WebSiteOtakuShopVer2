const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Database configuration from environment or defaults
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'otakushop',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Test connection
    console.log('📡 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!\n');

    // Create tables
    console.log('📋 Creating tables...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Products table created\n');

    // Create indexes
    console.log('🔍 Creating indexes...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);');
    console.log('✅ Indexes created\n');

    // Create triggers
    console.log('⚡ Creating triggers...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS update_products_updated_at ON products;
      CREATE TRIGGER update_products_updated_at
      BEFORE UPDATE ON products
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Triggers created\n');

    // Check if sample data already exists
    const productCount = await pool.query('SELECT COUNT(*) FROM products');

    if (productCount.rows[0].count === '0') {
      console.log('📦 Inserting sample products...');

      await pool.query(`
        INSERT INTO products (name, description, price, image_url, category) VALUES
        ('Attack on Titan Manga Box Set', 'Complete collection of Attack on Titan manga series', 299.99, 'https://via.placeholder.com/300x400?text=Attack+on+Titan', 'Manga'),
        ('Naruto Shippuden Figure', 'High-quality Naruto Uzumaki action figure', 49.99, 'https://via.placeholder.com/300x400?text=Naruto+Figure', 'Figures'),
        ('Studio Ghibli Poster Set', 'Beautiful collection of Studio Ghibli movie posters', 34.99, 'https://via.placeholder.com/300x400?text=Ghibli+Posters', 'Posters'),
        ('One Piece Treasure Edition', 'One Piece manga volumes 1-100', 399.99, 'https://via.placeholder.com/300x400?text=One+Piece', 'Manga'),
        ('Demon Slayer Sword Replica', 'Authentic replica of Tanjiro sword', 89.99, 'https://via.placeholder.com/300x400?text=Demon+Slayer+Sword', 'Replicas'),
        ('My Hero Academia T-Shirt', 'Official MHA merchandise t-shirt', 29.99, 'https://via.placeholder.com/300x400?text=MHA+Shirt', 'Apparel'),
        ('Death Note Complete Set', 'All Death Note manga volumes', 149.99, 'https://via.placeholder.com/300x400?text=Death+Note', 'Manga'),
        ('Pokemon Plushie Collection', 'Set of 6 popular Pokemon plushies', 59.99, 'https://via.placeholder.com/300x400?text=Pokemon+Plush', 'Plushies')
        ON CONFLICT DO NOTHING;
      `);

      console.log('✅ Sample products inserted\n');
    } else {
      console.log(`ℹ️  Products table already has ${productCount.rows[0].count} items, skipping insert\n`);
    }

    // Create test user
    const userCount = await pool.query('SELECT COUNT(*) FROM users');

    if (userCount.rows[0].count === '0') {
      console.log('👤 Creating test user...');

      const hashedPassword = await bcrypt.hash('password123', 10);

      await pool.query(
        'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        ['test@otakushop.local', 'testuser', hashedPassword]
      );

      console.log('✅ Test user created');
      console.log('   Email: test@otakushop.local');
      console.log('   Password: password123\n');
    } else {
      console.log(`ℹ️  Users table already has ${userCount.rows[0].count} users, skipping test user creation\n`);
    }

    console.log('🎉 Database initialization completed successfully!\n');
    console.log('==========================================');
    console.log('Database is ready to use!');
    console.log('==========================================\n');
    console.log('You can now:');
    console.log('1. Start your Next.js app: npm run dev');
    console.log('2. Login with admin:');
    console.log('   Email: admin@otakushop.local');
    console.log('   Password: ChangeMeNow!');
    console.log('3. Or login with test user:');
    console.log('   Email: test@otakushop.local');
    console.log('   Password: password123\n');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
initializeDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
