-- Initialize database schema

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
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

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Insert sample products
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

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
