# --- Stage 1: Build the React Application ---
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app for production
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy the build output from Stage 1 to Nginx's html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (Standard Web Port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]