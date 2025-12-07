# Pokemon API

Cache layer for [PokeAPI](https://pokeapi.co/) built with [Hono](https://hono.dev/) + [Bun](https://bun.sh/).

## Features

- Multi-layered caching (file + memory + HTTP)
- OpenAPI/Swagger documentation
- Filter by name, ID, type & generation
- Pagination & sorting
- Rate limiting (500 req/15min)
- Type-safe with Zod + TypeScript

## Quick Start

```bash
cp .env.example .env
bun install
bun dev
```

Server runs on `http://localhost:8000`. API docs at `/ui`.

## API Endpoints

- `GET /api/pokemon` - List with filters & pagination
- `GET /api/pokemon/:id` - Single Pokemon
- `GET /api/pokemon/types` - All types
- `GET /api/pokemon/types/:type` - Type details
- `GET /api/pokemon/generations` - All generations
- `GET /health` - Health check
- `GET /ui` - Swagger UI

## Examples

```bash
# Paginated list
curl "http://localhost:8000/api/pokemon?page=1&limit=20"

# Filter by name
curl "http://localhost:8000/api/pokemon?name=pikachu"

# Filter by type
curl "http://localhost:8000/api/pokemon?types=electric"

# Multiple types (AND)
curl "http://localhost:8000/api/pokemon?types=fire&types=flying"

# Filter by generation
curl "http://localhost:8000/api/pokemon?generation=1"

# Sorting
curl "http://localhost:8000/api/pokemon?sort=name&order=asc"

# Combined filters
curl "http://localhost:8000/api/pokemon?types=fire&generation=1&sort=name"

# Single Pokemon
curl "http://localhost:8000/api/pokemon/25"

# Type details
curl "http://localhost:8000/api/pokemon/types/fire"
```

## Production TODOs

- [ ] Migrate rate limiter from in-memory to Redis
- [ ] Add unit + integration tests
- [ ] Implement circuit breaker for PokeAPI failures
- [ ] Add cache eviction policy and size limits
- [ ] Setup monitoring and logging aggregation
- [ ] Containerize with Docker
- [ ] Setup CI/CD pipeline