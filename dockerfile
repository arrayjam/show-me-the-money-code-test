FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install

# Build the client
RUN cd client && bun run build

EXPOSE 3000

CMD ["bun", "run", "server/src/index.ts"]