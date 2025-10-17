# PHP Docker container for legacy pages
FROM php:8.2-apache

# Enable Apache modules
RUN a2enmod rewrite

# Install PostgreSQL extension
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Copy PHP files
COPY public/php /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose port 80
EXPOSE 80

CMD ["apache2-foreground"]
