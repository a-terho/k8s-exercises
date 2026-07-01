  # ============================================
  # Stage 1: Dependencies Installation Stage
  # ============================================

  ARG NODE_VERSION=alpine

  FROM node:${NODE_VERSION} AS dependencies

  # Set working directory
  WORKDIR /app
  
  # Bind package-related files to leverage Docker's caching mechanism
  # Install project dependencies with frozen lockfile for reproducible builds
  RUN --mount=type=bind,source=package.json,target=package.json \
      --mount=type=bind,source=package-lock.json,target=package-lock.json \
      --mount=type=cache,target=/root/.npm \
      if [ -f package-lock.json ]; then \
        npm ci --no-audit --no-fund; \
      else \
        echo "No lockfile found." && exit 1; \
      fi

  # ============================================
  # Stage 2: Build Next.js application in standalone mode
  # ============================================

  FROM node:${NODE_VERSION} AS builder

  # Set working directory
  WORKDIR /app

  # Copy project dependencies from dependencies stage
  COPY --from=dependencies /app/node_modules ./node_modules

  # Copy application source code
  COPY . .

  # Set build environment variables
  ENV NODE_ENV=production
  ENV NEXT_TELEMETRY_DISABLED=1

  # Build Next.js application
  RUN if [ -f package-lock.json ]; then \
        npm run build; \
      else \
        echo "No lockfile found." && exit 1; \
      fi

  # ============================================
  # Stage 3: Run Next.js application
  # ============================================

  FROM node:${NODE_VERSION} AS runner

  # Set working directory
  WORKDIR /app

  # Set production environment variables
  ENV NODE_ENV=production
  ENV PORT=3000
  ENV HOSTNAME="0.0.0.0"
  ENV NEXT_TELEMETRY_DISABLED=1

  # Copy production assets
  COPY --from=builder --chown=node:node /app/public ./public

  # Set the correct permission for prerender cache
  RUN mkdir .next
  RUN chown node:node .next

  # Automatically leverage output traces to reduce image size
  # https://nextjs.org/docs/advanced-features/output-file-tracing
  COPY --from=builder --chown=node:node /app/.next/standalone ./
  COPY --from=builder --chown=node:node /app/.next/static ./.next/static

  # Create a cache folder inside the container
  RUN mkdir -p /app/cache && chown node:node /app/cache

  # Switch to non-root user for security best practices
  # USER node

  # Expose port 3000 to allow HTTP traffic
  EXPOSE 3000

  # Start Next.js standalone server
  CMD ["node", "server.js"]