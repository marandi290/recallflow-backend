# Node.js LTS Alpine Image
FROM node:20-alpine

# Set Working Directory
WORKDIR /app

# Copy Package Manager Manifests
COPY package*.json ./

# Install Production Dependencies
RUN npm ci --only=production

# Copy Source Code
COPY . .

# Expose API Port
EXPOSE 3000

# Environment Default
ENV NODE_ENV=production

# Healthcheck Command
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api-docs || exit 1

# Start Server
CMD ["node", "src/server.js"]
