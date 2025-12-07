# Pokemon API

REST API for Pokemon data built with [Hono](https://hono.dev/) + [Bun](https://bun.sh/).

## Features

- OpenAPI/Swagger documentation
- In-memory caching for fast responses
- Filter by name, ID, type & generation
- Pagination & sorting
- Rate limiting (500 req/15min)

## API Endpoints

- `GET /api/pokemon` - List with filters & pagination
- `GET /api/pokemon/:id` - Single Pokemon
- `GET /api/pokemon/types` - All types
- `GET /api/pokemon/generations` - All generations
- `GET /health` - Health check
- `GET /ui` - Swagger UI

## Quick Start

```bash
bun install
bun dev
```

Server runs on `http://localhost:8000`.

## Examples

```bash
# All Pokemon (paginated)
curl http://localhost:8000/api/pokemon?page=1&limit=20

# Filter by name
curl http://localhost:8000/api/pokemon?name=pikachu

# Filter by type
curl http://localhost:8000/api/pokemon?types=electric

# Single Pokemon
curl http://localhost:8000/api/pokemon/25
```