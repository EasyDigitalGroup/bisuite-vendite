# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Set pnpm store directory
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Copy package files
COPY pnpm-lock.yaml package.json ./

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

# Copy package files
COPY pnpm-lock.yaml package.json ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy any other necessary files (e.g., configuration files)
COPY --from=builder /app/package.json ./

# Remove unnecessary files
RUN rm -rf /app/node_modules/.cache

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]