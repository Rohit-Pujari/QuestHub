# Use a small and efficient base image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package.json and lock file to leverage caching
COPY package*.json ./

# Install dependencies in production mode (exclude devDependencies)
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Use a smaller final runtime image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app /app

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
