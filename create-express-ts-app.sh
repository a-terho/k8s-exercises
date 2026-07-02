#!/bin/bash
# Express + TypeScript starter using Node's native TypeScript support
# Native TypeScript execution needs Node >= 22.18 (24.x LTS recommended)
# Usage: ./create-express-ts-app.sh <app-name>

set -e

PROJECT_NAME=${1:-express-ts-app}

mkdir "$PROJECT_NAME" && cd "$PROJECT_NAME"

echo "Initializing project '$PROJECT_NAME'..."

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

mkdir src

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
import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

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
node_modules
dist
.env
EOF

# --- package.json tweaks ---
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.scripts = {
  ...pkg.scripts,
  dev: 'node --watch src/index.ts',
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
echo "npm run dev    # run + watch, uses Node's native TS support (no type-checking)"
echo "npm run check  # separately catch type errors with tsc"
echo "npm run build  # compile to dist/ for production"
echo "npm start      # run compiled JS"
