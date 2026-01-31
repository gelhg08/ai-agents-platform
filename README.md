# AI Agents Platform API

API REST para la generación, gestión y trazabilidad de agentes de IA a gran escala.

**Stack:** NestJS + TypeScript + MySQL + Docker

---

## Objetivo

Sistema escalable que permite:
- Generar agentes IA de forma masiva y aleatoria
- Clasificarlos por categorías
- Asignar atributos dinámicos
- Mantener trazabilidad completa
- Consultar y filtrar eficientemente

---

## Levantar el proyecto

### Con Docker 

```bash
# 1. Clonar y configurar
git clone https://github.com/gelhg08/ai-agents-platform.git
cd ai-agents-platform
cp .env.example .env

# 2. Editar .env con tus credenciales
# DB_HOST=mysql
# DB_USER=your_user
# DB_PASSWORD=your_password

# 3. Levantar servicios
docker-compose up --build -d

API disponible en `http://localhost:3000` | Swagger en `/docs`

### Local

```bash
# 1. Crear base de datos y schema
mysql -u root -p -e "CREATE DATABASE ai_agents;"
mysql -u root -p ai_agents < database/schema.sql

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env: DB_HOST=localhost, DB_PORT=3306

# 4. Iniciar aplicación
npm run start:dev
```

---

## Documentación API

### Swagger UI
Documentación interactiva completa: `http://localhost:3000/docs`

### Endpoints Principales

**Categories**
```bash
POST   /categories              # Crear
GET    /categories              # Listar (paginado)
GET    /categories/:id          # Detalle
PATCH  /categories/:id          # Actualizar
DELETE /categories/:id          # Eliminar
```

**Agents**
```bash
POST   /agents/generate         # Generar N agentes
GET    /agents                  # Listar con filtros
GET    /agents/:id              # Detalle
PATCH  /agents/:id              # Actualizar
```

**Agent Attributes**
```bash
POST   /agents/:id/attributes        # Crear atributo
GET    /agents/:id/attributes        # Listar
PATCH  /agents/:id/attributes/:key   # Actualizar
DELETE /agents/:id/attributes/:key   # Eliminar
```

**Generation Logs**
```bash
GET    /generation-logs              # Historial
GET    /generation-logs?status=...   # Filtrar
```

### Ejemplo de Uso

```bash
# 1. Crear categoría
curl -X POST http://localhost:3000/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Doméstico", "description": "Tareas del hogar"}'

# 2. Generar 100 agentes
curl -X POST http://localhost:3000/agents/generate \
  -H "Content-Type: application/json" \
  -d '{"categoryId": 1, "quantity": 100, "seed": "test-123"}'

# 3. Listar agentes con filtros
curl "http://localhost:3000/agents?categoryId=1&status=active&limit=10"

# 4. Agregar atributo a un agente
curl -X POST http://localhost:3000/agents/1/attributes \
  -H "Content-Type: application/json" \
  -d '{"key": "efficiency", "value": "95%"}'
```

---

## Modelo de Datos

### Estructura

```
categories
  ├── agents (1:N)
  │   ├── agent_attributes (1:N)
  │   └── generation_logs (N:1)
  └── generation_logs (1:N)
```

### Tablas Principales

**`categories`** - Clasificación de agentes
- `UNIQUE(name)` para evitar duplicados
- Índice en `name` para búsquedas

**`agents`** - Agentes generados
- Relacionado con `categories` y `generation_logs`
- Índices compuestos: `(category_id, status)`, `(created_at)`
- Estados: `active`, `inactive`, `archived`

**`agent_attributes`** - Atributos dinámicos (key-value)
- `UNIQUE(agent_id, attr_key)` para consistencia
- `ON DELETE CASCADE` para limpieza automática

**`generation_logs`** - Auditoría de generaciones
- Estados: `pending`, `completed`, `failed`
- Guarda `seed` para reproducibilidad
- Registra errores si falla

---

## Decisiones de Diseño

### Escalabilidad
- **Índices estratégicos** en queries frecuentes (categoría + estado, atributos)
- **Normalización 3FN** para evitar redundancia
- **Batch inserts** con `save(array)` para generación masiva
- **Paginación obligatoria** en todos los listados

### Consistencia
- **Foreign keys** para integridad referencial
- **Transacciones** en generación de agentes (todo o nada)
- **UNIQUE constraints** para evitar duplicados
- **ON DELETE CASCADE** para datos huérfanos

### Reproducibilidad
- **Seed opcional** en generación (usa `seedrandom`)
- Misma seed = mismos nombres generados
- Útil para testing y debugging

---

## Tests

```bash
# Tests E2E
npm run test:e2e
```

Cobertura actual:
- Generación de agentes
- Listado paginado
- Filtros por categoría/estado

---

## Bonus Implementados

- ✅ **Docker & docker-compose** - Ejecución con un comando
- ✅ **Seed reproducible** - Generación determinística
- ✅ **Auditoría completa** - Tabla `generation_logs`
- ✅ **Swagger** - Documentación interactiva

---

## Estructura del Proyecto

```
.
├── database/schema.sql      # Script SQL
├── src/
│   ├── agents/              # Generación y gestión
│   ├── agent-attributes/    # Atributos dinámicos
│   ├── categories/          # Clasificación
│   └── generation-logs/     # Auditoría
├── test/                    # Tests E2E
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

---

## 🔧 Tecnologías

- **Node.js 20** + **TypeScript**
- **NestJS** (framework)
- **TypeORM** (ORM)
- **MySQL 8** (base de datos)
- **Docker** (contenedores)
- **Swagger** (documentación)
- **Jest + Supertest** (testing)

---

### Validaciones

Todos los DTOs usan `class-validator`:
- Tipos obligatorios
- Rangos numéricos (quantity: 1-10000)
- Formatos de string

### Manejo de Errores

Excepciones HTTP estándar:
- `404` - Recurso no encontrado
- `409` - Conflicto (ej. nombre duplicado)
- `400` - Validación fallida



