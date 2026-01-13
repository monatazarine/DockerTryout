

FROM node:latest

WORKDIR /app

# Copy package files first 
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY ./ .

# Expose the app port
EXPOSE 3014

# Start the app
CMD ["node", "index.js"]

