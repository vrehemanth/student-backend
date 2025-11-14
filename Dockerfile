# Use Node.js official image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files separately (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining project files
COPY . .

# Expose port 3000 (your server runs here)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
