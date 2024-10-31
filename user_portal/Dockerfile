# Use the official Node.js LTS image
FROM node:18

# Create and set the app directory
WORKDIR /usr/src/app

# Copy package.json to install dependencies
COPY package.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the Node.js application
CMD ["npm", "start"]