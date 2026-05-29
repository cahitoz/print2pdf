FROM node:20-slim

# Install Chromium and necessary fonts/dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use the installed Chromium instead of downloading its own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set up the working directory
WORKDIR /app

# Install Node dependencies
COPY package.json ./
RUN npm install

# Copy the application code
COPY server.js ./

# Expose the API port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]