# Use a smaller base image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file separately to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies with production mode (to exclude devDependencies)
RUN npm ci --omit=dev

# Copy the rest of the application files
COPY . .

# Use a minimal runtime image for the final build
FROM node:22-alpine 

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app /app

# Expose port
EXPOSE 3000

# Set default command
CMD ["npm", "run", "dev"]
