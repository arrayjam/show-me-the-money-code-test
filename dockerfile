FROM oven/bun:1

# Create a non-root user
RUN adduser --disabled-password --gecos '' appuser

WORKDIR /app

COPY . .

RUN bun install

# Build the client
WORKDIR /app/client
RUN bun run build

# Switch back to the main app directory
WORKDIR /app

# Change ownership of the app files to the non-root user
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

EXPOSE 3000

# Add a health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["bun", "run", "server/src/index.ts"]