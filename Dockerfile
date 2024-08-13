# Use the official Node.js image as the base image
FROM node:20-alpine
# Set the working directory inside the container
WORKDIR /app
# Copy the package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./
# Install project dependencies
RUN npm install -f
# Copy the rest of the application code to the container
COPY . .
#Build the Next.js app for production
RUN npm run build
# Expose the port on which Next.js app runs (Default is 3000)
EXPOSE 3001
# Set the environment variable to tell Next.js it is running in a production environment
ENV NODE_ENV=production
# Start the Next.js app
CMD ["npm", "start"]