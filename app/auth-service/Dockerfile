# Set the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the application code to the working directory
COPY . .

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
