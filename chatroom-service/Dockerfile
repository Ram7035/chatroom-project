# Use official Node.js LTS image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy dependency files and install packages
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose default port (optional; we override in docker-compose)
EXPOSE 3000

# Start the app (PORT is passed via environment)
CMD ["node", "src/index.js"]
