# Base image
FROM node:16-buster-slim

# Install Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
RUN yarn add phantomjs-prebuilt --force

# Generate Prisma client
COPY prisma ./prisma/
RUN yarn prisma generate

# Bundle app source
COPY . .

# Rebuild argon2
RUN yarn add argon2

# Set environment variables
ENV CHROME_BIN=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Build the application
RUN yarn build

# Set the command to run your app
CMD [ "yarn", "start:prod" ]
