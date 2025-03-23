# Use the minimal lightweight Node.js Alpine image
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker caching
COPY package*.json ./

# Install dependencies with caching enabled
RUN npm install --legacy-peer-deps --omit=dev

# Copy the rest of the application files
COPY . .

# Production stage (smaller final image)
FROM node:22-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app /app

# Expose the port
EXPOSE 8001

# Start the application
CMD ["npm", "run", "dev"]
