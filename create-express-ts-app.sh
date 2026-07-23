#!/bin/bash
# Express + TypeScript using tsx watch (currently wider support than Node's native TS)
# Native TypeScript execution needs Node >= 22.18 (24.x LTS recommended)
# Uses $USER as a prefix for Docker container images and node:alpine by default
# Usage: ./create-express-ts-app.sh <app-name> <docker-node-version>

set -e

PROJECT_NAME=${1:-express-ts-app}
DOCKER_NODE_VERSION=${2:-alpine}

confirm() {
    printf "%s [y/N]: " "$1"
    read answer
    case "$answer" in
        [Yy]|[Yy][Ee][Ss]) return 0 ;;
        *) return 1 ;;
    esac
}

if [ -d "$PROJECT_NAME" ]; then
  if ! confirm "Folder '$PROJECT_NAME' already exists. Files will be overwritten. Continue?"; then
    echo "Aborted"
    exit
  fi
fi

echo "Initializing project '$PROJECT_NAME'..."
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Initialize package.json
cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "private": true,
  "type": "module"
}
EOF

# Runtime deps
npm install express dotenv

# Dev deps
npm install -D typescript tsx @types/node @types/express

mkdir -p src

# --- tsconfig.json ---
# erasableSyntaxOnly + verbatimModuleSyntax keeps source compatible with Node's type stripping
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "outDir": "dist",
    "rootDir": "src",
    "allowJs": true,
    "verbatimModuleSyntax": true,
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
EOF

# --- src/index.ts ---
cat > src/index.ts << 'EOF'
import 'dotenv/config';
import express, { type Request, type Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
EOF

cat > .env << 'EOF'
PORT=3000
EOF

cat > .gitignore << 'EOF'
dist
node_modules
.env
EOF

cat > Dockerfile << EOF
ARG NODE_VERSION=$DOCKER_NODE_VERSION

# Builder stage: install all dependencies and compile TypeScript
FROM node:\${NODE_VERSION} AS builder

WORKDIR /app

# Bind package-related files to leverage Docker's caching mechanism
# Install project dependencies in preparation for TypeScript compiler
RUN --mount=type=bind,source=package.json,target=package.json \\
    --mount=type=bind,source=package-lock.json,target=package-lock.json \\
    --mount=type=cache,target=/root/.npm \\
    npm ci --no-audit --no-fund

# Copy the source code into the container and compile TypeScript
COPY . .
RUN npm run build


# Deps stage: install production dependencies only
FROM node:\${NODE_VERSION} AS deps

WORKDIR /app

# Install project dependencies with frozen lockfile for reproducible builds
# Exclude development dependencies used by TypeScript in the build phase
RUN --mount=type=bind,source=package.json,target=package.json \\
    --mount=type=bind,source=package-lock.json,target=package-lock.json \\
    --mount=type=cache,target=/root/.npm \\
    npm ci --no-audit --no-fund --omit=dev


# Runner stage: minimal runtime image with compiled app and production deps
FROM node:\${NODE_VERSION} AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production

# Copy production assets
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

# Switch to non-root user for security best practices
USER node

# Expose the port that the application listens on
EXPOSE 3000

# Run the application
CMD ["node", "dist/index.js"]
EOF

cat > Dockerfile.dev << EOF
ARG NODE_VERSION=$DOCKER_NODE_VERSION

# Development stage: install all dependencies and serve with hot-reload
FROM node:\${NODE_VERSION} AS dev

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \\
    --mount=type=bind,source=package-lock.json,target=package-lock.json \\
    --mount=type=cache,target=/root/.npm \\
    npm ci --no-audit --no-fund

# .dockerignore must include node_modules/ so dependencies will not be overridden
COPY --chown=node:node . .

USER node

# Expose the port that the application listens on
EXPOSE 3000

# Run the application in development mode
CMD ["npm", "run", "dev"]
EOF

cat > docker-compose.yml << EOF
services:
  express-prod:
    build:
      context: .
      dockerfile: Dockerfile
    image: $USER/$PROJECT_NAME:prod
    container_name: $PROJECT_NAME-prod
    environment:
      - NODE_ENV=production
    ports:
      - '3000:3000'

  express-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    image: $USER/$PROJECT_NAME:dev
    container_name: $PROJECT_NAME-dev
    environment:
      - NODE_ENV=development
    ports:
      - '3000:3000'
    volumes:
      # use local bind mounts as Docker watch sync + tsx watch is unreliable
      # with this setup only changes in /src file are reflected live to the container
      # everything else is baked into the container at build time
      - ./src:/app/src # /app is the WORKDIR in container
    develop:
      watch:
        - action: rebuild
          path: package.json
EOF

cat > .dockerignore << 'EOF'
dist/
node_modules/
Dockerfile*
docker-compose*.yml
.dockerignore
.env
.gitignore
EOF

# --- package.json tweaks ---
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.scripts = {
  ...pkg.scripts,
  dev: 'tsx watch src/index.ts',
  check: 'tsc --noEmit',
  build: 'tsc',
  start: 'node dist/index.js'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

echo ""
echo "Project '$PROJECT_NAME' created!"
echo ""
echo "cd $PROJECT_NAME"
echo ""
echo "npm run dev                    # run + watch using tsx watch"
echo "npm run check                  # separately catch type errors with tsc"
echo "npm run build                  # compile to dist/ for production"
echo "npm start                      # run compiled JS"
echo "docker compose up express-dev  # create Docker dev container"
echo "docker compose up express-prod # start app in Docker container"
