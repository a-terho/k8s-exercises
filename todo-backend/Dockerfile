ARG NODE_VERSION=alpine

# Builder stage: install all dependencies and compile TypeScript
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Bind package-related files to leverage Docker's caching mechanism
# Install project dependencies in preparation for TypeScript compiler
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# Copy the source code into the container and compile TypeScript
COPY . .
RUN npm run build


# Deps stage: install production dependencies only
FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# Install project dependencies with frozen lockfile for reproducible builds
# Exclude development dependencies used by TypeScript in the build phase
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund --omit=dev


# Runner stage: minimal runtime image with compiled app and production deps
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production

# Copy production assets
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

# Switch to non-root user for security best practices
# USER node

# Expose the port that the application listens on
EXPOSE 3000

# Run the application
CMD ["node", "dist/index.js"]