# Use the official PHP base image with the version you need
FROM php:latest

# Set the working directory inside the container
WORKDIR /var/www/html

# Copy the index.php file from the host into the container
COPY . /var/www/html

# Expose port 80 to allow incoming connections to the web server
EXPOSE 80

# Start the PHP built-in web server
CMD ["php", "-S", "0.0.0.0:80"]