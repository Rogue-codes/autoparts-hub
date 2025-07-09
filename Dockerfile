# Stage 1: Build
FROM node:lts-alpine AS builder

WORKDIR /app

# Copy all source files
COPY . .

# Install dependencies & build
RUN npm install
RUN npx nx build @my-ladipo/api-gateway

# Stage 2: Runtime container
FROM node:lts-alpine AS runner

WORKDIR /app

# Copy the built output from the builder
COPY --from=builder /app/apps/api-gateway/dist ./

# Install only production dependencies
RUN npm install --omit=dev

# Start the application
CMD ["node", "main.js"]
