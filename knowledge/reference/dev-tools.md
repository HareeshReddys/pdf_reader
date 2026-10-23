# Dev Tools interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Build Tools and Bundlers

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/build-tools-and-bundlers

## Bundler; JavaScript Bundler; Module Bundler; Bundle Frontend App; Build Tool

- A bundler combines many project files into optimized files for the browser.

- It handles JavaScript, CSS, images, imports, and dependencies.

- It improves loading by reducing and optimizing output files.

- Without a bundler, managing many files manually becomes difficult.

- Real example: vite build converts source files into production-ready assets.

```
npm run build
```

## Vite; Vite Build Tool; Fast Dev Server; Frontend Tooling; Modern React Setup

- Vite is a modern frontend build tool with a very fast development server.

- It starts quickly because it uses native ES modules during development.

- It supports React, Vue, TypeScript, CSS, and many plugins.

- It uses Rollup internally for production builds.

- Real example: Vite is commonly used for new React interview projects.

```
npm create vite@latest my-app -- --template react
npm run dev
```

## Vite vs Webpack; Build Tool Comparison; Vite Speed; Webpack Configuration

- Vite | Webpack

- Faster dev startup | More mature ecosystem
- Uses native ES modules in dev | Bundles more during dev
- Simple default setup | Highly configurable
- Great for modern apps | Great for complex legacy setups

- Use Vite for fast and simple modern frontend projects.

- Use Webpack when the project needs deep custom build configuration.

- Vite usually needs less setup for React projects.

- Webpack is still common in older and enterprise projects.

- Real example: new React app can use Vite, while old enterprise app may still use Webpack.

## Vite Development vs Production; Vite Dev Server; Vite Build; Rollup Production Build

- Development | Production

- Fast dev server | Optimized build output
- Uses native ES modules | Uses Rollup bundling
- Focuses on speed | Focuses on performance
- Supports HMR | Minifies and optimizes files

- In development, Vite serves files quickly without full bundling.

- In production, Vite creates optimized static assets.

- Development is optimized for developer speed.

- Production is optimized for user performance.

- Real example: npm run dev for coding, npm run build for deployment.

```
npm run dev
npm run build
```

## Hot Module Replacement; HMR; Live Reload; Fast Refresh; Update Without Page Refresh

- HMR updates changed modules without refreshing the full page.

- It helps developers see changes immediately.

- It can preserve app state while updating UI code.

- React Fast Refresh is a common HMR experience in React apps.

- Real example: change a Button style and see it update without losing form input.

```
Edit component → Browser updates only that component
```

## Webpack; Webpack Module Bundler; Entry Output; Webpack Config

- Webpack is a powerful module bundler for JavaScript applications.

- It starts from an entry file and builds a dependency graph.

- It can bundle JavaScript, CSS, images, fonts, and other assets.

- It is highly configurable using loaders and plugins.

- Real example: many large React projects still use Webpack for custom build needs.

```
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js"
  }
}
```

## Webpack Loaders; Babel Loader; CSS Loader; Transform Files; Webpack Asset Handling

- Loaders tell Webpack how to process different file types.

- babel-loader converts modern JavaScript into browser-friendly JavaScript.

- css-loader helps Webpack understand CSS imports.

- Loaders run before files are added to the final bundle.

- Real example: use Babel loader to support JSX and modern JavaScript.

```
module: {
  rules: [
    { test: /\.js$/, use: "babel-loader" }
  ]
}
```

## Transpilation; Babel Transpiler; Convert Modern JavaScript; Browser Compatibility

- Transpilation converts newer JavaScript into older JavaScript.

- It helps modern code run in older browsers.

- Babel is a common tool used for JavaScript transpilation.

- TypeScript also transpiles TypeScript code into JavaScript.

- Real example: convert arrow functions into older function syntax.

```
// Modern
const add = (a, b) => a + b

// Older style
function add(a, b) {
  return a + b
}
```

## Tree Shaking; Dead Code Elimination; Remove Unused Code; Reduce Bundle Size

- Tree shaking removes unused code from the final bundle.

- It helps reduce JavaScript file size.

- It works best with ES module import and export .

- Smaller bundles load faster for users.

- Real example: import only one utility instead of shipping the full library.

```
import { debounce } from "lodash-es"
```

## Code Splitting; Dynamic Import; Lazy Loading Chunks; Reduce Initial Bundle

- Code splitting breaks one large bundle into smaller chunks.

- It loads code only when needed.

- This improves initial page load performance.

- It is commonly used with route-based lazy loading.

- Real example: load Admin page code only when user opens Admin route.

```
const AdminPage = lazy(() => import("./AdminPage"))
```

## Source Map; Sourcemap; Debug Minified Code; Browser DevTools Mapping

- A source map maps bundled/minified code back to original source code.

- It helps debug production or development errors more easily.

- Without source maps, browser errors may point to unreadable bundled code.

- Source maps are usually enabled differently for dev and production.

- Real example: find the real React component line causing an error.

```
devtool: "source-map"
```

## NPM Scripts; Package.json Scripts; Task Automation; Start Build Test Commands

- NPM scripts are shortcuts for running project commands.

- They are written inside the scripts section of package.json .

- Common scripts are dev , build , test , and lint .

- They make project commands consistent for all developers.

- Real example: run npm run build instead of remembering the full build command.

```
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  }
}
```

## Development vs Production Build; Dev Mode vs Prod Mode; Build Optimization

- Development Build | Production Build

- Faster rebuilds | Smaller optimized files
- Better debugging | Minified code
- Source maps usually enabled | Performance focused
- Used while coding | Used for deployment

- Development build focuses on speed and debugging.

- Production build focuses on performance and small file size.

- Production usually minifies, optimizes, and removes unused code.

- Always test production build before deployment.

- Real example: use npm run dev locally and npm run build before hosting.

Up next

Docker and Containers

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Docker and Containers

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/docker-and-containers

## Docker; Docker Containerization; Container Platform; App Packaging; Deployment Tool

- Docker helps run an application with the same setup on any machine.

- It packages code, dependencies, and runtime into a container.

- It avoids common issues like "it works on my machine".

- Developers use it for local development, testing, CI/CD, and production deployment.

- Real example: a Node.js app can run the same way on a laptop, server, or cloud machine.

```
# Run the image named my-app
# Map local port 3000 to container port 3000
docker run -p 3000:3000 my-app
```

## Container vs Image; Docker Image vs Container; Image Blueprint; Running Container

- Docker Image | Docker Container

- Blueprint or recipe | Running instance
- Read-only | Running and usable
- Built using Dockerfile | Started from an image
- Can create many containers | Each container is separate

- An image is the package or blueprint of the application.

- A container is the running version of that image.

- One image can be used to start many containers.

- docker build creates an image.

- docker run starts a container from an image.

```
# Build an image from the Dockerfile in the current folder
docker build -t my-app .

# Start a container from the my-app image
docker run my-app
```

## Docker Container vs Virtual Machine; Container vs VM; Docker vs VM; Lightweight Deployment

- Docker Container | Virtual Machine

- Shares host OS kernel | Runs full guest OS
- Starts very fast | Takes more time to boot
- Uses less memory | Uses more memory
- Best for app packaging | Best for full OS isolation

- Containers are lighter than virtual machines.

- A VM runs a full operating system, but a container shares the host OS kernel.

- Containers start faster and use fewer resources.

- Docker is commonly used to deploy microservices and web apps.

- Real example: multiple APIs can run as separate containers on the same server.

```
# Run the container in the background
# Give the container a simple name: api
docker run -d --name api my-node-app
```

## Dockerfile; Dockerfile Basics; Dockerfile Instructions; Build Docker Image

- A Dockerfile contains steps to build a Docker image.

- It defines the base image, working folder, dependencies, files, and start command.

- Docker reads the Dockerfile line by line and creates image layers.

- Copying package.json first helps Docker reuse cached dependency layers.

- Real example: a Node.js app Dockerfile installs packages and starts server.js .

```
# Use Node.js as the base image
FROM node:20-alpine

# Create and use /app as the working folder
WORKDIR /app

# Copy package files first for better build caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the remaining application code
COPY . .

# Document that the app uses port 3000
EXPOSE 3000

# Start the application when the container runs
CMD ["node", "server.js"]
```

## Docker Compose; Docker Compose File; docker-compose.yml; Multi Container App

- Docker Compose runs multiple containers using one config file.

- It is useful when an app needs services like API, database, and cache.

- We can start all services together using one command.

- It is commonly used for local development setup.

- Real example: run a Node.js app and PostgreSQL database together.

```
services:
  app:
    # Build the app image using the Dockerfile in this folder
    build: .
    # Open app on localhost:3000
    ports:
      - "3000:3000"

  db:
    # Use ready-made PostgreSQL image
    image: postgres:16-alpine
```

## Docker Hub; Docker Registry; Container Registry; Push Pull Docker Image

- Docker Hub is a place to store and download Docker images.

- A registry can be public or private.

- Teams push built images to a registry during CI/CD.

- Servers pull the image from the registry and run it.

- Real example: use node:20-alpine from Docker Hub as a base image.

```
# Download the Node.js image from Docker Hub
docker pull node:20-alpine

# Build and tag the image with version 1.0.0
docker build -t myorg/my-app:1.0.0 .

# Upload the image to Docker Hub or another registry
docker push myorg/my-app:1.0.0
```

## Docker Volume; Docker Volumes; Persistent Storage; Bind Mount vs Volume

- Volume | Bind Mount

- Managed by Docker | Uses a host folder
- Better for database data | Better for local development
- Works well in production | Useful for live code reload

- Containers are temporary by default, so data can be lost when removed.

- Volumes store data outside the container lifecycle.

- Volumes are commonly used for databases.

- Bind mounts are useful when local code changes should reflect inside the container.

- Real example: PostgreSQL data should be stored in a volume.

```
# Store PostgreSQL data in a Docker-managed volume
docker run -v db-data:/var/lib/postgresql/data postgres

# Mount current local folder into /app inside the container
docker run -v $(pwd):/app my-app
```

## Docker Port Mapping; Expose Ports In Docker; -p Flag; Publish Port

- Port mapping lets us access a container app from the host machine.

- EXPOSE only documents which port the app uses.

- The -p flag actually connects host port to container port.

- Format is hostPort:containerPort .

- Real example: access an app running on container port 3000 through local port 8000 .

```
# Open the app on localhost:8000
# Internally, the app still runs on container port 3000
docker run -p 8000:3000 my-app
```

## CMD vs ENTRYPOINT; Dockerfile CMD; Dockerfile ENTRYPOINT; Docker Start Command

- CMD | ENTRYPOINT

- Default command | Fixed command
- Easy to override | Always runs first
- Good for simple apps | Good for CLI-style containers

- CMD defines the default command when a container starts.

- ENTRYPOINT defines the main executable of the container.

- Use CMD for most simple application containers.

- Use both when the command is fixed but arguments can change.

- Real example: run node always and pass server.js as the default argument.

```
# Always run node first
ENTRYPOINT ["node"]

# Use server.js as the default file to run
CMD ["server.js"]
```

## Docker Environment Variables; Docker Env Vars; -e Flag; Runtime Configuration

- Environment variables configure a container at runtime.

- They help keep the same image usable in dev, test, and production.

- Do not hardcode secrets or database URLs inside a Dockerfile.

- Use -e for a few values and --env-file for many values.

- Real example: pass DATABASE_URL when starting the API container.

```
# Pass environment values directly while running the container
docker run -e NODE_ENV=production -e DATABASE_URL=postgres://... my-app

# Load many environment values from a file
docker run --env-file .env.production my-app
```

## Common Docker Commands; Docker CLI; docker ps; docker run; docker logs

- docker run creates and starts a container from an image.

- docker ps shows running containers.

- docker stop stops a running container.

- docker logs helps check application output and errors.

- docker exec -it opens a shell inside a running container for debugging.

```
# Show running containers
docker ps

# Start a new container from an image
docker run my-app

# Stop a running container by name
docker stop my-app

# View logs printed by the container
docker logs my-app

# Open a shell inside the running container
docker exec -it my-app sh
```

## Docker Container Lifecycle; Container States; Running Stopped Exited Removed

- A container can be created, running, stopped, restarted, or removed.

- docker run creates and starts a container.

- docker stop stops a running container.

- docker start restarts a stopped container.

- docker rm deletes a stopped container permanently.

```
# Create and start a container
docker run my-app

# Stop the running container
docker stop my-app

# Start the stopped container again
docker start my-app

# Remove the stopped container permanently
docker rm my-app
```

## .dockerignore File; Docker Ignore; Exclude Files; Optimize Docker Build

- .dockerignore prevents unnecessary files from being sent to Docker during build.

- It works like .gitignore .

- It makes builds faster and keeps images cleaner.

- Common files to ignore are node_modules , .git , logs, and .env .

- Real example: ignoring node_modules avoids copying local dependencies into the image.

```
# Do not copy local installed packages
node_modules

# Do not copy Git history
.git

# Do not copy secret environment files
.env

# Do not copy build output and test reports
dist
coverage
*.log
```

## Multi Stage Docker Build; Docker Multi Stage; Reduce Docker Image Size; Production Image

- Multi-stage builds create smaller and cleaner production images.

- The first stage builds the app.

- The final stage keeps only the files needed to run the app.

- It removes dev dependencies, build tools, and unnecessary source files.

- Real example: build a TypeScript app in one stage and run only compiled files in the final image.

```
# Stage 1: build the application
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: create a smaller runtime image
FROM node:20-alpine
WORKDIR /app

# Copy only the built output from the builder stage
COPY --from=builder /app/dist ./dist

# Start the compiled application
CMD ["node", "dist/server.js"]
```

Previous

Build Tools and Bundlers

Up next

Cicd and Deployment

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Cicd and Deployment

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/cicd-and-deployment

## CI/CD; Continuous Integration; Continuous Deployment; CI/CD Pipeline

- CI/CD automates testing and deployment so code reaches users faster and safer.

- CI runs checks like lint, tests, and build whenever developers push code.

- CD deploys the tested code to staging or production.

- It reduces manual mistakes during release.

- Real example: when a developer pushes code, tests run first, then the app deploys only if everything passes.

```
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm ci && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: npm run build && ./deploy.sh
```

## CI vs CD; Continuous Integration vs Continuous Delivery; Continuous Deployment; CI CD Difference

- CI | CD

- Runs tests on every change | Deploys tested code
- Catches bugs early | Helps release faster
- Happens before merge or release | Happens after build passes

- Continuous Integration checks every code change with tests and builds.

- Continuous Delivery prepares code for release, but production deployment may need approval.

- Continuous Deployment deploys every successful change to production automatically.

- Delivery is safer for teams that need manual approval.

- Deployment is useful when teams want very fast releases.

```
deploy-production:
  needs: test
  environment: production
```

## Continuous Integration; CI Automated Testing; CI Build On Every Commit; Pull Request Checks

- Continuous Integration is used to check code quality before it is merged.

- It usually runs linting, unit tests, and build commands.

- If CI fails, the pull request should not be merged.

- It helps teams catch bugs early.

- Real example: a React app can run npm test and npm run build on every pull request.

```
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## Horizontal vs Vertical Scaling; Scale Servers; Add More Servers vs Bigger Server; Application Scaling

- Horizontal Scaling | Vertical Scaling

- Adds more servers | Upgrades one server
- Better for high traffic apps | Simple for small apps
- Works well with load balancers | Has hardware limits

- Horizontal scaling means adding more servers to handle more users.

- Vertical scaling means increasing CPU or RAM of one server.

- Production apps commonly use horizontal scaling.

- Vertical scaling is simpler but has a limit.

- Real example: during a sale, an e-commerce app can add more app servers.

```
const servers = ["app-1", "app-2", "app-3"]
```

## CI/CD Pipeline; Pipeline Stages; Build Test Deploy; Release Pipeline

- A CI/CD pipeline is a step-by-step process to test, build, and deploy code.

- Common stages are install, lint, test, build, and deploy.

- Each stage should pass before the next stage starts.

- If tests fail, deployment should stop.

- Real example: only deploy to production after all tests and build are successful.

```
stages:
  - install
  - lint
  - test
  - build
  - deploy
```

## Build Step In CI/CD; Build Artifact; Compile Assets; Docker Image Build

- The build step prepares the app for deployment.

- For frontend apps, it creates files like dist/ or build/ .

- For backend apps, it may create a Docker image.

- The output is called a build artifact .

- If the build fails, the app should not be deployed.

```
npm run build
docker build -t myapp:latest .
```

## Deployment Environments; Dev Staging Production; Environment Promotion; Release Flow

- Environment | Purpose

- Development | Local coding and quick testing
- Staging | Final testing before production
- Production | Real users use the app

- Code usually moves from development to staging to production .

- Staging should be close to production setup.

- This helps catch issues before real users see them.

- Each environment can have different database URLs and API keys.

- Real example: test payment flow in staging before enabling it in production.

```
development -> staging -> production
```

## GitHub Actions; GitHub Actions CI/CD; Workflow Automation; GitHub Workflow

- GitHub Actions is GitHub's built-in tool for CI/CD automation.

- It can run tests, build code, and deploy applications.

- Workflows are written in YAML files.

- It is commonly used because it works directly inside GitHub repositories.

- Real example: run tests automatically whenever someone opens a pull request.

```
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

## GitHub Actions Workflow; Workflow YAML; Jobs and Steps; .github/workflows

- A workflow defines what should run and when it should run.

- Jobs are groups of tasks that run on a machine.

- Steps are individual commands inside a job.

- Jobs can depend on other jobs using needs .

- Real example: deploy job should run only after the test job passes.

```
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

## GitHub Actions Secrets; CI Secrets; Environment Variables; API Keys In Pipeline

- Secrets store sensitive values like API keys, tokens, and passwords.

- They should not be written directly in code or YAML files.

- GitHub masks secrets in logs for safety.

- Use secrets through ${{ secrets.SECRET_NAME }} .

- Real example: use DATABASE_URL secret during deployment.

```
steps:
  - name: Deploy
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    run: ./deploy.sh
```

## Common CI/CD Tools; Jenkins; GitHub Actions; GitLab CI; CircleCI; CI Tools

- Tool | Simple Use Case

- GitHub Actions | Best when code is on GitHub
- GitLab CI | Best when using GitLab
- Jenkins | Best for custom self-hosted pipelines
- CircleCI | Good hosted CI/CD option

- CI/CD tools help automate testing, building, and deployment.

- GitHub Actions is simple for GitHub projects.

- GitLab CI works well inside GitLab.

- Jenkins is powerful but needs more setup and maintenance.

- The best tool depends on the team, project, and hosting platform.

## GitLab CI/CD; .gitlab-ci.yml; GitLab Pipeline; GitLab Stages and Jobs

- GitLab CI/CD uses a .gitlab-ci.yml file in the project root.

- A pipeline is divided into stages like test, build, and deploy.

- Jobs inside the same stage can run in parallel.

- Later stages run only after previous stages pass.

- Real example: deploy only from the main branch.

```
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm ci
    - npm test
```

## Deployment Rollback; Rollback Bad Release; Revert To Previous Version; Production Recovery

- Rollback means going back to the last working version.

- It is useful when a new release breaks production.

- Rollback is usually faster than fixing bugs under pressure.

- Keeping previous build or Docker image makes rollback easier.

- Real example: redeploy the previous Docker image if the latest release fails.

```
docker pull myapp:previous
docker run -d myapp:previous
```

## Environment Variables In Deployment; Env Config Management; Secrets vs Config; Runtime Configuration

- Secrets | Config Values

- Sensitive values | Non-sensitive settings
- API keys, passwords, tokens | NODE_ENV , LOG_LEVEL , feature flags
- Should be protected | Can be visible to the team

- Environment variables keep configuration outside the source code.

- They allow the same app build to run in dev, staging, and production.

- Secrets should never be hardcoded.

- Config values can change based on environment.

- Real example: production and staging can use different database URLs.

```
const dbUrl = process.env.DATABASE_URL
```

## Infrastructure as Code; IaC; Terraform; CloudFormation; Infrastructure Automation

- Infrastructure as Code means creating servers and cloud resources using code files.

- It makes infrastructure changes reviewable and version-controlled.

- Tools like Terraform and CloudFormation are commonly used.

- It avoids manual setup mistakes in cloud dashboards.

- Real example: create the same server setup for staging and production using Terraform.

```
resource "aws_instance" "app" {
  ami           = "ami-123456"
  instance_type = "t3.medium"
}
```

Previous

Docker and Containers

Up next

Web Servers and Process Managers

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Web Servers and Process Managers

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/web-servers-and-process-managers

## Web Server; Web Server Meaning; HTTP Server; Website Server

- A web server receives HTTP requests and sends back HTTP responses.

- We use it to serve websites, APIs, images, CSS, and JavaScript files.

- It can send static files directly or forward requests to an app server.

- Real example: when a user opens a website, the browser talks to a web server.

- Common web servers are Nginx, Apache, and Caddy.

```
# Reload Nginx after config changes
nginx -s reload
```

## Nginx; Nginx Web Server; Reverse Proxy; Nginx Use

- Nginx is a fast web server and reverse proxy.

- We use it in front of backend apps like Node.js, Express, or Next.js.

- It can serve static files, handle HTTPS, and forward API requests.

- Real example: Nginx serves images directly and sends /api requests to Node.js.

- It is common in production because it handles many users efficiently.

```
server {
  listen 80;

  location /api/ {
    proxy_pass http://localhost:3000;
  }
}
```

## Nginx vs Apache; Web Server Comparison; Nginx Performance; Apache Server

- Nginx | Apache

- Uses event-driven handling | Uses process or thread-based handling
- Handles many users with less memory | May use more memory under heavy traffic
- Very good for static files and proxying | Very flexible with many modules
- Common with Node.js apps | Common with PHP and older hosting

- Nginx is usually preferred for modern backend and frontend deployments.

- Apache is still useful when the project needs Apache-specific features.

- For Node.js apps, Nginx is commonly used as a reverse proxy.

## Reverse Proxy; Nginx Reverse Proxy; Backend Proxy; Proxy Server

- A reverse proxy sits between users and backend servers.

- Users send requests to the proxy, and the proxy forwards them to the app.

- We use it for security, HTTPS, caching, and load balancing.

- Real example: Nginx receives the request and forwards it to Express on port 3000 .

- It hides the real backend server from direct public access.

```
location / {
  proxy_pass http://localhost:3000;
}
```

## Forward Proxy vs Reverse Proxy; Proxy Difference; Client Proxy; Server Proxy

- Forward Proxy | Reverse Proxy

- Works for the client side | Works for the server side
- Hides the client from the internet | Hides backend servers from users
- Used in offices or private networks | Used in production websites
- Example: company internet proxy | Example: Nginx before Node.js app

- Forward proxy protects or controls client traffic.

- Reverse proxy protects and manages backend traffic.

- In web app deployment, reverse proxy is used more commonly.

## SSL Termination; HTTPS Termination; TLS Termination; Nginx SSL

- SSL termination means Nginx handles HTTPS encryption and decryption.

- We use it so backend apps do not need to manage SSL directly.

- Nginx keeps the SSL certificate and forwards normal HTTP to the backend.

- Real example: the user connects with HTTPS, but Nginx sends traffic to localhost:3000 .

- This makes SSL setup easier and keeps backend apps simpler.

```
server {
  listen 443 ssl;

  location / {
    proxy_pass http://127.0.0.1:3000;
  }
}
```

## Nginx Configuration; nginx.conf; Server Block; Location Block

- Nginx configuration is written inside files like nginx.conf .

- The server block defines a domain or website.

- The location block defines how to handle a URL path.

- Real example: /api can go to Node.js and /static can serve files directly.

- Always test the config before reloading Nginx.

```
# Test Nginx config before reload
nginx -t
nginx -s reload
```

## Nginx Static Files; Serve HTML CSS JS; Static Content; File Serving

- Nginx can directly serve files like HTML, CSS, JavaScript, and images.

- We use it because serving static files through Nginx is very fast.

- This reduces load on the backend application.

- Real example: /static/app.js can be served without calling Node.js.

- Static files are often cached to make repeat visits faster.

```
location /static/ {
  root /var/www/html;
}
```

## Load Balancing; Nginx Load Balancer; Upstream Servers; Traffic Distribution

- Load balancing means sharing user requests across multiple servers.

- We use it when one backend server is not enough for all traffic.

- Nginx can send requests to different app instances using an upstream block.

- Real example: traffic is shared between apps running on ports 3001 and 3002 .

- It improves performance and helps avoid one server becoming overloaded.

```
upstream app {
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
}
```

## PM2; PM2 Process Manager; Node.js Process Manager; Production Node.js

- PM2 is a process manager for running Node.js apps in production.

- We use it to keep the app running even if it crashes.

- It can restart apps automatically and manage logs.

- Real example: an Express API can run continuously using PM2.

- PM2 is useful when deploying Node.js apps directly on a Linux server.

```
# Start a Node.js app with PM2
pm2 start server.js --name my-api
```

## PM2 Cluster Mode; pm2 -i max; Node.js Scaling; Multi-Core CPU

- Node.js normally runs one main process by default.

- PM2 cluster mode runs multiple app processes to use more CPU cores.

- We use it to handle more users on the same server.

- Real example: on a 4-core server, -i max can start 4 app instances.

- This improves traffic handling for production apps.

```
# Start app using all CPU cores
pm2 start app.js -i max
```

## PM2 Restart vs Reload; Zero Downtime Reload; PM2 Commands; Production Deploy

- Command | Meaning

- pm2 start | Starts the app for the first time
- pm2 restart | Stops and starts the app again
- pm2 reload | Restarts app instances without downtime

- restart may create a small downtime.

- reload is better for production because it restarts safely.

- Real example: use pm2 reload my-api after deploying new code.

```
pm2 reload my-api
```

## PM2 Ecosystem File; pm2.config.js; PM2 Config; Multiple Apps

- A PM2 ecosystem file stores app settings in one config file.

- We use it to manage multiple apps in a clean way.

- It can define app name, script file, instances, and environment variables.

- Real example: one file can run an API, worker, and scheduler.

- It makes production setup easier to repeat and maintain.

```
module.exports = {
  apps: [
    { name: 'api', script: 'server.js', instances: 2 },
    { name: 'worker', script: 'worker.js' },
  ],
}
```

## PM2 Monitoring; pm2 monit; pm2 logs; Process Status

- PM2 gives commands to check running apps.

- pm2 monit shows CPU and memory usage.

- pm2 logs shows logs from the running apps.

- We use these commands to debug crashes and performance issues.

- Real example: high memory usage can show a possible memory leak.

```
pm2 monit
pm2 logs
```

Previous

Cicd and Deployment

Up next

Prisma and Orm

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Prisma and Orm

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/prisma-and-orm

## ORM; Object Relational Mapping; Database ORM; ORM vs SQL

- ORM means Object Relational Mapping.

- It helps us work with database tables using normal code instead of writing raw SQL every time.

- We use it to create, read, update, and delete data more easily.

- Real example: in a user app, we can create a user using user.create() instead of writing an SQL INSERT query.

- ORM makes database code cleaner and easier to maintain.

```
await prisma.user.create({
  data: { name, email }
})
```

## Prisma; Prisma ORM; TypeScript ORM; Node.js ORM

- Prisma is an ORM mainly used with Node.js and TypeScript.

- It gives a type-safe way to talk to the database.

- We use Prisma to write database queries in simple JavaScript or TypeScript code.

- It supports databases like PostgreSQL, MySQL, SQLite, MongoDB, and CockroachDB.

- Because Prisma generates TypeScript types from the schema, the compiler catches field name typos and type mismatches before runtime.

```
const users = await prisma.user.findMany()
console.log(users[0].name)
```

## Prisma Schema; schema.prisma; Model Definition; Prisma Models

- schema.prisma is the main file where we define the database structure.

- It contains models, fields, relations, database provider, and Prisma Client generator.

- We use it so the database structure is clear in one place.

- Real example: a User model can have fields like id , name , email , and posts .

- When the schema changes, we usually create a migration for the database.

```
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

## Prisma Client; Generated Client; Type-Safe Query Builder; Database Client

- Prisma Client is the generated code we use to run database queries.

- It is created based on the models written in schema.prisma .

- We use methods like findMany , create , update , and delete .

- TypeScript can show field suggestions and catch wrong field names.

- Real example: in an admin dashboard, Prisma Client can fetch users from the database.

```
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const users = await prisma.user.findMany()
```

## Prisma Migrate; Database Migration; prisma migrate dev; Schema Changes

- Prisma Migrate helps apply schema changes to the real database.

- We use it when we add a new table, new field, or relation.

- It creates migration files that can be committed to Git.

- This helps all environments use the same database structure.

- In production, we normally use prisma migrate deploy to apply pending migrations.

```
npx prisma migrate dev --name add-user-table
npx prisma migrate deploy
```

## Prisma Relations; One-to-One; One-to-Many; Many-to-Many

- Relations show how two database tables are connected.

- One-to-many means one user can have many posts.

- One-to-one means one user can have one profile.

- Many-to-many means posts can have many tags, and tags can belong to many posts.

- In Prisma queries, we commonly use include to fetch related data.

```
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
})
```

## Prisma Query Methods; findMany; findUnique; findFirst; create update delete

- Prisma gives simple methods to work with database records.

- findMany gets many records that match a condition.

- findUnique gets one record using a unique field like id or email .

- create , update , and delete are used to insert, change, and remove records.

- These methods make database operations readable and easy to understand.

```
await prisma.user.findMany()
await prisma.user.create({ data: { name: 'John' } })
await prisma.user.update({ where: { id: 1 }, data: { name: 'Sam' } })
```

## findUnique vs findFirst; Prisma findUnique; Prisma findFirst; Query Difference

- findUnique | findFirst

- Uses only unique fields | Can use normal fields
- Best for id or unique email | Best for first matching row
- Usually faster for one exact record | Can search more broadly
- Returns one record or null | Returns first record or null

- Use findUnique when the field is marked as @id or @unique .

- Use findFirst when the field is not unique.

- Real example: use findUnique for login by unique email.

- TypeScript helps prevent using non-unique fields inside findUnique .

## Prisma Studio; Prisma Studio GUI; Database Browser; Visual Database Tool

- Prisma Studio is a visual tool to view and edit database data.

- It opens in the browser and shows tables in a simple UI.

- We use it during development to check records quickly.

- It is useful when we do not want to write SQL just to inspect data.

- Real example: we can open users, posts, and relations from the browser.

```
npx prisma studio
```

## Prisma Seed; Database Seeding; prisma db seed; Initial Data

- Seeding means adding initial or test data into the database.

- We use it to create demo users, roles, categories, or sample products.

- It helps every developer start with the same basic data.

- Seed scripts are usually written inside a file like prisma/seed.ts .

- A good practice is to avoid duplicate records when the seed runs again.

```
await prisma.user.create({
  data: { name: 'Admin', email: 'admin@example.com' }
})
```

## Prisma Transactions; $transaction; Atomic Operations; Database Transaction

- A transaction groups multiple database operations together.

- If one operation fails, the full transaction can roll back.

- We use it when all steps must succeed together.

- Real example: money transfer should debit one account and credit another account together.

- Transactions help keep database data safe and consistent.

```
await prisma.$transaction(async (tx) => {
  await tx.account.update({ where: { id: 1 }, data: { balance: 900 } })
  await tx.account.update({ where: { id: 2 }, data: { balance: 1100 } })
})
```

## N+1 Problem; ORM Performance Issue; Eager Loading; Prisma include

- N+1 problem happens when one query is followed by many extra related queries.

- Example: first fetch users, then fetch posts separately for each user.

- This can become slow when the data grows.

- In Prisma, we can often fix it by using include to load related data together.

- This is an important performance point in ORM-based applications.

```
const users = await prisma.user.findMany({
  include: { posts: true }
})
```

## Prisma select and include; select Fields; include Relations; Avoid Over-Fetching

- select is used to choose only the fields we need.

- include is used to fetch related records.

- We use them to avoid getting unnecessary data from the database.

- Real example: for a user list, we may need only id and name , not the full user record.

- This makes API responses smaller and cleaner.

```
const users = await prisma.user.findMany({
  select: { id: true, name: true }
})
```

Previous

Web Servers and Process Managers

Up next

Api Tools and Documentation

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Api Tools and Documentation

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/api-tools-and-documentation

## REST API; RESTful API; HTTP API; RESTful Principles; GET POST PUT DELETE

- REST API is a common way for frontend and backend to communicate using HTTP.

- It treats data as resources, like /users , /products , or /orders .

- GET reads data, POST creates data, PUT/PATCH updates data, and DELETE removes data.

- REST APIs are simple, scalable, and widely used in web and mobile apps.

- Real example: a shopping app uses REST APIs to load products and place orders.

```
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice"}'
```

## HTTP Status Codes; API Response Codes; 200 201 400 401 403 404 500; REST Errors

- Code | Meaning

- 200 | Request successful
- 201 | New data created
- 400 | Bad request from client
- 401 / 403 | Login or permission issue
- 404 / 500 | Not found or server error

- Status codes tell the client what happened to the request.

- Success responses usually use 200 or 201 .

- Client-side mistakes usually use 400 , 401 , 403 , or 404 .

- Server-side failures usually use 500 .

- Real example: login failure can return 401 Unauthorized .

```
if (res.status === 401) {
  showLoginError()
}
```

## Postman; API Testing Tool; Send HTTP Requests; Test REST API; API Client

- Postman is a tool used to test APIs without writing frontend code.

- We can send GET , POST , PUT , PATCH , and DELETE requests.

- It helps check request body, headers, auth tokens, and API responses.

- Developers use it to test backend APIs before connecting them to the UI.

- Real example: test a login API before building the login form.

```
{
  "email": "user@example.com",
  "password": "123456"
}
```

## Postman Collection; API Collection; Organize API Requests; Share API Tests

- A Postman collection is a group of saved API requests.

- It helps organize APIs by module, like Auth, Users, Products, and Orders.

- Collections can be shared with team members for easy testing.

- They are useful for repeated testing during development.

- Real example: keep all e-commerce APIs in one collection.

```
Auth
- Login
- Register

Products
- Get Products
- Create Product
```

## Postman Environments; Environment Variables; Dev Staging Prod; API Base URL

- Postman environments store different values for dev, staging, and production.

- They help avoid manually changing URLs and tokens again and again.

- Common variables are baseUrl , token , and userId .

- This makes API testing faster and less error-prone.

- Real example: switch from dev API to production API using one environment dropdown.

```
{{baseUrl}}/users
Authorization: Bearer {{token}}
```

## Swagger; Swagger API Documentation; OpenAPI Docs; REST API Documentation

- Swagger helps document REST APIs in a readable format.

- It shows API endpoints, request body, response format, and status codes.

- It helps frontend and backend teams understand the API contract.

- It reduces confusion because everyone follows the same documentation.

- Real example: frontend developers can check required fields before calling an API.

```
paths:
  /users:
    get:
      summary: Get users
```

## OpenAPI Specification; OpenAPI Spec; API Contract; REST API Schema

- OpenAPI is a standard format for describing REST APIs.

- It defines endpoints, methods, request data, response data, and errors.

- It acts like a contract between frontend and backend teams.

- Tools can use OpenAPI to generate docs, clients, and test cases.

- Real example: generate API documentation automatically from an OpenAPI file.

```
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
```

## Swagger UI; Interactive API Docs; Test API From Browser; OpenAPI UI

- Swagger UI displays API documentation in a browser.

- It lets developers test API requests directly from the documentation page.

- It shows required parameters, request body, and response examples.

- It is useful for quick API understanding and testing.

- Real example: test /users API from the browser without Postman.

```
GET /users
POST /users
DELETE /users/{id}
```

## API Versioning; REST API Versioning; v1 v2 API; Backward Compatibility

- API versioning helps change APIs without breaking old clients.

- Common format is /api/v1/users and /api/v2/users .

- It lets old apps keep working while new apps use updated APIs.

- Versioning is important when APIs are used by mobile apps or external clients.

- Real example: add a new response format in v2 while keeping v1 stable.

```
/api/v1/products
/api/v2/products
```

## REST vs GraphQL; REST API vs GraphQL API; API Design Choice; Query Language API

- REST | GraphQL

- Multiple endpoints | Usually one endpoint
- Fixed response shape | Client asks exact fields
- Simple and widely used | Flexible for complex data
- Easy caching with HTTP | Needs careful caching setup

- Use REST when APIs are simple and resource-based.

- Use GraphQL when clients need flexible and nested data.

- REST can over-fetch or under-fetch data sometimes.

- GraphQL helps fetch only the required fields.

- Real example: GraphQL is useful when one screen needs user, orders, and profile data together.

## CORS; Cross-Origin Resource Sharing; CORS Error; Preflight Request; Access-Control-Allow-Origin

- CORS is a browser security rule for requests between different domains.

- It controls whether one website can call an API hosted on another domain.

- Backend must allow the frontend origin using proper CORS headers.

- Preflight requests happen for some non-simple requests before the real request.

- Real example: React app on localhost:5173 calling API on localhost:3000 .

```
app.use(cors({
  origin: "http://localhost:5173"
}))
```

## API Rate Limiting; Rate Limit; Throttle API Requests; API Protection; Too Many Requests

- Rate limiting controls how many requests a user can make in a time period.

- It protects APIs from abuse, spam, and accidental heavy traffic.

- When the limit is crossed, API can return 429 Too Many Requests .

- It is commonly used for login, OTP, payment, and public APIs.

- Real example: allow only 5 login attempts per minute.

```
HTTP 429 Too Many Requests
```

## GraphQL Schema; GraphQL SDL; Type Definitions; GraphQL Types; API Contract

- A GraphQL schema defines what data clients can ask for.

- It contains types, queries, mutations, and relationships.

- Schema acts like a contract between frontend and backend.

- It helps clients know available fields before calling the API.

- Real example: define a User type with id , name , and email .

```
type User {
  id: ID!
  name: String!
  email: String!
}
```

## GraphQL Resolvers; Resolver Function; Resolve Field Data; GraphQL Backend Logic

- Resolvers are functions that return data for GraphQL fields.

- They connect GraphQL queries to databases, APIs, or services.

- Each resolver decides how to fetch or calculate the requested data.

- Resolvers are similar to controller methods in REST APIs.

- Real example: users resolver fetches users from the database.

```
const resolvers = {
  Query: {
    users: () => db.users.findMany()
  }
}
```

## GraphQL Queries vs Mutations; Read vs Write; GraphQL Query; GraphQL Mutation

- Query | Mutation

- Reads data | Changes data
- Similar to GET | Similar to POST/PUT/DELETE
- Should not modify data | Creates, updates, or deletes data

- Use query when fetching data from the server.

- Use mutation when creating, updating, or deleting data.

- Keeping them separate makes API behavior clear.

- Real example: getUsers is a query, createUser is a mutation.

```
query {
  users {
    id
    name
  }
}

mutation {
  createUser(name: "Alice") {
    id
  }
}
```

Previous

Prisma and Orm

Up next

Monitoring and Observability

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Monitoring and Observability

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/monitoring-and-observability

## Logging; Application Logs; Structured Logs; Production Debugging; Log Management

- Logging helps us understand what happened when something breaks in production.

- Structured logs like JSON are easier to search, filter, and connect with requests.

- Logs usually include request path, method, status code, response time, and error details.

- Never log sensitive data like passwords, tokens, card numbers, or personal details.

- Real example: logs help find why a login API failed for a user.

```
// Log one API request with useful details
logger.info({
  method: 'POST',
  path: '/login',
  status: 200,
  responseTime: '42ms'
})
```

## Logging vs Metrics vs Tracing; Three Pillars Of Observability; Logs Metrics Traces Difference

- Logs | Metrics | Traces

- Tell what happened | Show numbers over time | Show request journey
- Good for errors | Good for alerts | Good for microservices
- Example: DB failed | Example: CPU 80% | Example: API to DB flow

- Logs explain the exact event or error.

- Metrics show system health like CPU, memory, request count, and error rate.

- Traces show where one request travelled and where it became slow.

- Together they make production debugging much easier.

- Real example: metric alert shows issue, trace finds slow service, logs show exact error.

```
// Simple debugging flow
Metric alert -> Trace slow service -> Check logs for exact error
```

## Observability; Observability vs Monitoring; System Behavior; Production Visibility

- Monitoring tells us if something is wrong.

- Observability helps us understand why something is wrong.

- It combines logs, metrics, and traces to debug production issues.

- It is very useful when the same issue does not happen locally.

- Real example: observability can show that a slow API is caused by one slow DB query.

```
// Example flow
Slow API -> Trace request -> Find slow database query
```

## Health Check Endpoint; GET /health; Docker Health Check; Kubernetes Health Check; Service Health

- A health check endpoint tells if the service is running properly.

- Load balancers use it to decide whether to send traffic to the server.

- Docker and Kubernetes use it to restart or remove unhealthy containers.

- Keep health checks small and fast.

- Real example: /health returns 200 OK when the API is alive.

```
// Simple Express health check route
app.get('/health', (req, res) => {
  // Send success response when app is running
  res.status(200).json({ status: 'ok' })
})
```

## Error Tracking; Sentry; Production Error Monitoring; Exception Tracking; Error Dashboard

- Error tracking automatically captures production errors in one place.

- Tools like Sentry show error message, stack trace, file, line, and user context.

- It helps find bugs that may not appear during local testing.

- Source maps help show readable code instead of minified production code.

- Real example: Sentry can show which button click caused a frontend crash.

```
// Import Sentry error tracking library
import * as Sentry from '@sentry/node'

// Connect app with Sentry dashboard
Sentry.init({ dsn: process.env.SENTRY_DSN })
```

## Metrics; Application Metrics; CPU Memory Request Rate Error Rate; Performance Monitoring

- Metrics are numbers that show system health over time.

- Common metrics are CPU usage, memory usage, request count, error rate, and response time.

- Metrics help detect problems before users report them.

- Prometheus stores metrics and Grafana displays them in dashboards.

- Real example: high error rate can trigger an alert for the team.

```
# Check 5xx errors in the last 5 minutes
rate(http_requests_total{status=~"5.."}[5m])
```

## Uptime Monitoring; Website Availability Monitoring; Uptime Check; Service Availability

- Uptime monitoring checks if the website or API is reachable.

- It pings the app regularly and sends an alert when it is down.

- It is one of the basic checks every production app should have.

- Use multiple regions if users are from different countries.

- Real example: UptimeRobot can send Slack or email alerts when the site is down.

```
// Basic uptime check flow
Ping website every 5 minutes -> If no response -> Send alert
```

## Alerts; Monitoring Alerts; Production Alerts; Incident Notification; Alert Rules

- An alert notifies the team when something needs attention.

- Alerts are usually based on error rate, response time, CPU, memory, or downtime.

- Good alerts help fix issues before many users are affected.

- Avoid too many alerts because it creates alert fatigue.

- Real example: alert when CPU stays above 90% for 5 minutes.

```
// Alert rule example
CPU > 90% for 5 minutes -> Send Slack message
```

## Prometheus; Metrics Collection; Scrape Metrics; Time Series Database; PromQL

- Prometheus collects and stores application metrics over time.

- It usually reads metrics from a /metrics endpoint.

- It stores values with timestamps so we can check trends.

- It uses PromQL to query metrics.

- It is commonly used with Grafana for dashboards and alerts.

```
# Request rate for the last 5 minutes
rate(http_requests_total[5m])
```

## Grafana; Monitoring Dashboard; Metrics Visualization; Observability Dashboard; Prometheus Dashboard

- Grafana is used to create dashboards for metrics and logs.

- It can connect with Prometheus, Elasticsearch, MySQL, InfluxDB, and more.

- It helps teams see system health in one place.

- It can also send alerts based on dashboard metrics.

- Real example: a Grafana dashboard can show request rate, error rate, and API latency.

```
# Example dashboard idea
panels:
  - request_rate
  - error_rate
  - p95_latency
```

## ELK Stack; Elasticsearch Logstash Kibana; Centralized Logging; Log Search; Log Dashboard

- ELK is used to collect, store, search, and view logs from many services.

- Elasticsearch stores logs, Logstash processes logs, and Kibana shows them.

- It helps debug issues without checking each server manually.

- It is useful for microservices and distributed systems.

- Real example: search status:500 in Kibana to find errors across all services.

```
// ELK log flow
App logs -> Logstash -> Elasticsearch -> Kibana search
```

## Application Performance Monitoring; APM; Response Time Tracking; Slow API Monitoring; Production Performance

- APM tools track application performance in production.

- They show response time, error rate, slow APIs, and slow database queries.

- Tools like New Relic, Datadog, and Elastic APM are commonly used.

- APM helps find bottlenecks that are hard to see locally.

- Real example: APM can show that one DB query is making an endpoint slow.

```
// APM example result
Slow API -> 80% time in DB query -> Optimize query -> Faster response
```

## Log Aggregation; Centralized Logging; Collect Logs From Services; Log Management; Microservices Logs

- Log aggregation collects logs from all services into one searchable place.

- It helps connect events across multiple servers and containers.

- It is very useful in microservices because logs are spread across many services.

- Common tools are ELK, Loki, Datadog, and CloudWatch Logs.

- Real example: use a trace ID to find all logs related to one request.

```
# Filebeat reads logs and sends them to Elasticsearch
filebeat -e -c filebeat.yml
```

Previous

Api Tools and Documentation

Up next

Message Queues and Kafka

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Message Queues and Kafka

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/message-queues-and-kafka

## Message Queue; Background Jobs; Async Processing; Queue Workers; Task Queue

- A message queue is a place where we keep work that can run later.

- We use it when the API should respond fast without waiting for slow work.

- It helps handle background jobs like emails, reports, file processing, and notifications.

- Real example: after signup, the API saves the user and puts send welcome email into a queue.

- A worker reads the queue and completes the job separately.

```
User signs up
API saves user
API adds email job to queue
Worker sends email later
```

## Message Queue Benefits; Decoupling; Retries; Load Leveling; Reliability

- A queue separates the service that creates work from the service that processes work.

- It helps manage traffic spikes because jobs can wait in the queue.

- It makes failures easier to handle because failed jobs can be retried.

- Real example: if email service is down, signup can still work and email can retry later.

- Important point: if workers are slow, the queue size can keep growing.

```
await queue.add('send-welcome-email', { userId: user.id })
res.status(201).json({ id: user.id })
```

## RabbitMQ vs Kafka; Message Broker vs Event Streaming; RabbitMQ Use Cases; Kafka Use Cases

- RabbitMQ | Kafka

- Best for task queues | Best for event streaming
- Usually one worker handles one job | Many services can read the same event
- Good for emails, payments, uploads | Good for logs, analytics, service sync
- Works like a message broker | Works like an event log

- Use RabbitMQ when you want to process a task once.

- Use Kafka when many systems need to read the same event.

- RabbitMQ is simpler for normal background jobs.

- Kafka is powerful, but it has more setup and maintenance work.

- Real example: RabbitMQ for send-email , Kafka for user-signed-up analytics events.

## Kafka; Broker; Topic; Partition; Producer; Consumer; Offset

- Kafka is used to store and stream events between systems.

- A producer writes events to a topic like order-created or user-signed-up .

- A consumer reads events from the topic and processes them.

- Kafka uses partitions to split data and process messages in parallel.

- Ordering is guaranteed only inside one partition, not across all partitions.

```
Topic: order-created
Partition 0: order1, order4
Partition 1: order2, order5
Consumer reads events from partitions
```

## Kafka Consumer Group; Consumer Group; Offset; Parallel Processing; Kafka Reading

- A consumer group is a group of consumers working together to read a topic.

- Each partition is handled by only one consumer inside the same group.

- Different consumer groups can read the same topic independently.

- Each group keeps its own offset, so it knows which messages are already read.

- Real example: billing, inventory, and analytics can all read order-created events separately.

```
Topic: order-created
Billing group reads all events
Inventory group reads all events
Analytics group reads all events
```

## Pub/Sub Pattern; Publish Subscribe; Messaging Topic; Subscriber; Event Messaging

- Pub/sub means publishers send events without knowing who will receive them.

- Subscribers listen to topics they are interested in.

- It helps add new features without changing the publisher code.

- Real example: after user-signed-up , email, analytics, and onboarding services can all react.

- This pattern is useful when many services need the same event.

```
Publisher: user-signed-up
Email service sends welcome email
Analytics service records signup
Onboarding service creates workspace
```

## When To Use Message Queue; Async Processing; Direct API Call; Background Job; Reliability

- Use a queue when the user does not need the result immediately.

- Use it for slow, retryable, or failure-prone tasks.

- Do not use a queue when the user is waiting for an immediate answer.

- Real example: login should be direct, but thumbnail generation can run in a queue.

- For live progress, use polling, WebSocket, or Server-Sent Events.

```
await imageQueue.add('generate-thumbnail', { uploadId })
return res.json({ status: 'processing' })
```

## Dead Letter Queue; DLQ; Failed Messages; Error Handling; Retry Queue

- A dead letter queue stores messages that failed too many times.

- It keeps the main queue running instead of blocking everything.

- Developers can inspect failed messages later and fix the issue.

- Real example: if a payment job fails 3 times, it can move to the DLQ.

- Important point: always monitor the DLQ, otherwise failures can go unnoticed.

```
Queue → Retry 1 → Retry 2 → Retry 3
Failed message → DLQ
Developer fixes issue → Replay message
```

## Message Acknowledgement; Ack; Nack; At-Least-Once Delivery; At-Most-Once Delivery

- Acknowledgement means the worker tells the broker that the message is processed.

- ack means the job is done and the message can be removed.

- nack means the job failed and may need retrying.

- At-least-once delivery is safer, but the same message may run more than once.

- Important point: write idempotent code so duplicate messages do not cause problems.

```
if (payment.status === 'completed') {
  message.ack()
  return
}
await chargeCard(amount)
message.ack()
```

## Event-Driven Architecture; EDA; Events; Producer Consumer; Decoupled Services

- Event-driven architecture means services communicate by events.

- A service publishes an event, and other services react to it.

- It reduces direct dependency between services.

- Real example: order service emits order-placed , then billing, inventory, and email services react.

- This makes the system easier to extend because new listeners can be added later.

```
Order service emits order-placed
Billing charges card
Inventory reserves stock
Email sends confirmation
```

## WebSocket vs SSE vs Long Polling; Real-Time Updates; Live Status; Server Push

- WebSocket | SSE | Long Polling

- Two-way communication | Server-to-client updates | Client keeps asking server
- Best for chat and games | Best for live status updates | Simple fallback option
- More setup needed | Easier for progress updates | More repeated requests

- Use WebSocket when both client and server need to send messages anytime.

- Use SSE when the server only needs to push updates to the browser.

- Use long polling when you want a simple solution without special setup.

- Real example: job progress can be shown using SSE or polling.

- For large systems, WebSocket may need sticky sessions or shared pub/sub.

Previous

Monitoring and Observability

Up next

Architecture Patterns and Monorepos

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Architecture Patterns and Monorepos

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/architecture-patterns-and-monorepos

## MVC Pattern; Model View Controller; MVC Architecture; Separation Of Concerns

- MVC separates an application into Model, View, and Controller.

- Model handles data and business logic.

- View handles what the user sees.

- Controller receives requests and connects Model with View.

- Real example: in a user page, Controller gets request, Model fetches user, and View displays user details.

```
app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
  res.render("user", { user })
})
```

## Separation Of Concerns; SoC Principle; Clean Architecture; Separate Responsibilities

- Separation of concerns means each part of code should handle one clear responsibility.

- It keeps UI, business logic, data access, and configuration separate.

- This makes code easier to read, test, and change.

- It reduces bugs because one change affects fewer areas.

- Real example: keep API calls in a service file instead of writing them inside every component.

```
// userService.js
export const getUsers = () => fetch("/api/users")
```

## Monolith; Monolithic Architecture; Single Codebase App; When To Use Monolith

- A monolith keeps the whole application in one project or deployable unit.

- It is easier to build, test, and deploy for small or medium apps.

- Teams can move faster initially because everything is in one place.

- It can become hard to scale when the app and team grow.

- Real example: a startup MVP can start as a monolith before moving to microservices.

```
Frontend + Backend + Business Logic + Database Access
= One application
```

## Monolith vs Microservices; Architecture Comparison; When To Choose Microservices

- Monolith | Microservices

- One application | Many small services
- Easier to start | Easier to scale by service
- Simple deployment | More complex deployment
- Best for small teams | Best for large teams

- Choose monolith when the app is small and speed matters.

- Choose microservices when teams and business domains are clearly separated.

- Microservices need strong DevOps, monitoring, and communication between services.

- Monolith is not bad; it is often the best starting point.

- Real example: split payment service only when payment needs independent scaling.

## Microservices; Microservices Architecture; Distributed Services; Independently Deployable Services

- Microservices split one large app into small independent services.

- Each service owns one business capability, like users, orders, or payments.

- Services can be developed, deployed, and scaled separately.

- They communicate using APIs, events, or message queues.

- Real example: e-commerce can have separate services for Auth, Products, Orders, and Payments.

```
Auth Service → Users
Order Service → Orders
Payment Service → Payments
```

## Microservices Pros and Cons; Benefits and Challenges; Distributed System Tradeoffs

- Benefits | Challenges

- Independent deployment | More operational complexity
- Easier service-level scaling | Network failures can happen
- Better team ownership | Harder debugging
- Technology flexibility | Needs monitoring and DevOps

- Microservices help large teams work independently.

- They allow scaling only the busy services.

- They add complexity in testing, deployment, and communication.

- They are useful only when the system really needs that separation.

- Real example: scale payment service separately during high sale traffic.

## Monorepo; Monorepo Definition; Turborepo; Nx; pnpm Workspaces

- A monorepo keeps multiple apps and packages inside one repository.

- It is useful when projects share code, UI components, or configurations.

- Tools like Turborepo , Nx , and pnpm workspaces help manage monorepos.

- It improves code sharing and consistency across projects.

- Real example: keep web , admin , and ui-components inside one repo.

```
apps/
  web/
  admin/
packages/
  ui/
  config/
```

## Monorepo Benefits and Challenges; Monorepo Tradeoffs; Shared Codebase

- Benefits | Challenges

- Easy code sharing | Repo can become large
- Consistent tooling | Needs good build tooling
- Single place for changes | Permissions can be tricky
- Better refactoring | CI can become slower

- Monorepos are useful when multiple projects depend on shared code.

- They make cross-project changes easier.

- They need strong tooling to keep builds fast.

- They work well for teams managing many related apps.

- Real example: update one shared Button component used by multiple apps.

## Microfrontends; Microfrontend Architecture; Frontend Team Autonomy; Independent Frontend Apps

- Microfrontends split a large frontend into smaller independent frontend apps.

- Different teams can own and deploy different parts of the UI.

- They are useful for very large products with many frontend teams.

- They add complexity in routing, styling, shared dependencies, and performance.

- Real example: one team owns Checkout, another owns Product Search, and another owns Account.

```
Shell App
- Product App
- Checkout App
- Profile App
```

## Monorepo vs Microfrontend; Frontend Architecture Comparison; Shared Repo vs Independent UI

- Monorepo | Microfrontend

- Code organization strategy | Runtime UI architecture
- One repo for many projects | Many frontend apps combined
- Helps share code | Helps team independence
- Can still deploy together or separately | Usually deployed separately

- Monorepo is about where code lives.

- Microfrontend is about how frontend apps are split and composed.

- You can use both together in large projects.

- Monorepo is simpler; microfrontend is useful when teams need independent ownership.

- Real example: a company may keep all microfrontends inside one monorepo.

Previous

Message Queues and Kafka

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
