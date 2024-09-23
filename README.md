# Show Me The Money Code Test

This project is a XERO Balance Sheet viewer application built with React, TypeScript, and Bun.

## Getting Started

### Running Prerequisites

- [Docker](https://www.docker.com/get-started)

### Running with Docker

1. Clone the repository

```
git clone https://github.com/slava-class/show-me-the-money-code-test.git
cd show-me-the-money-code-test
```

2. Build and run the Docker containers (includes the dummy XERO endpoint):

```
docker-compose up --build
```

3. Access the application at http://localhost:3000

### Local Development


1. Install [bun](https://bun.sh/) and dependencies:

```
curl -fsSL https://bun.sh/install | bash
bun install
```

2. Start the development server:

```
bun run dev
```

3. Run the demo XERO server:

```
docker run -p 8091:3000 jaypeng2015/show-me-the-money
```

4. Access the application at http://localhost:3939

### Running Tests

```
bun test
```

## Project Structure

- `client/`: React application code
- `common/`: Shared code between the client and server
- `server/`: Server code

## Architecture Decision Record (ADR)

1. **Bun:** Chosen for its speed, built-in TypeScript support, and integrated test runner.
2. **React:** As usual / requested
3. **TypeScript:** As usual / requested
4. **Vite:** Used as the frontend build tool. Adopted for its fast build times and seamless integration with React.
5. **Tailwind CSS:** Used for styling
6. **Docker:** As requested for containerization
7. **Trunk:** Used as a multi-linter and formatter. Uses Biome.js for linting and formatting of source code.