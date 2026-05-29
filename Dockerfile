# Use the highly optimized Alpine image
FROM node:20-alpine

# Install Chromium and necessary fonts/dependencies via apk
# We also install dumb-init to handle container process termination gracefully
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Tell Puppeteer to skip downloading its own bloated Chrome binary
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# Point Puppeteer to the Alpine-installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set up the working directory
WORKDIR /app

# Copy package.json and install ONLY production dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy the application code
COPY server.js ./

# Expose the API port
EXPOSE 3000

# Start the server using dumb-init to prevent zombie Chrome processes
CMD ["dumb-init", "node", "server.js"]