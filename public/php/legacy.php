<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legacy PHP Catalog - Otaku Shop</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }
        
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .product-card {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .product-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        
        .product-price {
            color: #667eea;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .product-category {
            background: #f0f0f0;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            color: #666;
            display: inline-block;
        }
        
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            padding: 10px 20px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
        }
        
        .back-link:hover {
            background: #5568d3;
        }
        
        .info-box {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">← Back to Next.js App</a>
        
        <h1>🎌 Legacy PHP Catalog</h1>
        <p class="subtitle">Classic PHP implementation showcasing legacy integration</p>
        
        <div class="info-box">
            <strong>ℹ️ Information:</strong> This is a legacy PHP page integrated with the Next.js application. 
            It demonstrates how modern and legacy systems can coexist.
        </div>
        
        <?php
        // Sample product data
        $products = [
            [
                'id' => 1,
                'name' => 'Attack on Titan Manga Set',
                'price' => 129.99,
                'category' => 'Manga'
            ],
            [
                'id' => 2,
                'name' => 'Naruto Action Figure',
                'price' => 49.99,
                'category' => 'Figures'
            ],
            [
                'id' => 3,
                'name' => 'Studio Ghibli Poster',
                'price' => 24.99,
                'category' => 'Posters'
            ],
            [
                'id' => 4,
                'name' => 'One Piece Volume 1-100',
                'price' => 299.99,
                'category' => 'Manga'
            ],
            [
                'id' => 5,
                'name' => 'Demon Slayer Keychain',
                'price' => 12.99,
                'category' => 'Accessories'
            ],
            [
                'id' => 6,
                'name' => 'My Hero Academia T-Shirt',
                'price' => 29.99,
                'category' => 'Apparel'
            ]
        ];
        
        echo '<div class="products-grid">';
        foreach ($products as $product) {
            echo '<div class="product-card">';
            echo '<div class="product-name">' . htmlspecialchars($product['name']) . '</div>';
            echo '<div class="product-price">$' . number_format($product['price'], 2) . '</div>';
            echo '<span class="product-category">' . htmlspecialchars($product['category']) . '</span>';
            echo '</div>';
        }
        echo '</div>';
        ?>
        
        <div style="margin-top: 30px; text-align: center; color: #666;">
            <p>Generated with PHP <?php echo phpversion(); ?></p>
            <p>Server Time: <?php echo date('Y-m-d H:i:s'); ?></p>
        </div>
    </div>
</body>
</html>
