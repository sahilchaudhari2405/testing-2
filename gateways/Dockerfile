# Dockerfile for Gateway server
FROM node:18-alpine

# Set working directory
WORKDIR /gateways

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose the application port
EXPOSE 4000

# Start the gateway server
CMD ["npm", "start"]
