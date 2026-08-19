# Base image for building the web app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package configurations
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN npm install

# Copy application code
COPY apps/web ./apps/web

# Build the web application
RUN npm run build --workspace=apps/web

# Production environment
FROM nginx:alpine

# Copy built assets to Nginx
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
